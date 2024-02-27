import { Router } from "express";
import validateLogin from "../validators/validate_login.js";
import dotenv from "dotenv";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "../helpers/prisma.js";

dotenv.config();
const router = Router();

router.post("/login", validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    // admin check
    if (email === "admin@admin.com" && password === "admin") {
      const accessToken = Jwt.sign(
        { special: "admin" },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRES_IN,
        }
      );

      return res.status(200).json({
        message: "Welcome Admin",
        token: accessToken,
      });
    }
    // find the associated email
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res.status(400).json({ message: "Email not found" });
    }
    // compare password using bcrypt
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    // check if user is banned
    if (user.is_banned) {
      return res.status(401).json({ message: "You are banned" });
    }
    // generate jwt token
    const accessToken = Jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(200).json({
      message: "Login successful",
      token: accessToken,
      user: {
        id: user.id,
        username: user.username,
        fullname: user.fullname,
        email: user.email,
        role_id: user.role_id,
      },
    });
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
