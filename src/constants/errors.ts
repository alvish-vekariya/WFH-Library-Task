import { MSGS } from "./messages";
import { STATUS } from "./status";

export const ERRORS = {
    DUPLICATION_ERROR : {
        statusCode : STATUS.CONFLICT,
        message : MSGS.duplicate
    },
    PARAMETERS_NOT_FOUND : {
        statusCode : STATUS.NOT_FOUND,
        message : MSGS.param_required
    },
    USER_NOT_FOUND : {
        statusCode : STATUS.NOT_FOUND,
        message : MSGS.user_not_found
    },
    USER_PROBLEM : {
        statusCode : STATUS.CONFLICT,
        message : MSGS.user_problem
    },
    USER_LOGIN_ERROR : {
        statusCode : STATUS.SERVER,
        message : MSGS.user_login_error
    },
    INVALID_CRED : {
        statusCode : STATUS.UNAUTHORIZED,
        message : MSGS.user_invalid_cred
    },
    USER_INVALID : {
        statusCode : STATUS.UNAUTHORIZED,
        message : MSGS.user_invalid
    },
    AUTHOR_NOT_FOUND : {
        statusCode : STATUS.NOT_FOUND,
        message : MSGS.author_notFound
    },
    BOOK_NOT_FOUND : {
        statusCode : STATUS.NOT_FOUND,
        message : MSGS.book_notFound
    },
    CATEGORY_NOT_FOUND : {
        statusCode : STATUS.NOT_FOUND,
        message : MSGS.book_notFound
    }
}