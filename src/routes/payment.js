import express from 'express';
import { createPayment, checkPaymentStatus,generateToken } from '../services/ipsPaymentService.js';
import { sendPaymentConfirmation, sendPaymentFailure } from '../services/mailService.js';


const router = express.Router();
router.post('/create', async (req, res) => {
  console.log('POST /api/payment/create', req.body);
  try {
    const { orderId, amount } = req.body;
    const data = await createPayment(orderId, parseFloat(amount));
    res.json(data);
  } catch (err) {
    console.error('Greška u /create:', err);
    res.status(500).json({ error: err.message, details: err });
  }
});

// 🔹 Generate Token (test endpoint)
router.post('/token', async (req, res) => {
  console.log('POST /api/payment/token');
  try {
    const token = await generateToken();
    res.json({ token });
  } catch (err) {
    console.error('Greška u /token:', err);
    res.status(500).json({ error: err.message, details: err });
  }
});

// 🔹 Check Payment Status
router.post('/status', async (req, res) => {
  console.log('POST /api/payment/status', req.body);
  try {
    const { orderId, amount } = req.body;
    const data = await checkPaymentStatus(orderId, parseFloat(amount));
    res.json(data);
  } catch (err) {
    console.error('Greška u /status:', err);
    res.status(500).json({ error: err.message, details: err });
  }
});

// 🔹 Callback (poziva banka)
router.post('/callback', (req, res) => {
  console.log('POST /api/payment/callback', req.body);
  res.status(200).send('OK');
});

// ✅ potvrda uspešnog plaćanja
router.post('/confirm', async (req, res) => {
  console.log('POST /api/payment/confirm', req.body);
  try {
    const { orderId, amount, email } = req.body;

    if (!orderId || !email) {
      return res.status(400).send('Nedostaju podaci (orderId ili email)');
    }
    const details = {
      orderId,
      amount,
      paidAt: req.body.paidAt || new Date().toISOString(),
      payerName: req.body.payerName,
      payerEmail: req.body.payerEmail || email,
      reference: req.body.reference,
      receiverName: req.body.receiverName,
      receiverAccount: req.body.receiverAccount,
      receiverAddress: req.body.receiverAddress,
      method: req.body.method || 'IPS skeniraj'
    };

    await sendPaymentConfirmation(email, details);

    res.send({ success: true, message: 'Mail potvrde poslat korisniku.' });
  } catch (error) {
    console.error('❌ Greška u /confirm ruti:', error);
    res.status(500).send('Greška pri obradi potvrde plaćanja.');
  }
});

// ❌ email za neuspešno plaćanje
router.post('/failure', async (req, res) => {
  console.log('POST /api/payment/failure', req.body);
  try {
    const { orderId, email } = req.body;
    if (!orderId || !email) {
      return res.status(400).send('Nedostaju podaci (orderId ili email)');
    }

    const details = {
      orderId,
      amount: req.body.amount,
      paidAt: req.body.paidAt || new Date().toISOString(),
      payerName: req.body.payerName,
      payerEmail: req.body.payerEmail || email,
      reference: req.body.reference,
      receiverName: req.body.receiverName,
      receiverAccount: req.body.receiverAccount,
      receiverAddress: req.body.receiverAddress,
      method: req.body.method || 'IPS skeniraj'
    };

    await sendPaymentFailure(email, details);

    res.send({ success: true, message: 'Mail o neuspešnom plaćanju poslat.' });
  } catch (error) {
    console.error('❌ Greška u /failure ruti:', error);
    res.status(500).send('Greška pri obradi obaveštenja o neuspešnom plaćanju.');
  }
});

// 🟢 MOCK PAYTEN STRANICA (ovo mora biti van confirm rute)
router.get('/mock/paytenQrCode', (req, res) => {
  const { transactionId, successUrl, failUrl, cancelUrl } = req.query;

  res.send(`
    <!doctype html>
    <html>
      <body style="font-family:sans-serif;text-align:center;margin-top:100px">
        <h2>Mock Payten</h2>
        <p>Transakcija: ${transactionId}</p>
        <a href="${successUrl}">✅ Simulate SUCCESS</a> |
        <a href="${failUrl}">❌ Simulate FAIL</a> |
        <a href="${cancelUrl}">🚫 Simulate CANCEL</a>
      </body>
    </html>
  `);
});


export default router;
