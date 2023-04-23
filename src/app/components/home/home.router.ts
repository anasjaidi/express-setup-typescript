import { Router } from "express";
import homeControllers from "./home.controller";

const router = Router()

router.route('/').get(homeControllers.homeController)

export default router