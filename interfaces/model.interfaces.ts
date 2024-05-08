import mongoose from "mongoose";
export interface authorsInterface  {
    _id ?: mongoose.Schema.Types.ObjectId,
    authorName : string,
    biography : string,
    nationality : string,
    add_by : string,
    updated_by : string
}

export interface booksInterface {
    _id ?: mongoose.Schema.Types.ObjectId,
    title : string | undefined,
    author : mongoose.Schema.Types.ObjectId,
    category : mongoose.Schema.Types.ObjectId,
    isbn : number | undefined,
    description : string,
    price : number,
    add_by ?: mongoose.Schema.Types.ObjectId,
    updated_by ?: mongoose.Schema.Types.ObjectId 
}

export interface categoryInterface {
    _id ?: mongoose.Schema.Types.ObjectId,
    category : string | undefined,
    add_by : string,
    updated_by : string
}

export interface usersInterface {
    _id ?: mongoose.Schema.Types.ObjectId,
    username : string,
    password : string,
    token : string
}