import 'reflect-metadata'
import { inject } from "inversify";
import { controller, httpDelete, httpGet, httpPost, httpPut } from "inversify-express-utils";
import { authorService } from "../services/author.services";
import { Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { checkLogin } from '../middleware/checklogin.middleware';

@controller('/authors', checkLogin)
export class authorController{

    constructor(@inject('authorServices') private authorServices : authorService){}

    @httpGet('/getAllAuthors')
    async getAllAuthors(req:Request, res: Response){
        const page = req.query.page;
        res.send(await this.authorServices.getAllAuthors(page));
    }

    @httpPost('/addAuthor')
    async addAuthor(req:Request, res:Response){
        const name : string = req.body.name;
        const biography: string = req.body.biography;
        const nationality: string = req.body.nationality;
        
        const token = req.header('token') as string;
        const token_data = await jwt.verify(token, process.env.SECRETE_KEY as string) as JwtPayload;
        res.send(await this.authorServices.addAuthor(name, biography, nationality, token_data.userID));
    }

    @httpPut('/updateAuthor')
    async updateAuthor(req: Request, res:Response){
        const authorID : string = req.body.authorID
        const updatedName : string = req.body.updatedName
        const updatedBiography : string = req.body.updatedBiography
        const updatedNationality : string = req.body.updatedNationality

        const token = req.header('token') as string;
        const token_data = await jwt.verify(token, process.env.SECRETE_KEY as string) as JwtPayload;
        res.json(await this.authorServices.updateAuthor(authorID,updatedName,updatedBiography,updatedNationality,token_data.userID))
    }

    @httpDelete('/deleteAuthor')
    async deleteAuthor(req: Request, res: Response){
        const authorID: string = req.body.authorID;
        res.send(await this.authorServices.deleteAuthor(authorID));
    }

    @httpGet('/getAuthor')
    async getAuthor(req: Request, res: Response){
        const authorID: string = req.body.authorID;
        res.send(await this.authorServices.getAuthor(authorID));
    }
}