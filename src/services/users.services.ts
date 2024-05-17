import { injectable } from "inversify";
import { usersServiceInterface } from "../interfaces/services.interfaces";
import userModel from "../models/users.model";
import { usersInterface } from "../interfaces/model.interfaces";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({ path: "../config/.env" });
import bcrypt from "bcrypt";
import { MSGS } from "../constants/messages";
import { customError } from "../handlers/custom.error";
import { ERRORS } from "../constants/errors";
import { EVENT_MSG } from "../constants/event.messages";

@injectable()
export class userServices implements usersServiceInterface {
  async register(username: string, password: string): Promise<object> {
    const checkDuplicate: usersInterface = (await userModel.findOne({
      username: username,
    })) as usersInterface;
    if (checkDuplicate) {
      throw new customError(MSGS.user_already, ERRORS.DUPLICATION_ERROR);
    } else {
      if (
        await userModel.create({
          username: username,
          password: password,
        })
      ) {
        return EVENT_MSG.USER_REGISTERED;
      } else {
        throw new customError(MSGS.user_problem, ERRORS.USER_PROBLEM);
      }
    }
  }

  async login(username: string, password: string): Promise<object> {
    const foundUser: usersInterface = (await userModel.findOne({
      username: username,
    })) as usersInterface;

    if (foundUser) {
      const validUser = await bcrypt.compare(password, foundUser.password);
      if (validUser) {
        const data = {
          userID: foundUser._id,
          username: foundUser.username,
        };
        const token = await jwt.sign(data, process.env.SECRETE_KEY as string, {
          expiresIn: "1d",
        });

        if (
          await userModel.updateOne(
            { _id: foundUser._id },
            { $set: { token: token } },
          )
        ) {
          const res = { ...EVENT_MSG.USER_LOGGEDIN, token: token };
          return res;
        } else {
          throw new customError(MSGS.user_login_error, ERRORS.USER_LOGIN_ERROR);
        }
      } else {
        throw new customError(MSGS.user_invalid_cred, ERRORS.INVALID_CRED);
      }
    } else {
      throw new customError(MSGS.user_invalid, ERRORS.USER_INVALID);
    }
  }

  async logout(username: string): Promise<object> {
    const foundUser = (await userModel.findOne({
      username: username,
    })) as usersInterface;

    if (
      await userModel.findOneAndUpdate(
        { _id: foundUser._id },
        { $unset: { token: { $exists: true } } },
      )
    ) {
      return EVENT_MSG.USER_LOGOUT;
    } else {
      return EVENT_MSG.USER_LOGOUT_ALREADY;
    }
  }
}
