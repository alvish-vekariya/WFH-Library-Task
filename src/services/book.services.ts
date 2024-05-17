import "reflect-metadata";
import { injectable } from "inversify";
import { bookServiceInterface, booksInterface } from "../interfaces";
import { bookModel, authorModel, categoryModel } from "../models";
import { MSGS, EVENT_MSG, ERRORS } from "../constants";
import { customError, provideData } from "../handlers";

@injectable()
export class bookService implements bookServiceInterface {
  async getAllBooks(page: any, search: any, filter: any): Promise<object> {
    const returnedValues = await provideData(page, search, filter);
    return { ...returnedValues };
  }

  async addBook(
    title: string,
    author: string,
    category: string,
    isbn: number,
    description: string,
    price: number,
    add_by: string,
  ): Promise<object> {
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
          addBy: add_by,
        });
        return EVENT_MSG.BOOK_ADDED;
      } else {
        throw new customError(MSGS.category_notfound, {
          ...ERRORS.CATEGORY_NOT_FOUND,
          suggestion: "please add category first! ",
        });
      }
    } else {
      throw new customError(MSGS.author_notFound, {
        ...ERRORS.AUTHOR_NOT_FOUND,
        suggestion: "please add author first!",
      });
    }
  }

  async deleteBook(bookID: string): Promise<object> {
    await bookModel.findOneAndDelete({ _id: bookID });
    return EVENT_MSG.BOOK_DELETED;
  }

  async updateBook(
    bookID: string,
    title: string,
    author: string,
    category: string,
    isbn: number,
    description: string,
    price: number,
    updated_by: string,
  ): Promise<object> {
    await bookModel.findOneAndUpdate(
      { _id: bookID },
      {
        $set: {
          title: title,
          author: author,
          category: category,
          isbn: isbn,
          description: description,
          price: price,
          updatedBy: updated_by,
        },
      },
    );
    return EVENT_MSG.BOOK_UPDATED;
  }

  async getBook(bookID: string): Promise<object> {
    const bookDetails = (await bookModel
      .findOne({ _id: bookID })
      .populate("author")
      .populate("category")) as booksInterface;
    if (bookDetails) {
      return { bookDetails };
    } else {
      return new customError(MSGS.book_notFound, ERRORS.BOOK_NOT_FOUND);
    }
  }
}
