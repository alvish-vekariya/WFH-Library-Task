import 'reflect-metadata';
import { injectable } from "inversify";
import { categoryServiceInterface } from '../interfaces/services.interfaces';
import { httpDelete, httpGet, httpPost } from 'inversify-express-utils';
import categoryModel from '../models/category.model';
import { categoryInterface } from '../interfaces/model.interfaces';
import { MSGS } from '../constants/messages';

@injectable()
export class categoryService implements categoryServiceInterface {

    async getAllCategories(page: any, search: any): Promise<object> {
        try {
            if (search) {
                let query : any = {};
                
                query.search = {$regex: search.toString(), $options : 'i' };
                // console.log(query);

                const foundedCategory = await categoryModel.find({$or:[{category:query.search}]});

                return {foundedCategory}
            } else {
                const allCategoriesCount = await categoryModel.countDocuments({}) as number;
                const length: number = Math.ceil(allCategoriesCount / 5) as number;

                if (page == undefined || page == 1) {
                    const allCategory = await categoryModel.find({}).limit(5) as categoryInterface[];
                    return { allCategory, "page": `${1}/${length}`, "tip": MSGS.page_tip }
                } else {
                    const limitsize = 5
                    const skippage = (page - 1) * limitsize;
                    const allCategory = await categoryModel.find({}).skip(skippage).limit(5) as categoryInterface[];
                    return { allCategory, "page": `${page}/${length}` };
                }
            }
        } catch (err: any) {
            return { 500: err.message }
        }
    }

    async addCategory(categoryName: string, add_by: string): Promise<object> {
        try {
            await categoryModel.create({
                category: categoryName,
                add_by: add_by
            });
            return { 200:  MSGS.category_added}
        } catch (err: any) {
            return { 500: err.message }
        }

    }

    async updateCategory(categoryID: string, newCategoryName: string, updated_by: string): Promise<object> {
        try {
            await categoryModel.findOneAndUpdate({ _id: categoryID }, { $set: { category: newCategoryName, updated_by: updated_by } })
            return { 200:  MSGS.category_updated};
        } catch (err: any) {
            return { 500: err.message }
        }

    }

    async deleteCategory(categoryID: string): Promise<object> {

        try {
            await categoryModel.findOneAndDelete({ _id: categoryID });
            return { 200:  MSGS.category_deleted};
        } catch (err: any) {
            return { 500: err.message }
        }
    }
}