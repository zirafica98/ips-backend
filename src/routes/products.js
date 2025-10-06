import express from 'express';
import { db } from '../services/firebase.js';
const router = express.Router();

// GET all products
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('products').get();
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new product
router.post('/', async (req, res) => {
  try {
    const { name, price } = req.body;
    const docRef = await db.collection('products').add({ name, price });
    res.json({ id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
