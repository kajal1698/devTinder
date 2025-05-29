const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utilis/signValidations");
const User = require("../src/models/userModel");
const bcrypt = require("bcrypt");
authRouter.post("/signup", async (req, res) => {
  console.log("body:::", req.body);
  try {
    //creating a new Instance of the User
    validateSignUpData(req);
    const { firstName, lastName, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    console.log("user::::", user);
    await user.save();
    res.send("Data added to database successfully");
  } catch (err) {
    res.status(404).send("Error" + err.message);
  }
});
authRouter.post("/login", async (req, res) => {
  console.log("body:::", req.body);
  try {
    //creating a new Instance of the User
    const { password, email } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    // const isPasswordValid = await bcrypt.compare(password,user.password)
    const isPasswordValid = await user.validatePassword(password);
    console.log("isPasswordValid::", isPasswordValid);
    if (isPasswordValid) {
      //we will pass data to hide in that user _id & secret key that only server knows.
      // const token = await jwt.sign({_id : user._id},"devTinder@123",{expiresIn:'7d'});
      const token = await user.getJWT();
      const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      console.log("token", token);
      //Add the token to the cookie & send the response back
      res.cookie("token", token, { expires: expiryDate });
      res.send("Login Successfully");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(404).send("Error ::::" + err.message);
  }
});
authRouter.post("/logout",async (req,res)=>{

  res.cookie("token",null,{expires: new Date(Date.now())});
  res.send("Logged out successfully");
})
module.exports = authRouter;
