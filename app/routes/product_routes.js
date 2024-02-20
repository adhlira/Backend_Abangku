import { Router } from "express";
import prisma from "../helpers/prisma.js";
import fs from "fs";
import upload from "../middlewares/image_middleware.js";
import validateProductReqBody from "../validators/validate_product_req_body.js";

const router = Router();
// router.use(express.urlencoded({ extended: true }));

router.get("/product", async (req, res) => {
  const results = await prisma.product.findMany();
  res.json(results);
});

router.post("/product", upload.single("image"), validateProductReqBody, async (req, res) => {
  const { name, description, price, category_id, quantity, rating } = req.body;
  const rootUrl = `${req.protocol}://${req.get("host")}`;
  //   console.log(req.body);
  try {
    const product = await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          name,
          description,
          price: +price,
          category_id: +category_id,
          quantity: +quantity,
          rating: +rating,
        },
      });

      if (req.file) {
        await tx.productImage.create({
          data: {
            product_id: product.id,
            image_url: `${rootUrl}/static/${req.file.originalname}`,
          },
        });
      }
      return product;
    });
    res.json({ product: product, data: "ok" });
  } catch (error) {
    fs.unlinkSync(req.file.path);
  }
});

router.put("/product/:id", async (req, res) => {
  if (isNaN(req.params.id)) {
    res.status(400).json({ message: "Invalid ID" });
  } else {
    const product_id = await prisma.product.findFirst({ where: { id: Number(req.params.id) } });
    if (!product_id) {
      res.status(404).json({ message: "Product Not Found" });
    } else {
      const updated_product = await prisma.product.update({ where: { id: Number(req.params.id) }, data: req.body });
      res.status(200).json({ message: "Product has been updated", updated_product });
    }
  }
});

router.delete("/product/:id", async (req, res) => {
  if (isNaN(req.params.id)) {
    res.status(400).json({ message: "Invalid ID" });
  } else {
    const product_id = await prisma.product.findFirst({ where: { id: Number(req.params.id) } });
    if (!product_id) {
      res.status(404).json({ message: "Product Not Found" });
    } else {
      const product_id = await prisma.productImage.findFirst({ where: { product_id: Number(req.params.id) } });
      await prisma.productImage.delete({ where: { id: product_id.id } });
      await prisma.product.delete({ where: { id: Number(req.params.id) } });
      res.status(200).json({ message: "Product has been deleted" });
    }
  }
});

export default router;
