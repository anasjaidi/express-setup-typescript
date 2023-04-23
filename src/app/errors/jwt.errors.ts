import { EnvModesErrorDispatcher } from '../types/errors';


const invalidToken: EnvModesErrorDispatcher = (err, res) => {
	const message = "invalid token, please re login.";
	res.status(401).json({
		status: "fail",
		message,
	});
};

const expiredToken: EnvModesErrorDispatcher = (err, res) => {
	const message = "token expired, please re login";
	res.status(401).json({
		status: "fail",
		message,
		expiredAt: err.expiredAt,
	});
};

const jwtErrorsHandlers = {expiredToken, invalidToken}

export default jwtErrorsHandlers