import express from 'express';
import cors from 'cors';
import productsRouter from './routes/products.js';
import cartRouter from './routes/cart.js';
import checkoutRouter from './routes/checkout.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/checkout', checkoutRouter);

export default app;
