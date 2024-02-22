// app/orderItemModel.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createOrderItem = async (data) => {
  try {
    const newOrderItem = await prisma.orderItem.create({
      data: {
        order_id: data.order_id,
        product_id: data.product_id,
        quantity: data.quantity,
        price: data.price,
        total_price: data.total_price,
        shipment_fee: data.shipment_fee,
      },
    });
    return newOrderItem;
  } catch (error) {
    throw new Error('Error creating order item');
  }
};