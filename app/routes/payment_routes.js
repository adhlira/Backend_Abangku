import { Router } from "express";
import authenticateToken from "../middlewares/authenticate_token.js";
import dotenv from "dotenv";
import prisma from "../helpers/prisma.js";
import axios from "axios";

dotenv.config();
const router = Router();

router.post("/webhooks/payment", async (req, res) => {
  console.log(req.body);
  res.status(200).json({ status: "success", data: req.body });
});

router.post("/pay", authenticateToken, async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({ message: "Invalid Order ID" });
  }

  // check if order exists

  const order = await prisma.order.findUnique({
    include: {
      User: true,
    },
    where: { id: orderId, user_id: req.user.id },
  });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  // attempting to hit midtrans endpoint
  try {
    const pay = await axios.post(
      "https://app.sandbox.midtrans.com/snap/v1/transactions",
      {
        transaction_details: {
          order_id: order.invoice,
          gross_amount: order.total + order.shipment_fee,
        },
        customer_details: {
          email: order.User.email,
          phone: order.User.phone,
        },
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Basic ${process.env.MIDTRANS_API_KEY}`,
        },
      }
    );
    return pay;
  } catch (error) {
    res.status(500).json({ error: "midtrans endpoint error" });
  }
  if (pay.status !== 201) {
    return res.status(500).json({ error: "midtrans endpoint error" });
  }

  res.status(201).json({ status: "success", data: pay.data });
});

export default router;
