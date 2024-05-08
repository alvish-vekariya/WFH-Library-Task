import { injectable } from "inversify";
import { usersServiceInterface } from "../interfaces/services.interfaces";
import userModel from "../models/users.model";
import { usersInterface } from "../interfaces/model.interfaces";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mongoose from "mongoose";
dotenv.config({path : '../config/.env'});
import bcrypt from 'bcrypt';

@injectable()
export class userServices implements usersServiceInterface{
    async register(username: string, password: string): Promise<object>{
        try{
            const checkDuplicate: usersInterface = await userModel.findOne({username : username}) as usersInterface;
            if(checkDuplicate){
                return {409 : "Username is already exists!!"}
            }else{
                if(
                    await userModel.create({
                        username : username,
                        password : password
                    })
                ){
                    return { 200 : "user registered Succesfully!!"};
                }else{
                    return {500 : 'some problem while creating user!!'};
                }
            }
        }catch(err: any){
            return {500 : err.message};
        }
    }

    async login(username: string, password: string): Promise<object> {
        try{
            const foundUser: usersInterface = await userModel.findOne({username: username}) as usersInterface;

            if(foundUser){
                const validUser = await bcrypt.compare(password, foundUser.password);
                if(validUser){
                    const data = {
                        userID : foundUser._id,
                        username : foundUser.username
                    }
                    const token = await jwt.sign(data, process.env.SECRETE_KEY as string, {expiresIn : '1d'});
    
                    if(await userModel.updateOne({ _id: foundUser._id }, { $set: { token: token } })){
                        return { 200 : "user login Succesfully!!", 'token' : token};
                    }else{
                        return { 500 : 'error while login!!'}
                    }
                }else{
                    return {409 : "invalid creadentials!!"}
                }
            }else{
                return {401 : 'invalid user!!'} 
            }
        }catch(err: any){
            return {500 : err.message};
        }
        
    }

    async logout(username: string): Promise<object> {
        try{
            const foundUser = await userModel.findOne({username :username}) as usersInterface;

            if(
                await userModel.findOneAndUpdate({_id: foundUser._id},{$unset : {token : {$exists : true}}})
            ){
                return { 200 : "user logout Succesfully!!"};
            }else{
                return { 200 : "user already logout !!" };
            }
        }catch(err: any){
            return {500 : err.message};
        }
    }
}