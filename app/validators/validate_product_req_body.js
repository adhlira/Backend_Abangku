import validator from "validator";

const validateProductReqBody = (req, res, next) => {
  const { name, price, quantity, rating, description } = req.body;
    if (!name || !price || !quantity || !rating || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }
  console.log(req.body);
  next();
};

export default validateProductReqBody;
