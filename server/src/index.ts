import mongoose from 'mongoose';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import orderRoutes from './routes/order.routes';
import bodyParser from 'body-parser';

console.log('Démarrage serveur ...')
const app = express();
dotenv.config();
const allowed = [
    "https://rego-h5kxx6zru-julien-desprezs-projects.vercel.app",              // prod
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
    });

app.get("/api/health", (_req, res) => res.json({ ok: true }));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API on :${PORT}`));