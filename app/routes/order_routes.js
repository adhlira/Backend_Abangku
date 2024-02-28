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
  const { origin, destination, courier, discount } = req.body;
  try {
    const user_id = req.user.id;

    const cartItems = await prisma.cart.findMany({
      where: { user_id: user_id },
    });

    // Check if cart is empty
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Double check to make sure product stock is sufficient
    for (const item of cartItems) {
      const product = await prisma.product.findFirst({
        where: { id: item.product_id },
      });
      if (product.quantity < item.quantity) {
        return res.status(400).json({
          message: "One of the items is out of stock",
          product: product,
          required: item.quantity,
          available: product.quantity,
        });
      }
    }

    // Calculate total price and weight
    let totalPrice = 0;
    let totalWeight = 0;
    cartItems.forEach((item) => {
      totalPrice += item.total_price;
      totalWeight += item.total_weight;
    });

    console.log(totalPrice, totalWeight);

    // apply discount to total price if discount is provided
    if (discount) {
      totalPrice = totalPrice * 0.7;
    }

    const newOrder = await createOrder({
      user_id: user_id,
      status: "CREATED",
      total: totalPrice,
      shipment_fee: 0,
    });

    // Get shipment fee
    const shipmentFee = await axios.post(
      "https://api.rajaongkir.com/starter/cost",
      {
        origin,
        destination,
        weight: totalWeight,
        courier,
      },
      {
        headers: {
          key: process.env.RAJAONGKIR_API_KEY,
        },
      }
    );

    console.log(shipmentFee.status);
    console.log("here");
    let fee = 0;
    if (shipmentFee.status === 200) {
      fee = shipmentFee.data.rajaongkir.results[0].costs[0].cost[0].value;
    }

    for (const item of cartItems) {
      const product = await prisma.product.findFirst({
        where: { id: item.product_id },
      });

      await createOrderItem({
        order_id: newOrder.id,
        product_id: item.product_id,
        size_id: item.size_id,
        quantity: item.quantity,
        price: product.price,
        weight: product.weight,
        total_price: item.total_price,
        total_weight: item.total_weight,
      });

      await prisma.cart.delete({ where: { id: item.id } });
    }

    // Update order shipment fee
    await prisma.order.update({
      where: {
        id: newOrder.id,
      },
      data: {
        shipment_fee: fee,
      },
    });

    //get updated order
    const updatedOrder = await getOrderById(newOrder.id);

    res
      .status(201)
      .json({ message: "Order created successfully", order: updatedOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get(
  "/orders",
  authenticateToken,
  authorize(Permission.READ_ORDERS),
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
