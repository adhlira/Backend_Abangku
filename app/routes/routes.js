import { Router } from "express";
import express from "express";
import userRouter from "./user_routes.js";
import authRouter from "./auth_routes.js";
import categoryRouter from "./category_routes.js";
import productRouter from "./product_routes.js";
import cartRouter from "./cart_routes.js";

const router = Router();

router.use('/static', express.static('public/images'));
router.use(userRouter);
router.use(authRouter);
router.use(categoryRouter);
router.use(productRouter);
router.use(cartRouter);

export default router;
