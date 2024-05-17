import mongoose from "mongoose";
import { authorsInterface } from "../interfaces/model.interfaces";

const authorSchema = new mongoose.Schema<authorsInterface>(
  {
    authorName: {
      type: String,
      required: [true, "Author name is requried!!"],
      unique: true,
    },
    biography: {
      type: String,
      required: [true, "biography is required!!"],
    },
    nationality: {
      type: String,
      required: [true, "Nationality of Author is required!!"],
    },
    addBy: {
      type: String,
      required: true,
    },
    updatedBy: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const authorModel = mongoose.model<authorsInterface>("authors", authorSchema);

export default authorModel;
