// app/validators/validate_req_body.js
import validator from "validator";

const validateProductReqBody = (req, res, next) => {
  const { name, price, quantity, rating, description } = req.body;
  if (!name || !price || !quantity || !rating || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }
  console.log(req.body);

  next();
};

const validateCartReqBody = (req, res, next) => {
  const { product_id, quantity,size_id } = req.body;
  if (!product_id || !quantity||!size_id) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (isNaN(product_id) || isNaN(quantity) || isNaN(size_id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  next();
};

export { validateProductReqBody, validateCartReqBody };
