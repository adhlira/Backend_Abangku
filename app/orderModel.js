import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createOrder = async (data) => {
  try {
    const newOrder = await prisma.order.create({
      data: {
        user_id: data.user_id,
        invoice: data.invoice,
        status: data.status,
        total: data.total,
      },
    });
    return newOrder;
  } catch (error) {
    throw new Error('Error creating order');
  }
};

export const getOrderById = async (orderId) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });
    return order;
  } catch (error) {
    throw new Error('Error fetching order');
  }
};