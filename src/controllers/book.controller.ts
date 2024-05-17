import { inject } from "inversify";
import {
  controller,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
} from "inversify-express-utils";
import { bookService } from "../services";
import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { TYPES, STATUS, ERRORS } from "../constants";

@controller("/books", TYPES.authMiddleWare)
export class bookController {
  constructor(@inject(TYPES.bookServices) private bookService: bookService) {}

  @httpGet("/getAllBooks")
  async getAllBooks(req: Request, res: Response) {
    const { page, search } = req.query;
    const { author, category, price } = req.query;
    const check: any = { author, category, price };

    let filter: any = {};
    for (let i in check) {
      if (check[i]) {
        filter[i] = check[i];
      }
    }
    // console.log(filter);
    try {
      res.send(await this.bookService.getAllBooks(page, search, filter));
    } catch (err: any) {
      res.status(err.data.statusCode).send(err.data);
    }
  }

  @httpPost("/addBook")
  async addBook(req: Request, res: Response) {
    const { title, author, category, isbn, description, price } = req.body;
    const token = req.header("token") as string;

    if (
      !title ||
      !author ||
      !category ||
      !isbn ||
      !description ||
      !price ||
      !token
    )
      return res.status(STATUS.NOT_FOUND).json(ERRORS.PARAMETERS_NOT_FOUND);

    try {
      const token_data = (await jwt.verify(
        token,
        process.env.SECRETE_KEY as string,
      )) as JwtPayload;
      res.send(
        await this.bookService.addBook(
          title,
          author,
          category,
          isbn,
          description,
          price,
          token_data.userID,
        ),
      );
    } catch (err: any) {
      if (err.code && err.code === 11000) {
        return res.status(STATUS.CONFLICT).send(ERRORS.DUPLICATION_ERROR);
      } else {
        return res.status(err.data.statusCode).send(err.data);
      }
    }
  }

  @httpDelete("/deleteBook")
  async deleteBook(req: Request, res: Response) {
    const { bookID } = req.body;

    try {
      res.send(await this.bookService.deleteBook(bookID));
    } catch (err: any) {
      if (err.code && err.code === 11000) {
        return res.status(STATUS.CONFLICT).send(ERRORS.DUPLICATION_ERROR);
      } else {
        return res.status(err.data.statusCode).send(err.data);
      }
    }
  }

  @httpPut("/updateBook")
  async updateBook(req: Request, res: Response) {
    const { bookID, title, author, category, isbn, description, price } =
      req.body;
    const token = req.header("token") as string;
    const token_data = (await jwt.verify(
      token,
      process.env.SECRETE_KEY as string,
    )) as JwtPayload;

    if (
      !title ||
      !author ||
      !category ||
      !isbn ||
      !description ||
      !price ||
      !bookID ||
      !token
    )
      return res.status(STATUS.NOT_FOUND).json(ERRORS.PARAMETERS_NOT_FOUND);

    try {
      return res.send(
        await this.bookService.updateBook(
          bookID,
          title,
          author,
          category,
          isbn,
          description,
          price,
          token_data.userID,
        ),
      );
    } catch (err: any) {
      if (err.code && err.code === 11000) {
        return res.status(STATUS.CONFLICT).send(ERRORS.DUPLICATION_ERROR);
      } else {
        return res.status(err.data.statusCode).send(err.data);
      }
    }
  }

  @httpGet("/getBook")
  async getBook(req: Request, res: Response) {
    const { bookID } = req.body;

    if (!bookID)
      return res.status(STATUS.NOT_FOUND).json(ERRORS.PARAMETERS_NOT_FOUND);

    try {
      return res
        .status(STATUS.SUCCESS)
        .send(await this.bookService.getBook(bookID));
    } catch (err: any) {
      return res.status(err.data.statusCode).send(err.data);
    }
  }
}
