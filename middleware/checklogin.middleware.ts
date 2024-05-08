import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError, JwtPayload } from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config({path: '../config/.env'})
import jwt from 'jsonwebtoken';
import userModel from "../models/users.model";
import { usersInterface } from "../interfaces/model.interfaces";
import { BaseMiddleware } from "inversify-express-utils";

export class authMiddleWare extends BaseMiddleware{
    async handler(req: Request,res: Response, next: NextFunction){
        try{
    
            const token = req.header('token') as string;
            if(!token){
                res.send('token is not found!!')
            }else{
                const token_data = jwt.verify(token, process.env.SECRETE_KEY as string) as JwtPayload ;
    
                const checkUser = await userModel.findOne({_id: token_data.userID, token:{$exists : true}}) as usersInterface;
                if(checkUser){
                    next();
                }else{
                    res.send('please Login!!')
                }
            }
    
        }catch(err: any){
            if(err instanceof JsonWebTokenError){
                res.send('Token is not valid!');
            }else{
                res.send(err.message);
            }
        }
    }
}