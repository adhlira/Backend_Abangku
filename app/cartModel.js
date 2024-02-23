import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const createCartItem = async (data) => {
  try {
    const newCartItem = await prisma.cart.create({
      data: {
        user_id: data.user_id,
        product_id: data.product_id,
        quantity: data.quantity,
        total_price: data.total_price,
      },
    });
    return newCartItem;
  } catch (error) {
    throw new Error('Error creating cart item');
  }
};
export const deleteCartItem = async (cartItemId) => {
  try {
    const deletedCartItem = await prisma.cart.delete({
      where: {
        id: cartItemId,
      },
    });
    return deletedCartItem;
  } catch (error) {
    throw new Error('Error deleting cart item');
  }
};
