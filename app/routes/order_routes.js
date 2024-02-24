import express from "express";
import prisma from "../helpers/prisma.js";
import { createOrder, getOrderById } from "../orderModel.js";
import { createOrderItem } from "../orderItemModel.js";
import { authorize } from "../constant/authorization.js";
import authenticateToken from "../middlewares/authenticate_token.js";
import { Permission } from "../constant/authorization.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/checkout", authenticateToken, async (req, res) => {
  const { origin, destination, courier } = req.body;
  try {
    const user_id = req.user.id;

    const cartItems = await prisma.cart.findMany({
      where: { user_id: user_id },
    });

    // Check if cart is empty
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let total = 0;
    cartItems.forEach((item) => {
      total += item.total_price;
    });

    const newOrder = await createOrder({
      user_id: user_id,
      status: "CREATED",
      total: total,
    });

    // Get shipment fee
    const shipmentFee = await axios.post(
      "https://api.rajaongkir.com/starter/cost",
      {
        origin,
        destination,
        weight: 1000,
        courier,
      },
      {
        headers: {
          key: process.env.RAJAONGKIR_API_KEY,
        },
      }
    );

    console.log(shipmentFee.status);
    let fee
    if (shipmentFee.status === 200) {
      console.log(
        shipmentFee.data.rajaongkir.results[0].costs[0].cost[0].value
      );
      fee = shipmentFee.data.rajaongkir.results[0].costs[0].cost[0].value;
    }

    for (const item of cartItems) {
      const price = item.product && item.product.price ? item.product.price : 0;

      await createOrderItem({
        order_id: newOrder.id,
        product_id: item.product_id,
        size_id: item.size_id,
        quantity: item.quantity,
        price: price,
        total_price: item.total_price,
        shipment_fee: fee,
      });

      await prisma.cart.delete({ where: { id: item.id } });
    }

    res
      .status(201)
      .json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get(
  "/orders",
  authenticateToken,
  authorize(Permission.BROWSE_ORDERS),
  async (req, res) => {
    try {
      const results = await prisma.order.findMany({
        include: {
          User: {
            select: {
              email: true,
              fullname: true,
            },
          },
        },
        where: {
          user_id: req.user.id,
        },
      });
      if (results.length === 0) {
        return res.status(404).json({ message: "You don't have any order" });
      }
      res.status(200).json(results);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.get(
  "/orders/:id",
  authenticateToken,
  authorize(Permission.READ_ORDERS),
  async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const order = await getOrderById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
