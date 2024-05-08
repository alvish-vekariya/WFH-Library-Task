import { controller, httpGet, httpDelete, httpPost, httpPut } from "inversify-express-utils";
import { categoryService } from "../services/category.services";
import { inject } from "inversify";
import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { authMiddleWare} from "../middleware/checklogin.middleware";
import { TYPES } from "../constants/types";

@controller('/category', TYPES.authMiddleWare)
export class categoryController{

    constructor(@inject(TYPES.categoryServices) private categoryService : categoryService){}

    @httpGet('/getAllCategories')
    async getCategories(req: Request, res: Response){
        const page = req.query.page;
        const search = req.query.search;
        res.send(await this.categoryService.getAllCategories(page, search));
    }

    @httpPost('/addCategory')
    async addCategory(req :Request, res: Response){
        const categoryName : string = req.body.categoryName;
        const token : string = req.header('token') as string;
        const token_data = await jwt.verify(token, process.env.SECRETE_KEY as string) as JwtPayload;
        res.send(await this.categoryService.addCategory(categoryName, token_data.userID));
    }
    
    @httpDelete('/deleteCategory')
    async deleteCategory(req: Request, res: Response){
        const categoryID : string = req.body.categoryID;
        res.send(await this.categoryService.deleteCategory(categoryID));
    }

    @httpPut('/updateCategory')
    async updateCategory(req:Request, res: Response){
        const categoryID : string = req.body.categoryID;
        const newCategoryName : string = req.body.newCategoryName;
        const token : string = req.header('token') as string;
        const token_data = await jwt.verify(token, process.env.SECRETE_KEY as string) as JwtPayload;
        res.send(await this.categoryService.updateCategory(categoryID, newCategoryName, token_data.userID));
    }
}