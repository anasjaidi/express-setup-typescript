import { Router } from "express";
import homeControllers from "./home.controller";
import ErrorsWrapper from '../../errors/ErrorsWrapper';
import protectRoute from "../../middlewares/auth.middleware";

const router = Router()

router.route("/").get(ErrorsWrapper(protectRoute), homeControllers.homeController);

export default router