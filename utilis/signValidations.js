const validators = require("validator");
const bcrypt = require("bcrypt");
const validateSignUpData = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!validators.isEmail(email)) {
    throw new Error("Email is not valid");
  }
};
const validateEditProfileData = (req) =>{
  const UserUpdateInfo = req.body;
  const editableAllowedFields = ["firstName","lastName","age","about","gender","hobbies"];
  const isEditAllowed = Object.keys(UserUpdateInfo).every((key)=>editableAllowedFields.includes(key));
  return isEditAllowed;
}

module.exports = { validateSignUpData,validateEditProfileData };
