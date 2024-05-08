import { injectable } from "inversify";
import { authorServiceInterface } from "../interfaces/services.interfaces";
import authorModel from "../models/author.model";
import { authorsInterface } from "../interfaces/model.interfaces";

@injectable()
export class authorService implements authorServiceInterface{
    async getAllAuthors(page: any): Promise<object> {
        try{
            const allAuthors = await authorModel.find({}) as authorsInterface[];
            const length: number = Math.ceil(allAuthors.length/5) as number;
            // return {allAuthors};
            if(page == undefined || page ==1){
                const allAuthor = await authorModel.find({}).limit(5) as authorsInterface[];
                return {allAuthor, "page" : `${1}/${length}`, "tip": 'pass page in params to go that page!!' }
            }else{
                const limitsize=5
                const skippage=(page-1)*limitsize
                const allAuthor =  await authorModel.find({}).skip(skippage).limit(5) as authorsInterface[];
                return {allAuthor, "page":`${page}/${length}`, "tip": 'pass page in params to go that page!!'};
            }
        }catch(err: any){
            return {500 : err.message}
        }
    }

    async addAuthor(name: string, biography: string, nationality: string, add_by: string): Promise<object> {
        try{
            await authorModel.create({
                authorName : name,
                biography : biography,
                nationality : nationality,
                add_by : add_by
            })
            return {200 : "author is added!"}
        }catch(err : any){
            return {500 : err.message}
        }
    }

    async updateAuthor(authorID: string, updatedName: string, updatedBiography: string, updatedNationality: string, updated_by: string): Promise<object> {
        try{
            await authorModel.findOneAndUpdate({_id: authorID},{$set :{
                authorName : updatedName,
                biography : updatedBiography,
                nationality : updatedNationality,
                updated_by : updated_by
            }})
            return {200 : "author is updated!!"}
        }catch(err : any){
            return {500: err.message}
        }
    }

    async deleteAuthor(authorID: string): Promise<object> {
        try{
            await authorModel.findOneAndDelete({_id:authorID});
            return {200 : "author is deleted!!"}
        }catch(err: any){
            return {500 : err.message}
        }
    }

    async getAuthor(authorID: string): Promise<object> {
        try{
            const foundAuthor = await authorModel.findOne({_id:authorID}) as authorsInterface;
            if(foundAuthor){
                return {foundAuthor}
            }else{
                return {404 : 'author is not found!!'}
            }
        }catch(err: any){
            return {500 : err.message}
        }
    }
}