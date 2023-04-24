import express from "express";
import Validator from "../../../../middlewares/validation.middleware";
import authValidationSchemas from "./auth.validation";
import authControllers from "./auth.controller";

const router = express.Router();

router.post(
	"/signup",
	Validator(authValidationSchemas.userSignUpSchema),
	authControllers.signUp
);
router.post(
	"/signin",
	Validator(authValidationSchemas.userSignInSchema),
	authControllers.signIn
);

export default router;
