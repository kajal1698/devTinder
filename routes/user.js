const express = require("express");
const userRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const connectionRequest = require("../src/models/connectionRequestModel")
const User = require("../src/models/userModel")
userRouter.get("/users/requests/received",userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const connection_request = await connectionRequest.find({
            toUserId : loggedInUser._id,
            status : "interested"
        }).populate("fromUserId","firstName lastName age gender hobbies photoUrl about") //we we donot add the fields like firstName lastName it will send all the fields of user also we can write these fields in form of array as well ['firstName','lastName']
        
        if(connection_request.length == 0){
            return res.status(200).send("No active request found")
        }
        res.json({message : "Connection Request for " + loggedInUser.firstName + " have been fetched successfully",data : connection_request});
    }
    catch(err){
        res.status(404).send("Error ::::" + err.message);
      }
})
userRouter.get("/user/connections",userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user;
        //we will fetch all request like if kajal sent request to elon he accepeted it & if rohit sent request to kajal & she accepeted it then kajal connections will be two
        const connection_request = await connectionRequest.find({
            $or : [
                {toUserId : loggedInUser._id,status : "accepted"},
                {fromUserId : loggedInUser._id,status : "accepted"}
            ]
        }).populate("fromUserId","firstName lastName photoUrl age gender about hobbies")
          .populate("toUserId","firstName lastName photoUrl age gender about hobbies")
          console.log("connection_request::::",connection_request)
        //   const data = connection_request.map((row)=>{
        //     if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
        //         const toUserInfo = await User.findById(row.toUserId)
        //         console.log("toUserInfo::",toUserInfo)
        //     }
        //     return row.fromUserId
        //   })
        const data = await Promise.all(
            connection_request.map(async (row) => {
              if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                // Logged-in user sent the request, fetch full toUser info
                const toUserInfo = await User.findById(row.toUserId._id).select("firstName lastName photoUrl age gender about hobbies");
                return toUserInfo;
              } else {
                // Logged-in user received the request, use populated fromUser
                return row.fromUserId;
              }
            })
          );
        res.json({data : data})
    }
    catch{
        res.status(404).send("Error ::::" + err.message);
    }
})
userRouter.get("/user/feed",userAuth,async(req,res)=>{
    try{
    // feed will show only those connections whom you have not sent/recieved the request & also it will not show your own profile
        const loggedInUser = req.user;
        const page = parseInt(req.query.page);
        let limit = parseInt(req.body.limit);
        limit = limit > 50 ? 50 : limit;
        const skip = (page-1) + limit;
        //finding all connect whom request sent/receive
        const connection_request = await connectionRequest.find({
            $or : [{toUserId : loggedInUser._id},
            {fromUserId : loggedInUser._id}]
        }).select("fromUserId toUserId");
        //finding all unique id's
        const hideUserFromFeed = new Set();
        connection_request.forEach((req)=>{
            hideUserFromFeed.add(req.fromUserId._id.toString());
            hideUserFromFeed.add(req.toUserId._id.toString());
        })
        const users = await User.find({
            //$nin means finding all the element that are not present in hideuserarray & $ne means not equal to self _id i.e do not include loggedinuser.
            $and : [
                {_id : {$nin : Array.from(hideUserFromFeed)}},
                {_id : {$ne : loggedInUser._id}}
            ]
        }).select("firstName lastName about hobbies age photoUrl").skip(skip).limit(limit);
        console.log("users::::::",users);
        res.json({message : loggedInUser.firstName +' feeds fetched successfully',data : users});

    }
    catch(err){
        res.status(404).send("Error ::::" + err.message);
      }
})

module.exports = userRouter;