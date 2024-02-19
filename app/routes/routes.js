import { Router } from "express";
import userRouter from "./user_routes.js";
import authRouter from "./auth_routes.js";
const router = Router();

router.use(userRouter);
router.use(authRouter);

export default router;
