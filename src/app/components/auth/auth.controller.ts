import ErrorsWrapper from "../../errors/ErrorsWrapper";
import authServices from "./auth.services";


const signUp = ErrorsWrapper(async (req, res, next) => {
	const { newUser, token } = await authServices.signup(req.body);

	res.status(201).json({
		status: "success",
		data: newUser,
		token,
	});
});

const signIn = ErrorsWrapper(async (req, res, next) => {
	const { email, password } = req.body;



	const token = await authServices.signin({ email, password });

	res.status(200).json({
		status: "success",
		token,
	});
});

const authControllers = {
	signIn,
	signUp,
};

export default authControllers
