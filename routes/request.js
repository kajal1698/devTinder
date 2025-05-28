const express = require("express");
const connectionRouter = express.Router();
const {userAuth} = require("../middlewares/auth")
const User = require("../src/models/userModel");
connectionRouter.post("/sendconnectionrequest",userAuth,async (req,res)=>{
    console.log("sending the request");
    const {user} = req;
    res.send(user.firstName + " has sent connection request successfully");
  })
  module.exports = connectionRouter;