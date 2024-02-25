import { Router } from "express";
import authenticateToken from "../middlewares/authenticate_token.js";
import dotenv from "dotenv";
import prisma from "../helpers/prisma.js";
import axios from "axios";

dotenv.config();
const router = Router();

router.post("/webhooks/payment", async (req, res) => {
  console.log(req.body);
  const { order_id, transaction_id, transaction_status } = req.body;

  // find order with order_id
  const order = await prisma.order.findUniqueOrThrow({
    where: {
      invoice: order_id,
    },
  });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (transaction_status === "settlement") {
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: {
          id: order.id,
        },
        data: {
          transaction_id,
          status: "PAID",
        },
      });
    });
  } else if (transaction_status === "pending") {
    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        transaction_id,
        status: "PENDING",
      },
    });
  }
  res.status(200).json({ status: "success", data: req.body });
});

router.get("/payments", authenticateToken, async (req, res) => {
  try {
    const pay = await axios.post(
      "https://app.sandbox.midtrans.com/snap/v1/transactions",
      {
        transaction_details: {
          order_id: "your order test 9999",
          gross_amount: 5000,
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
    return res
      .status(200)
      .json({ message: "Payment Successful", data: pay.data });
  } catch (error) {
    res.status(500).json({ error: error.message, message: "midtrans errors" });
  }
});

router.post("/pay", authenticateToken, async (req, res) => {
  const { order_id } = req.body;

  if (!order_id) {
    return res.status(400).json({ message: "Invalid Order ID" });
  }

  // check if order exists

  const order = await prisma.order.findUnique({
    include: {
      User: true,
    },
    where: { id: order_id, user_id: req.user.id },
  });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  // attempting to hit midtrans endpoint
  try {
    console.log("hitting");
    console.log(process.env.MIDTRANS_API_KEY);
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
        expiry: {
          unit: "minutes",
          duration: 15,
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
    console.log("success");
    if (pay.status !== 201) {
      return res.status(500).json({ message: "Payment failed" });
    }

    // Insert redirect URL to order
    const updateOrder = await prisma.order.update({
      where: { id: order_id },
      data: { payment_url: pay.data.redirect_url },
    });

    if (!updateOrder) {
      throw new Error("Failed to update order");
    }
    res.status(201).json({ status: "success", data: pay.data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
