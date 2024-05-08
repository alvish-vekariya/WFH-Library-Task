import { injectable, inject } from "inversify";
import { controller, httpGet, httpPost } from "inversify-express-utils";
import { Request, Response } from "express";
import { usersServiceInterface } from "../interfaces/services.interfaces";
import { TYPES } from "../constants/types";
import { userServices } from "../services/users.services";
import { MSGS } from "../constants/messages";
import { STATUS } from "../constants/status";

@controller('/user')
export class userController{
    constructor(@inject(TYPES.userServices) private userService: userServices){}

    @httpPost('/register')
    async register(req: Request, res: Response){
        const username: string = req.body.username;
        const password: string = req.body.password;
        if(!username || !password) return res.status(STATUS.not_found).send({404 : MSGS.param_required});
        try{
            res.status(STATUS.success).send(await this.userService.register(username, password));
        }catch(err: any){
            res.status(STATUS.server).send({500 : err.message})
        }
    }

    @httpPost('/login')
    async login(req: Request, res: Response){
        const username: string = req.body.username;
        const password: string = req.body.password;
        if(!username || !password) return res.status(STATUS.not_found).send({404 : MSGS.param_required});
        try{
            res.status(STATUS.success).send(await this.userService.login(username, password));
        }catch(err : any){
            res.status(STATUS.server).send({ 500 : err.message})
        }
    }
    
    @httpPost('/logout')
    async logout(req: Request, res: Response){
        const username: string = req.body.username;
        if(!username) return res.status(STATUS.not_found).send({404 : MSGS.param_required});
        try{
            res.status(STATUS.success).send(await this.userService.logout(username));
        }catch(err: any){
            res.status(STATUS.server).send({ 500 : err.message});
        }
    }
}