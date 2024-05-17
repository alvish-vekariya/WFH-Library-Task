import { MSGS } from "./messages";
import { STATUS } from "./status";

export const EVENT_MSG = {
  USER_REGISTERED: {
    statusCode: STATUS.SUCCESS,
    message: MSGS.user_registered,
  },
  USER_LOGGEDIN: {
    statusCode: STATUS.SUCCESS,
    message: MSGS.user_loggedin,
  },
  USER_LOGOUT: {
    statusCode: STATUS.SUCCESS,
    message: MSGS.user_logout,
  },
  USER_LOGOUT_ALREADY: {
    statusCode: STATUS.CONFLICT,
    message: MSGS.user_logout_already,
  },
  AUTHOR_ADDED: {
    statusCode: STATUS.SUCCESS,
    message: MSGS.author_added,
  },
  AUTHOR_UPDATED: {
    statusCode: STATUS.SUCCESS,
    message: MSGS.author_updated,
  },
  AUTHOR_DELETED: {
    statusCode: STATUS.SUCCESS,
    message: MSGS.author_deleted,
  },
  AUTHOR_FOUND: {
    statusCode: STATUS.SUCCESS,
    message: MSGS.author_found,
  },
  BOOK_DELETED: {
    statusCode: STATUS.SUCCESS,
    message: MSGS.book_deleted,
  },
  BOOK_UPDATED: {
    statusCode: STATUS.SUCCESS,
    message: MSGS.book_updated,
  },
  BOOK_ADDED: {
    statusCode: STATUS.SUCCESS,
    message: MSGS.book_added,
  },
  CATEGORY_ADDED: {
    statusCode: STATUS.SUCCESS,
    message: MSGS.category_added,
  },
  CATEGORY_UPDATED: {
    statusCode: STATUS.SUCCESS,
    message: MSGS.category_updated,
  },
  CATEGORY_DELETED: {
    statusCode: STATUS.SUCCESS,
    message: MSGS.category_deleted,
  },
};
