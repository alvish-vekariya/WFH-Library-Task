import { injectable, inject } from "inversify";
import { controller, httpGet, httpPost } from "inversify-express-utils";
import { Request, Response } from "express";
import { TYPES } from "../constants/types";
import { userServices } from "../services";
import { STATUS, ERRORS } from "../constants";
import { eventInterface } from "../interfaces";

@controller("/user")
export class userController {
  constructor(@inject(TYPES.userServices) private userService: userServices) {}

  @httpPost("/register")
  async register(req: Request, res: Response) {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(STATUS.NOT_FOUND).send(ERRORS.PARAMETERS_NOT_FOUND);
    try {
      const resp = (await this.userService.register(
        username,
        password,
      )) as eventInterface;
      return res.status(resp.statusCode).send(resp);
    } catch (err: any) {
      return res.status(err.data.statusCode).send(err.data);
    }
  }

  @httpPost("/login")
  async login(req: Request, res: Response) {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(STATUS.NOT_FOUND).send(ERRORS.PARAMETERS_NOT_FOUND);
    try {
      const resp = (await this.userService.login(
        username,
        password,
      )) as eventInterface;
      return res.status(resp.statusCode).send(resp);
    } catch (err: any) {
      return res.status(err.data.statusCode).send(err.data);
    }
  }

  @httpPost("/logout")
  async logout(req: Request, res: Response) {
    const { username } = req.body;
    if (!username)
      return res.status(STATUS.NOT_FOUND).send(ERRORS.PARAMETERS_NOT_FOUND);
    try {
      const resp = (await this.userService.logout(username)) as eventInterface;
      return res.status(resp.statusCode).send(resp);
    } catch (err: any) {
      return res.status(err.data.statusCode).send(err.data);
    }
  }
}
