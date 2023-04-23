import ErrorsWrapper from "../../errors/ErrorsWrapper";


const signUp = ErrorsWrapper(async (req, res, next) => {
	// const { newUser, token } = await auth.signup(req.body);

	res.status(201).json({
		status: "success",
		// data: newUser,
		// token,
	});
});

const signIn = ErrorsWrapper(async (req, res, next) => {
	const { email, password } = req.body;



	// const token = await auth.signin({ email, password });

	res.status(200).json({
		status: "success",
		// token,
	});
});

const authControllers = {
	signIn,
	signUp,
};

export default authControllers
