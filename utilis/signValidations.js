const validators = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!validators.isEmail(email)) {
    throw new Error("Email is not valid");
  }
};

module.exports = { validateSignUpData };
