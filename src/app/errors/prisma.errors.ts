import { EnvModesErrorDispatcher } from "../types/errors";

const uniqueValueError : EnvModesErrorDispatcher = (err, res) => {
	const message = err.meta.target.join(", ") + " needs to be unique.";
	res.status(409).json({
		status: "fail",
		message,
	});
};



const prismaErrorsHandlers = { uniqueValueError };

export default prismaErrorsHandlers
