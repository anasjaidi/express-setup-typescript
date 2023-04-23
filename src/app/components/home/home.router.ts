import { Router } from "express";
import homeControllers from "./home.controller";

const router = Router()

router.use('/', homeControllers.homeController)

export default router