import Joi from "joi";
import { RESPONSE_STATUS } from "../common/enums";
import { Response } from 'express';

const handleError = (res: Response, error: any) => {
    let statusCode = 500,
        message = `an error occurred: ${error.message}`;

    if (error instanceof Joi.ValidationError) {
        statusCode = 400;
        message = error.details[0].message;
    }

    return res.status(statusCode).send({
        status: RESPONSE_STATUS.FAILED,
        message,
    });
}

export default handleError;