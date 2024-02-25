// app/validators/validate_req_body.js
import validator from "validator";

const validateProductReqBody = (req, res, next) => {
  const { name, price, quantity, rating, description, size } = req.body;
  if (!name || !price || !quantity || !rating || !description || !size) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (JSON.parse(size).length === 0) {
    return res.status(400).json({ message: "Size is required" });
  }
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "Image is required" });
  }
  console.log(req.body);

  next();
};

const validateCartReqBody = (req, res, next) => {
  const { product_id, quantity, size_id } = req.body;
  if (!product_id || !quantity || !size_id) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (isNaN(product_id) || isNaN(quantity) || isNaN(size_id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  next();
};

export { validateProductReqBody, validateCartReqBody };
