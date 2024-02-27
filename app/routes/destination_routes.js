import { Router } from "express";
import prisma from "../helpers/prisma.js";
import authenticateToken from "../middlewares/authenticate_token.js";
import dotenv from "dotenv";
import axios from "axios";
import NodeCache from "node-cache";

dotenv.config();
const router = Router();
const myCache = new NodeCache({ stdTTL: 600, checkperiod: 30000 });

router.get("/provinces", async (req, res) => {
  try {
    const cachedProvinces = myCache.get("provinces");
    if (cachedProvinces) {
      res.status(200).json(cachedProvinces);
      return;
    }
    console.log("no cache here");
    const province = await axios.get(
      "https://api.rajaongkir.com/starter/province",
      {
        headers: {
          key: process.env.RAJAONGKIR_API_KEY,
        },
      }
    );

    if (province.status === 200) {
      console.log("here");
      const provincesData = province.data.rajaongkir.results;
      myCache.set("provinces", provincesData);
      res.status(200).json(province.data.rajaongkir.results);
    } else {
      res.status(province.status).json({ message: error.message });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/cities/:id", async (req, res) => {
  const province_id = +req.params.id;
  try {
    const province = await axios.get(
      "https://api.rajaongkir.com/starter/city",
      {
        params: {
          province: province_id,
        },
        headers: {
          key: process.env.RAJAONGKIR_API_KEY,
        },
      }
    );
    if (province.status === 200) {
      res.status(200).json(province.data.rajaongkir.results);
    } else {
      res.status(province.status).json({ message: error.message });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
