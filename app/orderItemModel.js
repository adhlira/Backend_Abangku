// app/orderItemModel.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createOrderItem = async (data) => {
  try {
    const newOrderItem = await prisma.orderItem.create({
      data: {
        order_id: data.order_id,
        product_id: data.product_id,
        size_id: data.size_id,
        quantity: data.quantity,
        price: data.price,
        total_price: data.total_price,
        weight: data.weight,
        total_weight: data.total_weight,
      },
    });
    return newOrderItem;
  } catch (error) {
    throw new Error("Error creating order item");
  }
};
