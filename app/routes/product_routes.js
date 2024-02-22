import { Router } from "express";
import prisma from "../helpers/prisma.js";
import fs from "fs";
import path from "path";
import upload from "../middlewares/image_middleware.js";
import { validateProductReqBody } from "../validators/validate_req_body.js";
import { Permission } from "../constant/authorization.js";
import authorize from "../middlewares/middleware.js";

const router = Router();

router.get("/product", async (req, res) => {
  const results = await prisma.product.findMany({
    include: {
      Category: {
        select: {
          name: true,
        },
      },
      ProductImage: {
        select: {
          image_url: true,
        },
      },
      ProductSize: {
        select: {
          Size: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
  res.json(results);
});

router.post("/product", upload.single("image"), validateProductReqBody, authorize(Permission.ADD_PRODUCTS), async (req, res) => {
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
        let fileName;
        switch (+category_id) {
          case 1:
            fileName = `product_${product.id}.jpg`;
            break;
          case 2:
            fileName = `product_${product.id}_w.jpg`;
            break;
          case 3:
            fileName = `product_${product.id}_k.jpg`;
            break;
          case 4:
            fileName = `cp${product.id}.jpg`;
            break;
          default:
            fileName;
            break;
        }

        await tx.productImage.create({
          data: {
            product_id: product.id,
            image_url: `${rootUrl}/static/${fileName}`,
          },
        });

        const newPath = path.join("public/images", fileName);
        fs.renameSync(req.file.path, newPath);
      }

      return product;
    });
    res.json({
      product: product,
      data: "ok",
    });
  } catch (error) {
    fs.unlinkSync(req.file.path);
    res.status(500).json(error.message);
  }
});

router.put("/product/:id", upload.single("image"), validateProductReqBody, authorize(Permission.EDIT_PRODUCTS), async (req, res) => {
  const rootUrl = `${req.protocol}://${req.get("host")}`;
  if (isNaN(req.params.id)) {
    res.status(400).json({
      message: "Invalid ID",
    });
  } else {
    const product_id = await prisma.product.findFirst({
      where: {
        id: Number(req.params.id),
      },
    });
    if (!product_id) {
      res.status(404).json({
        message: "Product Not Found",
      });
    } else {
      const { name, price, quantity, description, rating } = req.body;
      const updated_product = await prisma.product.update({
        where: {
          id: Number(req.params.id),
        },
        data: {
          name,
          price: +price,
          quantity: +quantity,
          description,
          rating: +rating,
        },
      });
      if (req.file) {
        await prisma.productImage.update({
          where: {
            id: product_id.id,
          },
          data: {
            image_url: `${rootUrl}/static/${req.file.originalname}`,
          },
        });
      }
      res.status(200).json({
        message: "Product has been updated",
        updated_product,
      });
    }
  }
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
        let fileName;
        switch (+category_id) {
          case 1:
            fileName = `product_${product.id}.jpg`;
            break;
          case 2:
            fileName = `product_${product.id}_w.jpg`;
            break;
          case 3:
            fileName = `product_${product.id}_k.jpg`;
            break;
          case 4:
            fileName = `cp${product.id}.jpg`;
            break;
          default:
            fileName;
            break;
        }

        await tx.productImage.create({
          data: {
            product_id: product.id,
            image_url: `${rootUrl}/static/${fileName}`,
          },
        });

        const newPath = path.join("public/images", fileName);
        fs.renameSync(req.file.path, newPath);
      }

      return product;
    });
    res.json({ product: product, data: "ok" });
  } catch (error) {
    fs.unlinkSync(req.file.path);
    res.status(500).json(error.message);
  }
});

router.put("/product/:id", upload.single("image"), validateProductReqBody, async (req, res) => {
  const rootUrl = `${req.protocol}://${req.get("host")}`;
  if (isNaN(req.params.id)) {
    res.status(400).json({ message: "Invalid ID" });
  } else {
    const product_id = await prisma.product.findFirst({
      where: { id: Number(req.params.id) },
    });
    if (!product_id) {
      res.status(404).json({ message: "Product Not Found" });
    } else {
      const { name, price, quantity, description, rating } = req.body;
      const updated_product = await prisma.product.update({
        where: { id: Number(req.params.id) },
        data: {
          name,
          price: +price,
          quantity: +quantity,
          description,
          rating: +rating,
        },
      });
      if (req.file) {
        await prisma.productImage.update({
          where: { id: product_id.id },
          data: { image_url: `${rootUrl}/static/${req.file.originalname}` },
        });
      }
      res.status(200).json({ message: "Product has been updated", updated_product });
    }
  }
});

router.delete("/product/:id", authorize(Permission.DELETE_PRODUCTS), async (req, res) => {
  if (isNaN(req.params.id)) {
    res.status(400).json({
      message: "Invalid ID",
    });
  } else {
    const product_id = await prisma.product.findFirst({
      where: {
        id: Number(req.params.id),
      },
    });
    if (!product_id) {
      res.status(404).json({
        message: "Product Not Found",
      });
    } else {
      const product_id = await prisma.productImage.findFirst({
        where: {
          product_id: Number(req.params.id),
        },
      });
      await prisma.productImage.delete({
        where: {
          id: product_id.id,
        },
      });
      await prisma.product.delete({
        where: {
          id: Number(req.params.id),
        },
      });
      res.status(200).json({
        message: "Product has been deleted",
      });
    }
  }
});

export default router;
