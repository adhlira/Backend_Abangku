import { Router } from "express";
import prisma from "../helpers/prisma.js";
import authenticateToken from "../middlewares/authenticate_token.js";
import { validateCartReqBody } from "../validators/validate_req_body.js";

const router = Router();

router.post(
  "/cart",
  authenticateToken,
  validateCartReqBody,
  async (req, res) => {
    const { product_id, quantity } = req.body;
    const product = await prisma.product.findFirst(product_id);
    console.log(req.user)
    const user_id = req.user.id

    if (!product) {
      res.status(404).json({ message: "Product not found" });
    }

    // Check if product stock is available
    if (product.quantity < quantity) {
      res.status(400).json({ message: "Insufficient product stock" });
    }

    // Find if product exist in the cart
    const existInCart = await prisma.cart.findFirst({
      where: {
        product_id,
        user_id,
      },
    });
    // Update quantity if product exist
    if (existInCart) {
      try {
        await prisma.cart.update({
          where: {
            id: existInCart.id,
          },
          data: {
            quantity: existInCart.quantity + quantity,
            total_price: (existInCart.quantity + quantity) * product.price,
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
            total_price: quantity * product.price,
          },
        });
        return res.status(200).json({ message: "Product added to cart" });
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    }
  }
);

export default router;
