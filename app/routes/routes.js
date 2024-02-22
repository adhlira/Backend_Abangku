import { Router } from "express";
import express from "express";
import userRouter from "./user_routes.js";
import authRouter from "./auth_routes.js";
import categoryRouter from "./category_routes.js";
import productRouter from "./product_routes.js";
import cartRouter from "./cart_routes.js";
import orderRouter from "./order_routes.js";
import ongkirRouter from "./destination_routes.js";
import paymentRouter from "./payment_routes.js";

const router = Router();

router.use("/static", express.static("public/images"));
router.use(userRouter);
router.use(authRouter);
router.use(categoryRouter);
router.use(productRouter);
router.use(cartRouter);
router.use(orderRouter);
router.use(ongkirRouter);
router.use(paymentRouter);

export default router;
