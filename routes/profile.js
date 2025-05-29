const express = require("express");
const profileRouter = express.Router();
const User = require("../src/models/userModel");
const {userAuth} = require("../middlewares/auth")
const {validateEditProfileData} = require("../utilis/signValidations")

const bcrypt = require("bcrypt");
  profileRouter.get("/profile/view",userAuth,async (req,res)=>{
    try{
      const {user} = req;
      console.log("User info:::::::::",user);
      res.send(user);
    }
    catch(err){
      res.status(404).send("Error ::::" + err.message);
    }
  })
  profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
    try{
      // let isEdit = ;
      if(validateEditProfileData(req) == false){
        throw new Error("Cannot edit fields invalid request");
      }
      else{
        const loggedInUser = req.user;
        const UserUpdateInfo = req.body;
        // console.log("loggedInUser before:::",loggedInUser);
        Object.keys(UserUpdateInfo).forEach((key)=>{
          loggedInUser[key] = UserUpdateInfo[key];
        })
        await loggedInUser.save();
        res.json({"message" : "profile has been edit successfullly","data" : loggedInUser});
        // console.log("loggedInUser after:::",loggedInUser);
      }
    }
    catch(err){
      res.status(404).send("Error ::::" + err.message);
    }

  })
  profileRouter.patch("/profile/edit/password",userAuth,async(req,res)=>{
    try{
      //find the user from database whose password you want to change.
      const user = await User.findOne({ email: req.user.email });
      //Validate the existing password to make sure user is owner of the id
      const isExistingPasswordValid = await user.validatePassword(req.body.currentPassword);
      if(!isExistingPasswordValid){
        throw new Error("Invalid request cannot change the password");
      }
      if(req.body.currentPassword === req.body.newPassword){
        throw new Error("New password cannot be same as current password");
      }
      //Create hash for new password
      const newPasswordHash = await bcrypt.hash(req.body.newPassword,10);
      //Update the user with new password hash
      user.password = newPasswordHash;
      //Save the password in db.
      await user.save();

      console.log("isExistingPasswordValid::",isExistingPasswordValid,"req.user",req.user);

      res.send(user.firstName + " Password has been updated successfully");
    }
    catch(err){
      res.status(404).send("Error ::::" + err.message);
    }

  })
  module.exports = profileRouter;