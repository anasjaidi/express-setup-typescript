import express from "express";
import Validator from '../../middlewares/validation.middleware'
import authValidationSchemas from "./auth.validation";


const router = express.Router();

router.post(
	"/signup",
	Validator(authValidationSchemas.userSignUpSchema),
	// userController.signUp
);
router.post(
	"/signin",
	Validator(authValidationSchemas.userSignInSchema),
	// userController.signIn
);

export default router
