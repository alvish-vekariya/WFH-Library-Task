import "reflect-metadata";
import { injectable } from "inversify";
import { categoryServiceInterface, categoryInterface } from "../interfaces";
import { categoryModel } from "../models";
import { MSGS, EVENT_MSG } from "../constants";

@injectable()
export class categoryService implements categoryServiceInterface {
  async getAllCategories(page: any, search: any): Promise<object> {
    if (search) {
      let query: any = {};

      query.search = { $regex: search.toString(), $options: "i" };
      // console.log(query);

      const foundedCategory = await categoryModel.find({
        $or: [{ category: query.search }],
      });

      return { foundedCategory };
    } else {
      const allCategoriesCount = (await categoryModel.countDocuments(
        {},
      )) as number;
      const length: number = Math.ceil(allCategoriesCount / 5) as number;

      if (page == undefined || page == 1) {
        const allCategory = (await categoryModel
          .find({})
          .limit(5)) as categoryInterface[];
        return { allCategory, page: `${1}/${length}`, tip: MSGS.page_tip };
      } else {
        const limitsize = 5;
        const skippage = (page - 1) * limitsize;
        const allCategory = (await categoryModel
          .find({})
          .skip(skippage)
          .limit(5)) as categoryInterface[];
        return { allCategory, page: `${page}/${length}` };
      }
    }
  }

  async addCategory(categoryName: string, add_by: string): Promise<object> {
    await categoryModel.create({
      category: categoryName,
      addBy: add_by,
    });
    return EVENT_MSG.CATEGORY_ADDED;
  }

  async updateCategory(
    categoryID: string,
    newCategoryName: string,
    updated_by: string,
  ): Promise<object> {
    await categoryModel.findOneAndUpdate(
      { _id: categoryID },
      { $set: { category: newCategoryName, updatedBy: updated_by } },
    );
    return EVENT_MSG.CATEGORY_UPDATED;
  }

  async deleteCategory(categoryID: string): Promise<object> {
    await categoryModel.findOneAndDelete({ _id: categoryID });
    return EVENT_MSG.CATEGORY_DELETED;
  }
}
