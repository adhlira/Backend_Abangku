import Jwt from "jsonwebtoken";
import prisma from "../helpers/prisma.js";

export default async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401);

  try {
    const token = authHeader.split(" ")[1];
    if (!token) return res.sendStatus(401);

    const decoded = Jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.special) {
      req.special = decoded.special;
      return next();
    }
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });
    if (!user) return res.sendStatus(401);

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      res.status(401).json({ message: "JWT Token expired" });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
}
