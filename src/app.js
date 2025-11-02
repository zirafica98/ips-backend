import express from 'express';
import cors from 'cors';
import productsRouter from './routes/products.js';
import cartRouter from './routes/cart.js';
import checkoutRouter from './routes/checkout.js';
import paymentRouter from './routes/payment.js';
import ordersRouter from './routes/orders.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('✅ Backend radi');
});

// Health-check ruta
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});



app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/checkout', checkoutRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/orders', ordersRouter);

// Globalni error handler za nepostojeće rute (mora biti poslednji)
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta ne postoji', path: req.originalUrl });
});

export default app;
