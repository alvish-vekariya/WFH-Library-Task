import { inject } from "inversify";
import { controller, httpDelete, httpGet, httpPost, httpPut } from "inversify-express-utils";
import { bookService } from "../services/book.services";
import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { authMiddleWare } from "../middleware/checklogin.middleware";
import { TYPES } from "../constants/types";
import { MSGS } from "../constants/messages";
import { STATUS } from "../constants/status";

@controller('/books', TYPES.authMiddleWare)
export class bookController {
    constructor(@inject(TYPES.bookServices) private bookService: bookService) { }

    @httpGet('/getAllBooks')
    async getAllBooks(req: Request, res: Response) {
        const page = req.query.page;
        const search = req.query.search;
        // console.log(page);
        try {
            res.send(await this.bookService.getAllBooks(page, search))
        } catch (err: any) {
            res.status(STATUS.server).send({ 500: err.message });
        }
    }

    @httpPost('/addBook')
    async addBook(req: Request, res: Response) {
        const title: string = req.body.title;
        const author: string = req.body.author;
        const category: string = req.body.category;
        const isbn: number = req.body.isbn;
        const description: string = req.body.description;
        const price: number = req.body.price;

        if(!title || !author || !category || !isbn || !description || !price) return res.status(STATUS.not_found).json({404 :MSGS.param_required});

        try {
            const token = req.header('token') as string;
            const token_data = await jwt.verify(token, process.env.SECRETE_KEY as string) as JwtPayload;
            res.send(await this.bookService.addBook(title, author, category, isbn, description, price, token_data.userID));
        }catch(err : any){
            res.status(STATUS.server).send({500 :err.message});
        }
    }

    @httpDelete('/deleteBook')
    async deleteBook(req: Request, res: Response) {
        const bookID: string = req.body.bookID;

        try{
            res.send(await this.bookService.deleteBook(bookID));
        }catch(err :any){
            res.status(STATUS.server).send({500 : err.message});
        }
    }

    @httpPut('/updateBook')
    async updateBook(req: Request, res: Response) {
        const bookID: string = req.body.bookID;
        const title: string = req.body.title;
        const author: string = req.body.author;
        const category: string = req.body.category;
        const isbn: number = req.body.isbn;
        const description: string = req.body.description;
        const price: number = req.body.price;
        const token = req.header('token') as string;
        const token_data = await jwt.verify(token, process.env.SECRETE_KEY as string) as JwtPayload;

        if(!title || !author || !category || !isbn || !description || !price || !bookID || !token) return res.status(STATUS.not_found).json({404 :MSGS.param_required});

        
        try{
            res.send(await this.bookService.updateBook(bookID, title, author, category, isbn, description, price, token_data.userID));
        }catch(err : any){
            res.status(STATUS.server).send({500 : err.message});
        }

    }

    @httpGet('/getBook')
    async getBook(req: Request, res: Response) {
        const bookID: string = req.body.bookID;

        if(!bookID) return res.status(STATUS.not_found).json({404 : MSGS.param_required});

        try{
            res.send(await this.bookService.getBook(bookID));
        }catch(err: any){
            res.status(STATUS.server).send({ 500 : err.message});
        }
    }
}