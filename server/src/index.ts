import mongoose from 'mongoose';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import orderRoutes from './routes/order.routes';
import bodyParser from 'body-parser';

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error('MONGO_URI non défini — vérifie les variables d\'environnement sur Railway.');
  // ne pas crash silencieusement ; quitte pour que la plateforme affiche l'erreur
  process.exit(1);
}

console.log('Démarrage serveur ...')
const app = express();
dotenv.config();
const allowed = [
    process.env.VERCEL_URL,              // prod
    "http://localhost:5173",
    /\.vercel\.app$/                             // préviews vercel (regex)
];

app.use(cors({
    origin(origin, cb) {
        if (!origin || allowed.some(a => (a instanceof RegExp ? a.test(origin) : a === origin))) {
            return cb(null, true);
        }
        cb(new Error("Not allowed by CORS"));
    },
    credentials: true
}));
app.use(express.json());
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use('/api/order', orderRoutes);



mongoose.connect(process.env.MONGO_URI!)
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

app.get("/api/health", (_req, res) => res.json({ ok: true }));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API on :${PORT}`));