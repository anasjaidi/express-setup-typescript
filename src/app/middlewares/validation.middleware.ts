import Joi from "joi";
import ErrorsWrapper from "../errors/ErrorsWrapper";
import AppError from "../errors/AppError";



const Validator = (schema: Joi.ObjectSchema) => {
	return ErrorsWrapper(async (req, res, next) => {
		const { error } = schema.validate(req.body);

		if (error) {
			return next(new AppError(400, error.details[0].message));
		}

    next()
	});
};

module.exports = Validator;