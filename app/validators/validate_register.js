import validator from "validator";

const validateRegister = (req, res, next) => {
  const { username, email, password, phone } = req.body;
  if (!username || !email || !password || !phone) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({
      message: "Invalid email",
    });
  }
  if (
    !validator.isStrongPassword(password, {
      minLength: 6,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    })
  ) {
    return res.status(400).json({
      message: "Password must be at least 6 characters long and at least contain 1 uppercase letter, 1 number",
    });
  }
  if (!validator.isMobilePhone(phone)) {
    return res.status(400).json({
      message: "Invalid phone number",
    });
  }
  next();
};

export default validateRegister;
