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
  uploadMiddleware,
  validateProductReqBody,
  async (req, res) => {
    const {
      name,
      description,
      price,
      category_id,
      quantity,
      rating,
      size,
      weight,
    } = req.body;

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
            weight: +weight,
            ProductSize: {
              create: JSON.parse(size).map((size) => ({
                size_id: +size,
              })),
            },
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
  // authenticateToken,
  // authorize(Permission.EDIT_PRODUCTS),
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
        const {
          name,
          description,
          price,
          category_id,
          quantity,
          rating,
          size,
          weight,
        } = req.body;

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
            category_id: +category_id,
            rating: +rating,
            weight: +weight,
            ProductSize: {
              deleteMany: {
                product_id: Number(req.params.id),
              },
              create: JSON.parse(size).map((size) => ({
                size_id: +size,
              })),
            },
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

router.delete(
  "/product/:id",
  // authenticateToken,
  // authorize(Permission.DELETE_PRODUCTS),
  async (req, res) => {
    if (isNaN(req.params.id)) {
      res.status(400).json({
        message: "Invalid ID",
      });
    }

    const productID = Number(req.params.id);
    try {
      // check if product exists
      const product = await prisma.product.findUniqueOrThrow({
        where: {
          id: productID,
        },
      });
      if (!product) {
        return res.status(404).json({
          message: "Product Not Found",
        });
      }
      // check if there are pending orders that have this product
      const pendingOrders = await prisma.order.findMany({
        where: {
          Order_Items: {
            some: {
              product_id: productID,
            },
          },
          OR: [
            {
              status: "PENDING",
            },
            {
              status: "CREATED",
            },
          ],
        },
      });

      if (pendingOrders.length > 0) {
        return res.status(403).json({
          message: "Product has pending orders",
        });
      }

      const productImg = await prisma.productImage.findMany({
        where: {
          product_id: productID,
        },
      });
      const productCart = await prisma.cart.findMany({
        where: {
          product_id: productID,
        },
      });
      const productSizes = await prisma.productSize.findMany({
        where: {
          product_id: productID,
        },
      });
      const productOrderItems = await prisma.orderItem.findMany({
        where: {
          product_id: productID,
        },
      });

      // deleting product
      // Starting transaction to delete item
      let deleteTransaction = false;
      await prisma.$transaction(async (tx) => {
        // unlink image
        if (productImg) {
          const oldImages = await tx.productImage.findMany({
            where: {
              product_id: productID,
            },
          });

          if (oldImages.length > 0) {
            for (const oldImage of oldImages) {
              const oldImagePath = path.join(
                "public/images",
                oldImage.image_url.split("/").pop()
              );
              if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
              }
            }
            await tx.productImage.deleteMany({
              where: {
                product_id: Number(req.params.id),
              },
            });
          }
        }

        // delete product in user carts
        if (productCart) {
          await tx.cart.deleteMany({
            where: {
              product_id: productID,
            },
          });
        }

        // delete sizes in product
        if (productSizes) {
          await tx.productSize.deleteMany({
            where: {
              product_id: productID,
            },
          });
        }

        // delete in orderitem
        if (productOrderItems) {
          await tx.orderItem.deleteMany({
            where: {
              product_id: productID,
            },
          });
        }

        // actually delete the product
        await tx.product.delete({
          where: {
            id: productID,
          },
        });
        deleteTransaction = true;
      });

      if (deleteTransaction) {
        return res.status(200).json({
          message: "Product has been deleted",
        });
      } else {
        throw new Error("Error deleting product");
      }
    } catch (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
  }
);

export default router;
