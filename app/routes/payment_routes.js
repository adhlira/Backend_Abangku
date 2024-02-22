import { Router } from "express";

const router = Router();

router.post("/webhooks/payment", async (req, res) => {
  console.log(req.body);
  res.status(200).json({ status: "success", data: req.body });
});

export default router;
