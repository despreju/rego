import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log('MongoDB connecté'))
  .catch((err) => console.error(err));

app.get('/api/hello', (_req, res) => {
    console.log('API hello called');
  res.json({ message: 'Hello from backend!' });
});

export default app;