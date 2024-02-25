import prisma from "../helpers/prisma.js";
import { Router } from "express";
import { Permission } from "../constant/authorization.js";
import authorize from "../middlewares/middleware.js";

const router = Router();

router.post("/category", async (req, res) => {
  const name = req.body;

  if (!req.body.name) {
    res.status(400).json({ message: "Name is required" });
  } else {
    const name_exist = await prisma.category.findFirst({
      where: { name: req.body.name },
    });
    if (name_exist) {
      res.status(400).json({ message: "Name is already" });
    } else {
      const category = await prisma.category.create({ data: name });
      res
        .status(200)
        .json({ message: "Category created successfully", category });
    }
  }
});

router.get("/category", async (req, res) => {
  const category = await prisma.category.findMany();
  if (category.length === 0) {
    res.status(404).json({ message: "Category is Empty" });
  } else {
    res.json(category);
  }
});

router.get("/category/:id", async (req, res) => {
  if (isNaN(req.params.id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }
  const category_id = +req.params.id;
  const category = await prisma.category.findFirst({
    where: { id: category_id },
  });
  if (!category) {
    res.status(404).json({ message: "Category not found" });
  } else {
    res.status(200).json(category);
  }
});

router.put("/category/:id", async (req, res) => {
  if (isNaN(req.params.id)) {
    res.status(400).json({ message: "Invalid ID" });
  } else {
    const category_id = await prisma.category.findFirst({
      where: { id: Number(req.params.id) },
    });
    if (!category_id) {
      res.status(404).json({ message: "Category not found" });
    } else {
      const category_exist = await prisma.category.findFirst({
        where: { name: req.body.name },
      });
      if (category_exist) {
        res.status(400).json({ message: "Category Name is already" });
      } else {
        const category_updated = await prisma.category.update({
          where: { id: Number(req.params.id) },
          data: req.body,
        });
        res.json({ message: "Category has been updated", category_updated });
      }
    }
  }
});

router.delete("/category/:id", async (req, res) => {
  if (isNaN(req.params.id)) {
    res.status(400).json({ message: "Invalid ID" });
  } else {
    const category_id = await prisma.category.findFirst({
      where: { id: Number(req.params.id) },
    });
    if (!category_id) {
      res.status(404).json({ message: "Category not found" });
    } else {
      const category_id = await prisma.category.findFirst({
        where: { id: Number(req.params.id) },
      });
      if (!category_id) {
        res.status(404).json({ message: "Category not found" });
      } else {
        await prisma.category.delete({
          where: { id: Number(req.params.id) },
        });
        res.json({ message: "Category has been deleted" });
      }
    }
  }
});

export default router;
