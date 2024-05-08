import { injectable } from "inversify";
import { authorServiceInterface } from "../interfaces/services.interfaces";
import authorModel from "../models/author.model";
import { authorsInterface } from "../interfaces/model.interfaces";
import { MSGS } from "../constants/messages";

@injectable()
export class authorService implements authorServiceInterface {
    async getAllAuthors(page: any, search: any): Promise<object> {
        try {
            if (search) {
                let query : any = {};

                // query.search = new RegExp(search.toString(), 'i')
                query.search = {$regex: search.toString(), $options : 'i' };
                // console.log(query);

                const foundAuthor = await authorModel.find({$or:[{authorName:query.search}]});

                return {foundAuthor}
            } else {
                const allAuthorsCount = await authorModel.countDocuments({}) as number;
                const length: number = Math.ceil(allAuthorsCount / 5) as number;
                // return {allAuthors};
                if (page == undefined || page == 1) {
                    const allAuthor = await authorModel.find({}).limit(5) as authorsInterface[];
                    return { allAuthor, "page": `${1}/${length}`, "tip": MSGS.page_tip }
                } else {
                    const limitsize = 5
                    const skippage = (page - 1) * limitsize
                    const allAuthor = await authorModel.find({}).skip(skippage).limit(5) as authorsInterface[];
                    return { allAuthor, "page": `${page}/${length}`, "tip": MSGS.page_tip };
                }
            }
        } catch (err: any) {
            return { 500: err.message }
        }
    }

    async addAuthor(name: string, biography: string, nationality: string, add_by: string): Promise<object> {
        try {
            await authorModel.create({
                authorName: name,
                biography: biography,
                nationality: nationality,
                add_by: add_by
            })
            return { 200: MSGS.author_added}
        } catch (err: any) {
            return { 500: err.message }
        }
    }

    async updateAuthor(authorID: string, updatedName: string, updatedBiography: string, updatedNationality: string, updated_by: string): Promise<object> {
        try {
            await authorModel.findOneAndUpdate({ _id: authorID }, {
                $set: {
                    authorName: updatedName,
                    biography: updatedBiography,
                    nationality: updatedNationality,
                    updated_by: updated_by
                }
            })
            return { 200: MSGS.author_updated}
        } catch (err: any) {
            return { 500: err.message }
        }
    }

    async deleteAuthor(authorID: string): Promise<object> {
        try {
            await authorModel.findOneAndDelete({ _id: authorID });
            return { 200: MSGS.author_deleted }
        } catch (err: any) {
            return { 500: err.message }
        }
    }

    async getAuthor(authorID: string): Promise<object> {
        try {
            const foundAuthor = await authorModel.findOne({ _id: authorID }) as authorsInterface;
            if (foundAuthor) {
                return { foundAuthor }
            } else {
                return { 404: MSGS.author_notFound }
            }
        } catch (err: any) {
            return { 500: err.message }
        }
    }
}