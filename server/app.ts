import express from 'express';
import cors from 'cors';
import authRoutes from './src/routes/auth.routes';
import orderRoutes from './src/routes/order.routes';
import bodyParser from 'body-parser';

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use('/api/order', orderRoutes);

export default app;