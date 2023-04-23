const httpErrors = require("http-errors");

class AppError extends httpErrors {
	constructor(statusCode : number , message: string) {
		super(statusCode, message);

		this.isOperational = true;
	}
}

module.exports = AppError;
