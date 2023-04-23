import express from "express";
import Validator from '../../middlewares/validation.middleware'


const router = express.Router();

router.post(
	"/signup",
	// Validator(userSchemas.userSignUpSchema),
	// userController.signUp
);
router.post(
	"/signin",
	// Validator(userSchemas.userSignInSchema),
	// userController.signIn
);

module.exports = router;
