import { Router } from "express";
import prisma from "../helpers/prisma.js";
import validateRegister from "../validators/validate_register.js";
import bcrypt from "bcrypt";

const router = Router();

router.post("/register", validateRegister, async (req, res) => {
  const { username, email, password, phone } = req.body;
  console.log(req.body);
  try {
    // check if username already exist
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (user) {
      return res.status(400).json({ message: "Username is taken" });
    }

    //check if email already exist
    const emailExist = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (emailExist) {
      return res.status(400).json({ message: "Email is taken" });
    }

    // check if phone number already exist
    const phoneExist = await prisma.user.findUnique({
      where: {
        phone: phone,
      },
    });

    if (phoneExist) {
      return res.status(400).json({ message: "Phone number is taken" });
    }

    const result = await prisma.user.create({
      data: {
        username: username,
        email: email.toLowerCase(),
        password: bcrypt.hashSync(`${password}`, +process.env.BCRYPT_ROUNDS),
        phone: phone,
        role_id: 2,
        membership_id: 1,
      },
    });
    res.status(200).json({ message: "User created successfully", data: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
