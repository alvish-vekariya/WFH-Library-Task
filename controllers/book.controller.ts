import { inject } from "inversify";
import { controller, httpDelete, httpGet, httpPost, httpPut } from "inversify-express-utils";
import { bookService } from "../services/book.services";
import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { checkLogin } from "../middleware/checklogin.middleware";

@controller('/books', checkLogin)
export class bookController {
    constructor(@inject('bookServices') private bookService : bookService){}

    @httpGet('/getAllBooks')
    async getAllBooks(req: Request, res: Response){
        const page = req.query.page;
        const search = req.query.search;
        // console.log(page);
        res.send(await this.bookService.getAllBooks(page, search))
    }

    @httpPost('/addBook')
    async addBook(req: Request, res: Response){
        const title : string = req.body.title;
        const author : string = req.body.author;
        const category : string = req.body.category;
        const isbn : number = req.body.isbn;
        const description : string = req.body.description;
        const price: number = req.body.price;

        const token = req.header('token') as string;
        const token_data = await jwt.verify(token, process.env.SECRETE_KEY as string) as JwtPayload;
        res.send(await this.bookService.addBook(title, author,category, isbn, description, price, token_data.userID));
    }

    @httpDelete('/deleteBook')
    async deleteBook(req: Request, res: Response){
        const bookID : string = req.body.bookID;

        res.send(await this.bookService.deleteBook(bookID));
    }

    @httpPut('/updateBook')
    async updateBook(req: Request, res:Response){
        const bookID : string = req.body.bookID;
        const title : string = req.body.title;
        const author : string = req.body.author;
        const category : string = req.body.category;
        const isbn : number = req.body.isbn;
        const description : string = req.body.description;
        const price: number = req.body.price;
        const token = req.header('token') as string;
        const token_data = await jwt.verify(token, process.env.SECRETE_KEY as string) as JwtPayload;
        res.send(await this.bookService.updateBook(bookID, title, author, category, isbn, description, price, token_data.userID));
    }

    @httpGet('/getBook')
    async getBook(req: Request, res: Response){
        const bookID : string = req.body.bookID;
        
        res.send(await this.bookService.getBook(bookID));
    }
}