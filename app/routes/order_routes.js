// app/routes/order_routes.js
import express from 'express';
import { createOrder, getOrderById } from '../orderModel.js';
import { createOrderItem } from '../orderItemModel.js';
import { authorize } from '../middlewares/authorization.js';

const router = express.Router();

// Endpoint untuk membuat order baru
// router.post('/orders', authorize('ADD_ORDERS'), async (req, res) => {
router.post('/orders', async (req, res) => {

  try {
    const orderData = req.body;
    const newOrder = await createOrder(orderData);

    // Jika berhasil membuat order, tambahkan order items
    const orderItems = orderData.items;
    if (orderItems && orderItems.length > 0) {
      for (const item of orderItems) {
        await createOrderItem({
          order_id: newOrder.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          total_price: item.total_price,
          shipment_fee: item.shipment_fee,
        });
      }
    }

    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint untuk mendapatkan order berdasarkan ID
// router.get('/orders/:id', authorize('READ_ORDERS'), async (req, res) => {
router.get('/orders/:id', authorize('READ_ORDERS'), async (req, res) => {
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
