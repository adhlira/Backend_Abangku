import { Router } from "express";
import express from "express";
import prisma from "../helpers/prisma.js";
import multer from "multer";
import upload from "../middlewares/image_middleware.js";
import validateProductReqBody from "../validators/validate_product_req_body.js";

const router = Router();
router.use(express.urlencoded({ extended: true }));

router.get("/product", async (req, res) => {
  const results = await prisma.product.findMany();
  res.json(results);
});

router.post("/product", upload.single("image"), async (req, res) => {
  res.json({ data: "ok" });
});

export default router;
