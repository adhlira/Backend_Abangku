// app/orderModel.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createOrder = async (data) => {
  try {
    const invoice = generateUniqueInvoiceNumber();

    const newOrder = await prisma.order.create({
      data: {
        user_id: data.user_id,
        invoice: invoice,
        status: data.status,
        total: data.total,
        shipment_fee: data.shipment_fee,
      },
    });
    return newOrder;
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error("Error creating order");
  }
};

const generateUniqueInvoiceNumber = () => {
  return "INV" + new Date().toISOString().replace(/\D/g, "").slice(0, -3); // Contoh sederhana, bisa disesuaikan dengan kebutuhan Anda
};

export const getOrderById = async (orderId) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });
    return order;
  } catch (error) {
    throw new Error("Error fetching order");
  }
};
