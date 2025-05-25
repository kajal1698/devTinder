const express = require("express");
const connectDb = require("./config/database");
const app = express();
const User = require("./models/userModel");

app.post("/signup",async (req,res)=>{
    //creating a new Instance of the User
    const user = new User({
        firstName : "Kajal",
        lastName : "Soni",
        email : "kkajalssoni@gmail.com",
        age : 26,
        gender : "female"
    });
    await user.save();
    res.send("Data added to database successfully");
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
