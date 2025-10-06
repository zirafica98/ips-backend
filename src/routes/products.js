import express from 'express';
import { db } from '../services/firebase.js';

const router = express.Router();

// GET /api/products → vrati sve proizvode
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('products').get();

    // Mapiramo dokumente u JS objekte
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(products);
  } catch (error) {
    console.error('❌ Greška pri čitanju proizvoda:', error);
    res.status(500).json({ message: 'Greška pri učitavanju proizvoda.' });
  }
});

export default router;
