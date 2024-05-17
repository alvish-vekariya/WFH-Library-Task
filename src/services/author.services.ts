import { injectable } from "inversify";
import { authorServiceInterface, authorsInterface } from "../interfaces";
import { authorModel } from "../models";
import { MSGS, EVENT_MSG, ERRORS } from "../constants";
import { customError } from "../handlers";

@injectable()
export class authorService implements authorServiceInterface {
  async getAllAuthors(page: any, search: any): Promise<object> {

    let pipeline: any = [];
    const limitsize = 5;
    if(page == undefined) page = 1;
    if (search) {
      pipeline.push({$match : {$or : [{authorName: { $regex: search, $options: "i" }}, {nationality : {$regex : search, $options :"i"}}]}});
      
    } else {
      // if (page == 1) {
      //   pipeline.push({$match : {}});
      // } else {
        const skippage = (page - 1) * limitsize;
        // pipeline.push({$limit : limitsize});
        pipeline.push({$skip : skippage});
      // }
    }
    
    const authors = await authorModel.aggregate([...pipeline]) as authorsInterface[];
    const getLength = authors.length;
    return {"authos" : authors.slice(0,5) , "page" : `${page}/${Math.ceil(getLength/limitsize)}`, "tip" : MSGS.page_tip};
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
