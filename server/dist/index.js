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
console.log('Démarrage serveur ...');
const app = (0, express_1.default)();
dotenv_1.default.config();
const allowed = [
    "https://rego-three.vercel.app/", // prod
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
});
app.get("/api/health", (_req, res) => res.json({ ok: true }));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API on :${PORT}`));
