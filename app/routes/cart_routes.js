// app/routes/cart_routes.js

import { Router } from "express";
import prisma from "../helpers/prisma.js";
import authenticateToken from "../middlewares/authenticate_token.js";
import { validateCartReqBody } from "../validators/validate_req_body.js";
import { Permission } from "../constant/authorization.js";
import authorize from "../middlewares/middleware.js";

const router = Router();

router.post(
  "/cart",
  authenticateToken,
  validateCartReqBody,
  authorize(Permission.ADD_CARTS),
  async (req, res) => {
    const { product_id, quantity, size_id } = req.body;
    const user_id = req.user.id;
    // Check if product exists
    const product = await prisma.product.findFirst({
      where: { id: product_id },
    });

    // Check if product with that size is available
    const size = await prisma.productSize.findFirst({
      where: { product_id, size_id },
    });

    if (!size) {
      res.status(404).json({ message: "Size not found" });
      return;
    }

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    // Check if product stock is available
    if (product.quantity < quantity) {
      res.status(400).json({ message: "Insufficient product stock" });
      return;
    }

    // Find if product with that size is in the cart
    const existInCart = await prisma.cart.findFirst({
      where: {
        product_id,
        user_id,
        size_id,
      },
    });
    // Update quantity and weight if product exist
    if (existInCart) {
      try {
        await prisma.cart.update({
          where: {
            id: existInCart.id,
          },
          data: {
            quantity: existInCart.quantity + quantity,
            total_price: (existInCart.quantity + quantity) * product.price,
            total_weight: (existInCart.quantity + quantity) * product.weight,
          },
        });
        return res.status(200).json({ message: "Cart Updated" });
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    } else {
      try {
        await prisma.cart.create({
          data: {
            product_id,
            user_id,
            quantity,
            size_id,
            total_price: quantity * product.price,
            total_weight: quantity * product.weight,
          },
        });
        return res.status(200).json({ message: "Product added to cart" });
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    }
  }
);

router.get(
  "/cart",
  authenticateToken,
  authorize(Permission.BROWSE_CARTS),
  async (req, res) => {
    const user_id = req.user.id;
    const results = await prisma.cart.findMany({
      include: {
        User: {
          select: {
            username: true,
          },
        },
        Product: {
          select: {
            name: true,
            price: true,
            ProductImage: {
              select: {
                image_url: true,
              },
            },
          },
        },
        Size: {
          select: {
            name: true,
          },
        },
      },
      where: { user_id: user_id },
    });
    if (results.length === 0) {
      return res.status(404).json({ message: "Cart is Empty" });
    }
    res.status(200).json(results);
  }
);

router.put(
  "/cart/:id",
  authenticateToken,
  authorize(Permission.EDIT_CARTS),
  async (req, res) => {
    const { quantity, size_id, product_id } = req.body;
    const user_id = req.user.id;

    const product = await prisma.product.findUnique({
      where: { id: +product_id },
    });
    if (isNaN(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    // find the cart
    const cart_id = await prisma.cart.findFirst({
      where: { id: Number(req.params.id), user_id: user_id },
    });

    if (!cart_id) {
      return res.status(404).json({ message: "Card ID Not Found" });
    }

    // check if current cart size is the same as req.body size
    if (cart_id.size_id === +size_id || !size_id) {
      await prisma.cart.update({
        where: { id: cart_id.id },
        data: {
          quantity,
          total_price: quantity * product.price,
          total_weight: quantity * product.weight,
        },
      });
      return res.status(200).json({ message: "Cart updated" });
    }

    // find other product with same size
    const foundSizeProduct = await prisma.cart.findFirst({
      where: {
        user_id: +user_id,
        product_id: +product_id,
        size_id: +size_id,
      },
    });
    console.log(foundSizeProduct);
    if (foundSizeProduct) {
      // start prisma transaction
      // update found cart
      await prisma.$transaction(async (tx) => {
        await tx.cart.update({
          where: { id: foundSizeProduct.id },
          data: {
            quantity: foundSizeProduct.quantity + +quantity,
            total_price:
              foundSizeProduct.total_price + +quantity * product.price,
            total_weight:
              foundSizeProduct.total_weight + +quantity * product.weight,
          },
        });
        //delete old cart
        await tx.cart.delete({ where: { id: Number(req.params.id) } });
      });
      return res.status(200).json({ message: "Cart updated" });
    } else {
      const cart_updated = await prisma.cart.update({
        where: { id: Number(req.params.id) },
        data: {
          quantity,
          total_price: +quantity * product.price,
          total_weight: +quantity * product.weight,
          size_id: +size_id,
        },
      });
      res.status(200).json({ message: "Cart updated", cart_updated });
    }
  }
);

router.delete(
  "/cart/:id",
  authenticateToken,
  authorize(Permission.DELETE_CARTS),
  async (req, res) => {
    const user_id = req.user.id;

    if (isNaN(req.params.id)) {
      res.status(400).json({ message: "Invalid ID" });
    } else {
      const cart_id = await prisma.cart.findFirst({
        where: { id: Number(req.params.id), user_id: user_id },
      });
      if (!cart_id) {
        res.status(404).json({ message: "Cart ID Not Found" });
      } else {
        await prisma.cart.delete({ where: { id: Number(req.params.id) } });
        res.status(200).json({ message: "Cart deleted" });
      }
    }
  }
);

export default router;
