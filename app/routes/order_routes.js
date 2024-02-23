import express from 'express';
import prisma from '../helpers/prisma.js';
import { createOrder, getOrderById } from '../orderModel.js';
import { createOrderItem } from '../orderItemModel.js';
import { authorize } from '../constant/authorization.js';
import authenticateToken from '../middlewares/authenticate_token.js';

const router = express.Router();

router.post('/orders/from-cart', authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.id;

    const cartItems = await prisma.cart.findMany({ where: { user_id: user_id } });

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    let total = 0;
    cartItems.forEach(item => {
      if (item.product && item.product.price) {
        total += item.product.price;
      }
    });

    const newOrder = await createOrder({
      user_id: user_id,
      status: 'WAITING_FOR_PAYMENT',
      total: total
    });

    for (const item of cartItems) {
      const price = item.product && item.product.price ? item.product.price : 0;

      await createOrderItem({
        order_id: newOrder.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: price,
        total_price: item.total_price,
        shipment_fee: 0,
      });

      await prisma.cart.delete({ where: { id: item.id } });
    }

    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/orders/:id', authenticateToken, async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const order = await getOrderById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
