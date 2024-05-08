import 'reflect-metadata'
import { inject } from "inversify";
import { controller, httpDelete, httpGet, httpPost, httpPut } from "inversify-express-utils";
import { authorService } from "../services/author.services";
import { Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { authMiddleWare } from '../middleware/checklogin.middleware';
import { TYPES } from '../constants/types';
import { MSGS } from '../constants/messages';
import { STATUS } from '../constants/status';

@controller('/authors', TYPES.authMiddleWare)
export class authorController {

    constructor(@inject(TYPES.authorServices) private authorServices: authorService) { }

    @httpGet('/getAllAuthors')
    async getAllAuthors(req: Request, res: Response) {
        const page = req.query.page;
        const search = req.query.search;
        try {
            res.send(await this.authorServices.getAllAuthors(page, search));
        } catch (err: any) {
            res.status(STATUS.server).send({ 500: err.message })
        }
    }

    @httpPost('/addAuthor')
    async addAuthor(req: Request, res: Response) {
        const name: string = req.body.name;
        const biography: string = req.body.biography;
        const nationality: string = req.body.nationality;
        if(!name || !biography || !nationality) return res.status(STATUS.not_found).json({404: MSGS.param_required});

        try {
            const token = req.header('token') as string;
            const token_data = await jwt.verify(token, process.env.SECRETE_KEY as string) as JwtPayload;
            res.send(await this.authorServices.addAuthor(name, biography, nationality, token_data.userID));
        } catch (err: any) {
            res.status(STATUS.server).send({ 500: err.message })
        }
    }

    @httpPut('/updateAuthor')
    async updateAuthor(req: Request, res: Response) {
        const authorID: string = req.body.authorID;
        const updatedName: string = req.body.updatedName;
        const updatedBiography: string = req.body.updatedBiography;
        const updatedNationality: string = req.body.updatedNationality;

        if(!authorID || !updatedName || !updatedBiography || !updatedNationality) return res.status(STATUS.not_found).json({404 : MSGS.param_required})

        try {
            const token = req.header('token') as string;
            const token_data = await jwt.verify(token, process.env.SECRETE_KEY as string) as JwtPayload;
            res.json(await this.authorServices.updateAuthor(authorID, updatedName, updatedBiography, updatedNationality, token_data.userID))
        }catch(err:any){
            res.status(STATUS.server).send({500 : err.message});
        }
    }

    @httpDelete('/deleteAuthor')
    async deleteAuthor(req: Request, res: Response) {
        const authorID: string = req.body.authorID;
        if(!authorID) return res.status(STATUS.not_found).json({404 : MSGS.param_required});
        try{
            res.send(await this.authorServices.deleteAuthor(authorID));
        }catch(err:any){
            res.status(STATUS.server).send({500 : err.message});
        }
    }

    @httpGet('/getAuthor')
    async getAuthor(req: Request, res: Response) {
        const authorID: string = req.body.authorID;
        if(!authorID) return res.status(STATUS.not_found).json({404 : MSGS.param_required});

        try{
            res.send(await this.authorServices.getAuthor(authorID));
        }catch(err:any){
            res.status(STATUS.server).send({500 : err.message});
        }
    }
}