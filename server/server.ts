import app from './app';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

console.log('Démarrage serveur ...')
dotenv.config();
console.log('JWT_SECRET:', process.env.JWT_SECRET)
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });