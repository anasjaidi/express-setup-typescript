import { EnvModesErrorDispatcher } from "../types/errors";

const uniqueValueError : EnvModesErrorDispatcher = (err, res) => {
	const message = err.meta.taget.join(", ") + " needs to be unique.";
	res.status(409).json({
		status: "fail",
		message,
	});
};



const prismaErrors = { uniqueValueError };

export default prismaErrors
