import 'reflect-metadata';
import { injectable } from 'inversify';
import { bookServiceInterface } from '../interfaces/services.interfaces';
import bookModel from '../models/books.model';
import { timeLog } from 'console';
import { booksInterface } from '../interfaces/model.interfaces';
import authorModel from '../models/author.model';
import categoryModel from '../models/category.model';

@injectable()
export class bookService implements bookServiceInterface{
    async getAllBooks(page: any): Promise<object> {
        try{
            const allBooks = await bookModel.find({}) as booksInterface[];
            const length: number = Math.ceil(allBooks.length/5) as number;

            if(page == undefined || page ==1){
                const allBook = await bookModel.find({}).limit(5) as booksInterface[];
                return {allBook, "page": `1/${length}`, "tip": 'pass page in params to go that page!!' }
            }else{
                const limitsize=5
                const skippage=(page-1)*limitsize
                const allBooks =  await bookModel.find({}).skip(skippage).limit(5) as booksInterface[];
                return {allBooks, "page" : `${page}/${length}`};
            }

        }catch(err: any){
            return {500 : err.message}
        }
    }

    async addBook(title: string, author: string, category: string, isbn: number, description: string, price: number, add_by: string): Promise<object> {
        try{
            const checkAuthor = await authorModel.findOne({_id : author});
            if(checkAuthor){
                const checkCategory = await categoryModel.findOne({_id : category});
                if(checkCategory){
                    await bookModel.create({
                        title: title,
                        author : author,
                        category: category,
                        isbn: isbn,
                        description: description,
                        price: price,
                        add_by : add_by
                    })
                    return {200: 'Book added Successfully!'}
                }else{
                    return { 404 : "category is not found!!", "suggestion": "please add category first! "}
                }
            }else{
                return {404 : "author is not found!!", "suggestion" : "please add author first!"}
            }
            
        }catch(err: any){
            return {500 : err.message}
        }
    }

    async deleteBook(bookID: string): Promise<object> {
        try{
            await bookModel.findOneAndDelete({_id:bookID});
            return {200 : 'book deleted!'};
        }catch(err : any){
            return {500 : err.message}
        }
    }

    async updateBook(bookID: string, title: string, author: string, category: string, isbn: number, description: string, price: number, updated_by: string): Promise<object> {
        try{
            await bookModel.findOneAndUpdate({_id:bookID},{$set:{
                title: title,
                author : author,
                category: category,
                isbn: isbn,
                description: description,
                price: price,
                updated_by : updated_by
            }})
            return { 200 : 'book updated!!'}
        }catch(err:any){
            return { 500 : err.message}
        }
    }

    async getBook(bookID: string): Promise<object> {
        try{
            const bookDetails = await bookModel.findOne({_id:bookID}).populate('author').populate('category') as booksInterface; 
            return {bookDetails}
        }catch(err: any){
            return {500 : err.message}
        }
    }
}