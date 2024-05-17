import "reflect-metadata";
import { inject } from "inversify";
import {
  controller,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
} from "inversify-express-utils";
import { authorService } from "../services/author.services";
import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { TYPES } from "../constants/types";
import { MSGS } from "../constants/messages";
import { STATUS } from "../constants/status";
import { ERRORS } from "../constants/errors";

@controller("/authors", TYPES.authMiddleWare)
export class authorController {
  constructor(
    @inject(TYPES.authorServices) private authorServices: authorService,
  ) {}

  @httpGet("/getAllAuthors")
  async getAllAuthors(req: Request, res: Response) {
    const { page, search } = req.query;
    try {
      return res.send(await this.authorServices.getAllAuthors(page, search));
    } catch (err: any) {
      res.status(STATUS.SERVER).send({ 500: err.message });
    }
  }

  @httpPost("/addAuthor")
  async addAuthor(req: Request, res: Response) {
    const { name, biography, nationality } = req.body;
    if (!name || !biography || !nationality)
      return res.status(STATUS.NOT_FOUND).json({ 404: MSGS.param_required });

    try {
      const token = req.header("token") as string;
      const token_data = (await jwt.verify(
        token,
        process.env.SECRETE_KEY as string,
      )) as JwtPayload;
      res.send(
        await this.authorServices.addAuthor(
          name,
          biography,
          nationality,
          token_data.userID,
        ),
      );
    } catch (err: any) {
      if (err.code && err.code === 11000) {
        res.status(STATUS.CONFLICT).send(ERRORS.DUPLICATION_ERROR);
      } else {
        res.status(err.data.statusCode).send(err.data);
      }
    }
  }

  @httpPut("/updateAuthor")
  async updateAuthor(req: Request, res: Response) {
    const { authorID, updatedName, updatedBiography, updatedNationality } =
      req.body;

    if (!authorID || !updatedName || !updatedBiography || !updatedNationality)
      return res.status(STATUS.NOT_FOUND).json({ 404: MSGS.param_required });

    try {
      const token = req.header("token") as string;
      const token_data = (await jwt.verify(
        token,
        process.env.SECRETE_KEY as string,
      )) as JwtPayload;
      res.json(
        await this.authorServices.updateAuthor(
          authorID,
          updatedName,
          updatedBiography,
          updatedNationality,
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

  @httpDelete("/deleteAuthor")
  async deleteAuthor(req: Request, res: Response) {
    const { authorID } = req.body;
    if (!authorID)
      return res.status(STATUS.NOT_FOUND).json({ 404: MSGS.param_required });
    try {
      res.send(await this.authorServices.deleteAuthor(authorID));
    } catch (err: any) {
      res.status(err.data.statusCode).send(err.data);
    }
  }

  @httpGet("/getAuthor")
  async getAuthor(req: Request, res: Response) {
    const { authorID } = req.body;
    if (!authorID)
      return res.status(STATUS.NOT_FOUND).json({ 404: MSGS.param_required });

    try {
      res.send(await this.authorServices.getAuthor(authorID));
    } catch (err: any) {
      res.status(err.data.statusCode).send(err.data);
    }
  }
}
