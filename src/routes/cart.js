import express from 'express';
const router = express.Router();

router.post('/', (req, res) => {
  res.json({ message: 'Item added to cart (mock for now)' });
});

export default router;
