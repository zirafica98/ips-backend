import express from 'express';
import { createPayment, checkPaymentStatus } from '../services/ipsPaymentService.js';

const router = express.Router();

// 🔹 Create Payment - frontend poziva ovo
router.post('/create', async (req, res) => {
  try {
    const { orderId, amount } = req.body;
    const data = await createPayment(orderId, parseFloat(amount));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Check Payment Status
router.post('/status', async (req, res) => {
  try {
    const { orderId, amount } = req.body;
    const data = await checkPaymentStatus(orderId, parseFloat(amount));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Callback (poziva banka)
router.post('/callback', (req, res) => {
  console.log('📡 Callback from Bank:', req.body);
  // ovde možeš da ažuriraš status porudžbine u bazi
  res.status(200).send('OK');
});

export default router;
