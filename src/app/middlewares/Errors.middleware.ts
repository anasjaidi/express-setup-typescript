// const prismaErrors = require("./prisma/prismaErrors");

import { ErrorRequestHandler } from "express";
import AppError from "../errors/AppError";
import { Response } from "express";



type EnvErrorsDispatcher = (
	err: AppError,
	res: Response<any, Record<string, any>>
) => void;

const proErrors : EnvErrorsDispatcher= (err, res) => {
	if (err.isOperational) {
		// opeartional, trusted: send error to the client

		res.status(err.statusCode).json({
			status: "fail",
			message: err.message,
		});

		// programming or other errors: Don't leak error details
	} else {
		// log the error
		console.log(err);

		// 2) send geniric error
		res.status(500).json({
			status: "error",
			message: "internal server error.",
		});
	}
};

const testErrors : EnvErrorsDispatcher = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		message: err.message,
		stack: err.stack,
		err,
	});
};

const devErrors : EnvErrorsDispatcher = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		message: err.message,
		stack: err.stack,
		err,
	});
};

const ErrorsGateway: ErrorRequestHandler = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;

	err.status = err.status || "error";

	if (req.app.get("env") === "development") {
		devErrors(err, res);
	} else if (req.app.get("env") === "testing") {
		//
	} else {
		// if (err.code === "P2002") {
		// 	return prismaErrors.uniqueValueError(err, res);
		// } else if (err.name === "JsonWebTokenError") {
		// 	return prismaErrors.invalidToken(err, res);
		// } else if (err.name === "TokenExpiredError") {
		// 	return prismaErrors.expiredToken(err, res);
		// }
		proErrors(err, res);
	}
};

export default ErrorsGateway