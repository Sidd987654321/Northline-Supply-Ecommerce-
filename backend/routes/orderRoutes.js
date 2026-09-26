import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrder,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

// Admin 
router.get("/", protect, adminOnly, getAllOrders);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

// Customer
router.post("/", protect, createOrder);
router.get("/my", protect, getMyOrders);
router.get("/:id", protect, getOrder);
router.put("/:id/cancel", protect, cancelOrder);

export default router;
