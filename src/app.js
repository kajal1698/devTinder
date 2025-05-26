const express = require("express");
const connectDb = require("./config/database");
const app = express();
const User = require("./models/userModel");

app.use(express.json());
app.post("/signup",async (req,res)=>{
  console.log("body:::",req.body)
    //creating a new Instance of the User
    const user = new User(req.body);
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
