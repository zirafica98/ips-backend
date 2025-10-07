import express from 'express';
import { db } from '../services/firebase.js';

const router = express.Router();

// 🔹 Kreiraj novu porudžbinu
router.post('/', async (req, res) => {
  try {
    const order = req.body;
    order.status = 'pending';
    order.createdAt = new Date().toISOString();

    const docRef = await db.collection('orders').add(order);
    console.log('✅ Order saved:', docRef.id);
    res.json({ id: docRef.id });
  } catch (err) {
    console.error('❌ Error saving order:', err);
    res.status(500).json({ error: 'Error saving order' });
  }
});

// 🔹 Ažuriraj status porudžbine
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    await db.collection('orders').doc(orderId).update({ status });
    console.log(`✅ Order ${orderId} updated -> ${status}`);
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Error updating order:', err);
    res.status(500).json({ error: 'Error updating order' });
  }
});

// 🔹 Dohvati sve porudžbine (za admina)
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('orders').orderBy('createdAt', 'desc').get();
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(orders);
  } catch (err) {
    console.error('❌ Error fetching orders:', err);
    res.status(500).json({ error: 'Error fetching orders' });
  }
});

export default router;
