import express from "express";
import { barcodeLogin } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", barcodeLogin);

export default router;
