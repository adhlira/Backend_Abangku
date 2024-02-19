import validator from "validator";

const validateRegister = (req, res, next) => {
  const { username, email, password, phone } = req.body;
  if (!username || !email || !password || !phone) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email" });
  }
  if (
    !validator.isStrongPassword(password, {
      minLength: 8,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long and at least contain 1 uppercase letter, 1 number and 1 symbol",
    });
  }
  if (!validator.isMobilePhone(phone)) {
    return res.status(400).json({ message: "Invalid phone number" });
  }
  next();
};

export default validateRegister;
