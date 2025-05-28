const express = require("express");
const profileRouter = express.Router();
const User = require("../src/models/userModel");
const {userAuth} = require("../middlewares/auth")
profileRouter.get("/profile",userAuth,async (req,res)=>{
    try{
      const {user} = req;
      console.log("User info:::::::::",user);
      res.send(user);
    }
    catch(err){
      res.status(404).send("Error ::::" + err.message);
    }
  })
  module.exports = profileRouter;