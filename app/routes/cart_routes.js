import { Router } from "express";
import prisma from "../helpers/prisma.js";
import authenticateToken from "../middlewares/authenticate_token.js";

const router = Router();

router.post("/cart", authenticateToken, async (req, res) => {
    const { product_id, quantity } = req.body;
    
    
})