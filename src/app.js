const express = require("express");
const connectDb = require("./config/database");
const app = express();
const User = require("./models/userModel");
const {validateSignUpData} = require("../utilis/signValidations")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("../middlewares/auth")
app.use(express.json());
app.use(cookieParser());
app.post("/signup",async (req,res)=>{
  console.log("body:::",req.body)
  try{
    //creating a new Instance of the User
    validateSignUpData(req);
    const { firstName, lastName, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password,10);
    const user = new User({
      firstName,
      lastName,
      email,
      password:passwordHash
    });
    console.log("user::::",user);
    await user.save(); 
    res.send("Data added to database successfully");
  }
  catch(err){
    res.status(404).send("Error" + err.message);
  }

})
app.post("/login",async (req,res)=>{
  console.log("body:::",req.body)
  try{
    //creating a new Instance of the User
    const {password,email} = req.body;

    const user = await User.findOne({email : email});
    if(!user){
      throw new Error("Invalid Credentials");
    }
    // const isPasswordValid = await bcrypt.compare(password,user.password)
    const isPasswordValid = await user.validatePassword(password);
    console.log("isPasswordValid::",isPasswordValid);
    if(isPasswordValid) {
      //we will pass data to hide in that user _id & secret key that only server knows.
      // const token = await jwt.sign({_id : user._id},"devTinder@123",{expiresIn:'7d'});
      const token = await user.getJWT();
      const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); 
      console.log("token",token);
      //Add the token to the cookie & send the response back
      res.cookie("token",token,{expires: expiryDate});
      res.send("Login Successfully");
    }
    else{
      throw new Error ("Invalid Credentials");
    }
  }
  catch(err){
    res.status(404).send("Error ::::" + err.message);
  }

})
app.get("/profile",userAuth,async (req,res)=>{
  try{
    const {user} = req;
    console.log("User info:::::::::",user);
    res.send(user);
  }
  catch(err){
    res.status(404).send("Error ::::" + err.message);
  }
  
})
app.post("/sendconnectionrequest",userAuth,async (req,res)=>{
  console.log("sending the request");
  const {user} = req;
  res.send(user.firstName + " has sent connection request successfully");
})
app.get("/user",async (req,res)=>{
  const emailId = req.body.email
  const users = await User.find({email:emailId});
  if(users.length == 0){
    res.status(404).send("User not found");
  }else{
    res.send(users);
  }  
})
//get all the user from the database
app.get("/feed",async (req,res)=>{
  const users = await User.find({});  
  res.send(users);
})
//delete the user from database
app.delete("/user",async (req,res)=>{
  const userId = req.body.userId;
  try{
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  }
  catch(err){
    res.status(404).send("Something went wrong");
  }
})
//update the user in deatabase
app.patch("/user",async (req,res)=>{
  const userId = req.body.userId;
  const data = req.body;
  try{
    const allowed_users = ["about","gender","skills","age","userId","hobbies"]
    const isUpdateAllowed = Object.keys(req.body).every((key)=>allowed_users.includes(key));
    if(isUpdateAllowed == false){
      throw new Error("Update is not allowed");
    }
    const user = await User.findByIdAndUpdate({_id:userId},data,{runValidators : true});
    res.send("User updated successfully");
  }
  catch(err){
    res.status(404).send("Something went wrong" + err);
  }
})
connectDb()
  .then(() => {
    console.log("Connection with db is successfull");
    app.listen(5000, () => {
      console.log("Server is listening on port 5000");
    });
  })
  .catch(() => {
    console.error("Connection with db not successfull");
  });
