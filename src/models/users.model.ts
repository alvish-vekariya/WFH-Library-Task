import mongoose from "mongoose";
import { usersInterface } from "../interfaces/model.interfaces";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema<usersInterface>(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function (next) {
  const new_pwd = await bcrypt.hash(this.password, 10);

  this.password = new_pwd;
  next();
});

export const userModel = mongoose.model<usersInterface>("users", userSchema);
