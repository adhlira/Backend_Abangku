import { Router } from "express";
import prisma from "../helpers/prisma.js";
import fs from "fs";
import path from "path";
import uploadMiddleware from "../middlewares/image_middleware.js";
import { validateProductReqBody } from "../validators/validate_req_body.js";
import { Permission } from "../constant/authorization.js";
import authorize from "../middlewares/middleware.js";
import authenticateToken from "../middlewares/authenticate_token.js";

const router = Router();

router.get("/product", async (req, res) => {
  const { name } = req.query;
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
              id: true,
              name: true,
            },
          },
        },
      },
    },
    where: { name: { contains: name } },
  });
  res.json(results);
});

router.get("/product/:id", async (req, res) => {
  if (isNaN(req.params.id)) {
    res.status(400).json({ message: "Invalid ID" });
  } else {
    const product = await prisma.product.findFirst({
      include: {
        ProductImage: {
          select: {
            image_url: true,
          },
        },
        Category: {
          select: {
            name: true,
          },
        },
        ProductSize: {
          select: {
            Size: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      where: { id: Number(req.params.id) },
    });
    if (!product) {
      res.status(404).json({ message: "Product Not Found" });
    } else {
      res.status(200).json(product);
    }
  }
});

router.post(
  "/product",
  authenticateToken,
  authorize(Permission.ADD_PRODUCTS),
  uploadMiddleware,
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
        if (req.files && req.files.length > 0) {
          await Promise.all(
            req.files.map(async (file, index) => {
              let fileName;
              switch (+category_id) {
                case 1:
                  fileName = `product_${product.id}_${index}.jpg`;
                  break;
                case 2:
                  fileName = `product_${product.id}_w_${index}.jpg`;
                  break;
                case 3:
                  fileName = `product_${product.id}_k_${index}.jpg`;
                  break;
                case 4:
                  fileName = `cp${product.id}_${index}.jpg`;
                  break;
                default:
                  fileName = ""; // handle the default case appropriately
                  break;
              }

              await tx.productImage.createMany({
                data: {
                  product_id: product.id,
                  image_url: `${rootUrl}/static/${fileName}`,
                },
              });

              const newPath = path.join("public/images", fileName);
              fs.renameSync(file.path, newPath);
            })
          );
        }

        return product;
      });
      res.json({
        product: product,
        data: "ok",
      });
    } catch (error) {
      req.files.forEach((file) => {
        fs.unlinkSync(file.path);
      });
      res.status(500).json({ error: error.message });
    }
  }
);

router.put(
  "/product/:id",
  authenticateToken,
  authorize(Permission.EDIT_PRODUCTS),
  uploadMiddleware,
  validateProductReqBody,
  async (req, res) => {
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

        // Fetch old image URLs
        const oldImages = await prisma.productImage.findMany({
          where: {
            product_id: Number(req.params.id),
          },
        });

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

        // Handle old image unlinking and deletion
        if (oldImages.length > 0 && req.files && req.files.length > 0) {
          for (const oldImage of oldImages) {
            const oldImagePath = path.join(
              "public/images",
              oldImage.image_url.split("/").pop()
            );
            if (fs.existsSync(oldImagePath)) {
              fs.unlinkSync(oldImagePath);
            }
          }
          await prisma.productImage.deleteMany({
            where: {
              product_id: Number(req.params.id),
            },
          });
        }

        // Handle new image creation
        if (req.files && req.files.length > 0) {
          await Promise.all(
            req.files.map(async (file, index) => {
              let fileName;
              switch (+category_id) {
                case 1:
                  fileName = `product_${product_id.id}_${index}.jpg`;
                  break;
                case 2:
                  fileName = `product_${product_id.id}_w_${index}.jpg`;
                  break;
                case 3:
                  fileName = `product_${product_id.id}_k_${index}.jpg`;
                  break;
                case 4:
                  fileName = `cp${product_id.id}_${index}.jpg`;
                  break;
                default:
                  fileName = ""; // handle the default case appropriately
                  break;
              }

              await prisma.productImage.createMany({
                data: {
                  product_id: product_id.id,
                  image_url: `${rootUrl}/static/${fileName}`,
                },
              });

              const newPath = path.join("public/images", fileName);
              fs.renameSync(file.path, newPath);
            })
          );
        }

        res.status(200).json({
          message: "Product has been updated",
          updated_product,
        });
      }
    }
  }
);

export default router;
