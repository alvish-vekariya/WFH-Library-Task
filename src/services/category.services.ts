import "reflect-metadata";
import { injectable } from "inversify";
import { categoryServiceInterface, categoryInterface } from "../interfaces";
import { categoryModel } from "../models";
import { MSGS, EVENT_MSG } from "../constants";

@injectable()
export class categoryService implements categoryServiceInterface {
  async getAllCategories(page: any, search: any): Promise<object> {

    let pipeline: any = [];
    if(page ==undefined) page = 1;
    const limitsize = 5;

    if (search) {

      pipeline.push({$match : {category : { $regex: search, $options: "i" }}});
  
    } else {
    
        const skippage = (page - 1) * limitsize;
        // pipeline.push({$limit : limitsize});
        pipeline.push({$skip : skippage});
      
    }
    // console.log(pipeline);
    const category = await categoryModel.aggregate([...pipeline]) as categoryInterface[];
    const getLength = category.length;
    return {"category" : category.slice(0,5), "page" : `${page}/${Math.ceil(getLength/limitsize)}`, "tip" : MSGS.page_tip};
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
