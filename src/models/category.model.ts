import { timeStamp } from "console";
import { categoryInterface } from "../interfaces/model.interfaces";
import mongoose from "mongoose";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const categorySchema = new mongoose.Schema<categoryInterface>(
  {
    category: {
      type: String,
      required: [true, "category is required!!"],
      unique: [true, "category must be unique!!"],
    },
    addBy: {
      type: String,
    },
    updatedBy: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const categoryModel = mongoose.model<categoryInterface>(
  "categories",
  categorySchema,
);

export default categoryModel;
