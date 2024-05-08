import 'reflect-metadata';
import { injectable } from 'inversify';
import { bookServiceInterface } from '../interfaces/services.interfaces';
import bookModel from '../models/books.model';
import { timeLog } from 'console';
import { booksInterface } from '../interfaces/model.interfaces';
import authorModel from '../models/author.model';
import categoryModel from '../models/category.model';
import { title } from 'process';
import { MSGS } from '../constants/messages';

@injectable()
export class bookService implements bookServiceInterface {
    async getAllBooks(page: any, search: any): Promise<object> {

        if (search) {
            let query: any = {};

            query.search = { $regex: search.toString(), $options: 'i' };
            // console.log(query);

            const foundedBooks = await bookModel.find({ $or: [{ title: query.search }] });

            return { foundedBooks }

        } else {
            const allBooksCount = await bookModel.countDocuments({});
            const length: number = Math.ceil(allBooksCount / 5) as number;

            if (page == undefined || page == 1) {
                const allBook = await bookModel.find({}).limit(5) as booksInterface[];
                return { allBook, "page": `1/${length}`, "tip": MSGS.page_tip }
            } else {
                const limitsize = 5
                const skippage = (page - 1) * limitsize
                const allBooks = await bookModel.find({}).skip(skippage).limit(5) as booksInterface[];
                return { allBooks, "page": `${page}/${length}`, "tip": MSGS.page_tip };
            }
        }


    }

    async addBook(title: string, author: string, category: string, isbn: number, description: string, price: number, add_by: string): Promise<object> {

        const checkAuthor = await authorModel.findOne({ _id: author });
        if (checkAuthor) {
            const checkCategory = await categoryModel.findOne({ _id: category });
            if (checkCategory) {
                await bookModel.create({
                    title: title,
                    author: author,
                    category: category,
                    isbn: isbn,
                    description: description,
                    price: price,
                    add_by: add_by
                })
                return { 200: MSGS.book_added }
            } else {
                return { 404: MSGS.book_notFound, "suggestion": "please add category first! " }
            }
        } else {
            return { 404: MSGS.author_notFound, "suggestion": "please add author first!" }
        }


    }

    async deleteBook(bookID: string): Promise<object> {

        await bookModel.findOneAndDelete({ _id: bookID });
        return { 200: MSGS.book_deleted };

    }

    async updateBook(bookID: string, title: string, author: string, category: string, isbn: number, description: string, price: number, updated_by: string): Promise<object> {

        await bookModel.findOneAndUpdate({ _id: bookID }, {
            $set: {
                title: title,
                author: author,
                category: category,
                isbn: isbn,
                description: description,
                price: price,
                updated_by: updated_by
            }
        })
        return { 200: MSGS.book_updated }

    }

    async getBook(bookID: string): Promise<object> {

        const bookDetails = await bookModel.findOne({ _id: bookID }).populate('author').populate('category') as booksInterface;
        return { bookDetails };

    }
}