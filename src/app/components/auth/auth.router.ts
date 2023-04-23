import express from "express";
import Validator from '../../middlewares/validation.middleware'
import authValidationSchemas from "./auth.validation";


const router = express.Router();

router.post(
	"/signup",
	Validator(authValidationSchemas.userSignUpSchema),
  (req, res, next) => {
    res.status(200).send('test')
  }
	// userController.signUp
);
router.post(
	"/signin",
	Validator(authValidationSchemas.userSignInSchema),
	(req, res, next) => {
		res.status(200).send("test");
	}
	// userController.signIn
);

export default router
