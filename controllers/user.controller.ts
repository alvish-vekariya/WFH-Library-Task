import { injectable, inject } from "inversify";
import { controller, httpGet, httpPost } from "inversify-express-utils";
import { Request, Response } from "express";
import { usersServiceInterface } from "../interfaces/services.interfaces";
import { TYPES } from "../constants/types";

@controller('/user')
export class userController{
    constructor(@inject(TYPES.userServices) private userService: usersServiceInterface){}

    @httpPost('/register')
    async register(req: Request, res: Response){
        const username: string = req.body.username;
        const password: string = req.body.password;
        res.status(200).send(await this.userService.register(username, password));
    }

    @httpPost('/login')
    async login(req: Request, res: Response){
        const username: string = req.body.username;
        const password: string = req.body.password;
        res.status(200).send(await this.userService.login(username, password));
    }
    
    @httpPost('/logout')
    async logout(req: Request, res: Response){
        const username: string = req.body.username;
        res.status(200).send(await this.userService.logout(username));
    }
}