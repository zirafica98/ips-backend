import express from 'express';
const router = express.Router();

router.post('/', (req, res) => {
  res.json({ message: 'Checkout completed (placeholder)' });
});

export default router;
