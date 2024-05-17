import { injectable } from "inversify";
import { authorServiceInterface, authorsInterface } from "../interfaces";
import { authorModel } from "../models";
import { MSGS, EVENT_MSG, ERRORS } from "../constants";
import { customError } from "../handlers";

@injectable()
export class authorService implements authorServiceInterface {
  async getAllAuthors(page: any, search: any): Promise<object> {
    if (search) {
      let query: any = {};

      // query.search = new RegExp(search.toString(), 'i')
      query.search = { $regex: search.toString(), $options: "i" };
      // console.log(query);

      const foundAuthor = await authorModel.find({
        $or: [{ authorName: query.search }],
      });

      return { foundAuthor };
    } else {
      const allAuthorsCount = (await authorModel.countDocuments({})) as number;
      const length: number = Math.ceil(allAuthorsCount / 5) as number;
      // return {allAuthors};
      if (page == undefined || page == 1) {
        const allAuthor = (await authorModel
          .find({})
          .limit(5)) as authorsInterface[];
        return { allAuthor, page: `${1}/${length}`, tip: MSGS.page_tip };
      } else {
        const limitsize = 5;
        const skippage = (page - 1) * limitsize;
        const allAuthor = (await authorModel
          .find({})
          .skip(skippage)
          .limit(5)) as authorsInterface[];
        return { allAuthor, page: `${page}/${length}`, tip: MSGS.page_tip };
      }
    }
  }

  async addAuthor(
    name: string,
    biography: string,
    nationality: string,
    add_by: string,
  ): Promise<object> {
    await authorModel.create({
      authorName: name,
      biography: biography,
      nationality: nationality,
      addBy: add_by,
    });

    // console.log(check.errors);
    return EVENT_MSG.AUTHOR_ADDED;
  }

  async updateAuthor(
    authorID: string,
    updatedName: string,
    updatedBiography: string,
    updatedNationality: string,
    updated_by: string,
  ): Promise<object> {
    await authorModel.findOneAndUpdate(
      { _id: authorID },
      {
        $set: {
          authorName: updatedName,
          biography: updatedBiography,
          nationality: updatedNationality,
          updatedBy: updated_by,
        },
      },
    );

    return EVENT_MSG.AUTHOR_UPDATED;
  }

  async deleteAuthor(authorID: string): Promise<object> {
    await authorModel.findOneAndDelete({ _id: authorID });
    return EVENT_MSG.AUTHOR_DELETED;
  }

  async getAuthor(authorID: string): Promise<object> {
    const foundAuthor = (await authorModel.findOne({
      _id: authorID,
    })) as authorsInterface;
    if (foundAuthor) {
      const resp = { ...EVENT_MSG.AUTHOR_FOUND, foundAuthor };
      return resp;
    } else {
      throw new customError(MSGS.author_notFound, ERRORS.AUTHOR_NOT_FOUND);
    }
  }
}
