import { Router } from "express";
import prisma from "../helpers/prisma.js";
import fs from "fs";
import upload from "../middlewares/image_middleware.js";
import validateProductReqBody from "../validators/validate_product_req_body.js";

const router = Router();
// router.use(express.urlencoded({ extended: true }));

router.get("/product", async (req, res) => {
  // const results = await prisma.product.findMany();
  res.json(rootUrl);
});

router.post(
  "/product",
  upload.single("image"),
  validateProductReqBody,
  async (req, res) => {
    const { name, description, price, category_id, quantity, rating } =
      req.body;
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
              image_url: `${rootUrl}/static/${req.file.filename}`,
            },
          });
        }
        return product;
      });
      res.json({ product: product, data: "ok" });
    } catch (error) {
      fs.unlinkSync(req.file.path);
    }
  }
);

export default router;
