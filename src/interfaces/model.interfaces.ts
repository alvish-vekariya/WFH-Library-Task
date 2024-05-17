import mongoose from "mongoose";
export interface authorsInterface {
  _id?: mongoose.Schema.Types.ObjectId;
  authorName: string;
  biography: string;
  nationality: string;
  addBy: string;
  updatedBy: string;
}

export interface booksInterface {
  _id?: mongoose.Schema.Types.ObjectId;
  title: string | undefined;
  author: mongoose.Schema.Types.ObjectId;
  category: mongoose.Schema.Types.ObjectId;
  isbn: number | undefined;
  description: string;
  price: number;
  addBy?: mongoose.Schema.Types.ObjectId;
  updatedBy?: mongoose.Schema.Types.ObjectId;
}

export interface categoryInterface {
  _id?: mongoose.Schema.Types.ObjectId;
  category: string | undefined;
  addBy: string;
  updatedBy: string;
}

export interface usersInterface {
  _id?: mongoose.Schema.Types.ObjectId;
  username: string;
  password: string;
  token: string;
}
