"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("../controllers/order.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post('/save', auth_middleware_1.protect, order_controller_1.save);
router.get('/orders', auth_middleware_1.protect, order_controller_1.getAll);
exports.default = router;
