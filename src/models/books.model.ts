import mongoose from "mongoose";
import { booksInterface } from "../interfaces/model.interfaces";

const bookSchema = new mongoose.Schema<booksInterface>({
    title : {
        type : String,
        required : [true, 'title is required!'],
        unique : [true, 'title must be unique!!']
    },
    author : {
        type : mongoose.Schema.Types.ObjectId,
        required : [true, 'Author name is required!!'],
        ref : 'authors'
    },
    category : {
        type : mongoose.Schema.Types.ObjectId,
        required: [true, 'category is required!'],
        ref : 'categories'
    },
    isbn : {
        type : Number,
        required : [true, 'ISBN number is required!!'],
        unique : [true, 'ISBN number must be unique!!!']
    },
    description : {
        type : String
    },
    price : {
        type : Number,
        required : [true, 'price is required!']
    },
    addBy : {
        type : mongoose.Schema.Types.ObjectId
    },
    updatedBy : {
        type : mongoose.Schema.Types.ObjectId
    }
},{
    timestamps : true
})

const bookModel = mongoose.model<booksInterface>('books', bookSchema);

export default bookModel;