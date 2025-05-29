const express = require("express");
const connectionRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../src/models/connectionRequestModel");
const User = require("../src/models/userModel");
connectionRouter.post(
  "/request/send/:status/:toUserid",userAuth,async (req, res) => {
    try{
      const status = req.params.status;
      const toUserid = req.params.toUserid;
      const fromUserid = req.user._id;
      const fromUser = await User.findOne({_id : toUserid});
      const allowedStatus = ["interested","ignore"];
      //prevent from sending other status
      if(allowedStatus.includes(status) == false){
        return res.status(400).json({message : "Invalid status type : " + status})
      }
      //check for it cannot send request to itsself
      if(toUserid === fromUserid.toString()){
        return res.status(400).json({message:"Invalid Connection Request"})
      }
      const isToUserValid = await User.findById(toUserid);
      if(!isToUserValid){
        return res.status(400).json({message : "User not found"});
      }
      //check for duplicate request i.e if i have sent request to elon then i should not able to send & also if i have sent request then elon should also not be able to send request.
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or : [
          {fromUserId : fromUserid,toUserId : toUserid},
          {fromUserId : toUserid,toUserId : fromUserid}
        ]
      })
      if(existingConnectionRequest){
        return res.status(400).json({message : "Connection already exits"});
      }
      const connectionRqst = new ConnectionRequest({
        fromUserId : fromUserid,
        toUserId : toUserid,
        status : status
      })
      const saveConnectionData = await connectionRqst.save();
      res.json({message : req.user.firstName + " has sent connection request to " + fromUser.firstName,data : saveConnectionData})
    }
    catch (err){
      res.status(400).send("Error :::"+ err);
    }
  }
);
connectionRouter.get("/request/get",async(req,res)=>{

})
module.exports = connectionRouter;
