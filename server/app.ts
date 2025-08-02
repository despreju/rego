import express from 'express';
import cors from 'cors';
import authRoutes from './src/routes/auth.routes';
import bodyParser from 'body-parser';

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);

export default app;