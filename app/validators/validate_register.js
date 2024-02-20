import validator from "validator";

const validateRegister = (req, res, next) => {
  const { username, email, password, phone, fullname } = req.body;
  const errors = {};

  if (!username || !email || !password || !phone || !fullname) {
    errors.allFields = { message: "All fields are required" };
  }

  if (!validator.isEmail(email)) {
    errors.email = { message: "Invalid email" };
  }

  if (
    !validator.isStrongPassword(password, {
      minLength: 6,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    })
  ) {
    errors.password = {
      message:
        "Password must be at least 6 characters long and at least contain 1 uppercase letter, 1 number",
    };
  }

  if (!validator.isMobilePhone(phone)) {
    errors.phone = { message: "Invalid phone number" };
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

export default validateRegister;
