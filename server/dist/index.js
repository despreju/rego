"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const body_parser_1 = __importDefault(require("body-parser"));

dotenv_1.default.config();

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
    console.error('MONGO_URI non défini — vérifie les variables d\'environnement sur Railway.');
    // ne pas crash silencieusement ; quitte pour que la plateforme affiche l'erreur
    process.exit(1);
}
console.log('Démarrage serveur ...');
const app = (0, express_1.default)();
const allowed = [
    process.env.VERCEL_URL, // prod
    "http://localhost:5173",
    /\.vercel\.app$/ // préviews vercel (regex)
];
app.use((0, cors_1.default)({
    origin(origin, cb) {
        if (!origin || allowed.some(a => (a instanceof RegExp ? a.test(origin) : a === origin))) {
            return cb(null, true);
        }
        cb(new Error("Not allowed by CORS"));
    },
    credentials: true
}));
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.use('/api/auth', auth_routes_1.default);
app.use('/api/order', order_routes_1.default);
mongoose_1.default.connect(process.env.MONGO_URI)
    .then(() => {
    console.log('MongoDB connected');
})
    .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});
app.get("/api/health", (_req, res) => res.json({ ok: true }));
const PORT = process.env.PORT || 3000;
const port = Number(process.env.PORT) || 3000;
const server = app.listen(port, '0.0.0.0', () => {
    console.log('API on :', port);
});
process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});
process.on('SIGTERM', () => {
    console.log('SIGTERM reçu — fermeture propre du serveur');
    server.close(() => {
        console.log('Serveur fermé après SIGTERM');
        process.exit(0);
    });
});
process.on('SIGINT', () => {
    console.log('SIGINT reçu — fermeture');
    server.close(() => process.exit(0));
});
