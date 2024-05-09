import { controller, httpGet, httpDelete, httpPost, httpPut } from "inversify-express-utils";
import { categoryService } from "../services/category.services";
import { inject } from "inversify";
import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { authMiddleWare} from "../middleware/checklogin.middleware";
import { TYPES } from "../constants/types";
import { MSGS } from "../constants/messages";
import { STATUS } from "../constants/status";
import { ERRORS } from "../constants/errors";

@controller('/category', TYPES.authMiddleWare)
export class categoryController{

    constructor(@inject(TYPES.categoryServices) private categoryService : categoryService){}

    @httpGet('/getAllCategories')
    async getCategories(req: Request, res: Response){
        const {page, search} = req.query;
        try{
            res.send(await this.categoryService.getAllCategories(page, search));
        }catch(err: any){
            res.status(err.data.statusCode).send(err.data);
        }
    }

    @httpPost('/addCategory')
    async addCategory(req :Request, res: Response){
        const {categoryName} = req.body
        const token : string = req.header('token') as string;
        const token_data = await jwt.verify(token, process.env.SECRETE_KEY as string) as JwtPayload;

        if(!categoryName || !token) return res.status(STATUS.NOT_FOUND).json({404 : MSGS.param_required});
        try{
            res.send(await this.categoryService.addCategory(categoryName, token_data.userID));
        }catch(err : any){
            if(err.code && err.code == 11000){
                res.status(STATUS.CONFLICT).send(ERRORS.DUPLICATION_ERROR);
            }else{
                res.status(err.data.statusCode).send(err.data);
            }
        }
    }
    
    @httpDelete('/deleteCategory')
    async deleteCategory(req: Request, res: Response){
        const {categoryID}  = req.body;
        if(!categoryID) return res.status(STATUS.NOT_FOUND).json({404 : MSGS.param_required});
        try{
            res.send(await this.categoryService.deleteCategory(categoryID));
        }catch(err : any){
            res.status(err.data.statusCode).send(err.data);
        }
    }

    @httpPut('/updateCategory')
    async updateCategory(req:Request, res: Response){
        const {categoryID, newCategoryName}  = req.body;
        const token : string = req.header('token') as string;
        const token_data = await jwt.verify(token, process.env.SECRETE_KEY as string) as JwtPayload;
        if(!categoryID || !newCategoryName || !token) return res.status(STATUS.NOT_FOUND).json({404 : MSGS.param_required});
        try{
            res.send(await this.categoryService.updateCategory(categoryID, newCategoryName, token_data.userID));
        }catch(err : any){
            if(err.code && err.code == 11000){
                res.status(STATUS.CONFLICT).send(ERRORS.DUPLICATION_ERROR);
            }else{
                res.status(err.data.statusCode).send(err.data);
            }
        }
    }
}