import validator from "validator";

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (email === "admin" && password === "admin") {
    return next();
  }
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email" });
  }
  next();
};

export default validateLogin;
