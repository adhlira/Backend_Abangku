import { Router } from "express";
import prisma from "../helpers/prisma.js";
import validateRegister from "../validators/validate_register.js";
import bcrypt from "bcrypt";
import authenticateToken from "../middlewares/authenticate_token.js";
import authorize from "../middlewares/middleware.js";
import { Permission } from "../constant/authorization.js";

const router = Router();

router.post("/register", validateRegister, async (req, res) => {
  const { username, email, password, phone, fullname } = req.body;
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
        fullname: fullname,
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

router.get("/user", authenticateToken, authorize(Permission.READ_USERS), async (req, res) => {
  const user_email = req.user.email;
  const user = await prisma.user.findFirst({ where: { email: user_email } });
  if (!user) {
    res.status(404).json({ message: "User Not Found" });
  } else {
    res.json(user);
  }
});

router.put("/edit_user", authenticateToken, authorize(Permission.EDIT_USERS), async (req, res) => {
  const user_email = req.user.email;
  const user = await prisma.user.findFirst({ where: { email: user_email } });
  if (!user) {
    res.status(404).json({ message: "User Not Found" });
  } else {
    const user_updated = await prisma.user.update({ where: { email: user_email }, data: req.body });
    res.json(user_updated);
  }
});

export default router;
