const jwt = require("jsonwebtoken");
const User = require("../src/models/userModel");
const { request } = require("express");
const adminAuth = (req,res,next)=>{
    console.log("middleware called")
    const token = 'xyz';
    const isAdminAuthorize = token === 'xyz';
    if(!isAdminAuthorize){
        res.status(401).send("Unauthorized access not allowed");
    }
    else{
        next();
    }
}
const userAuth = async(req,res,next)=>{
    try{
        //reading the cookie & extract token
        const cookie = req.cookies;
        const {token} = cookie;
        if(!token){
            throw new Error("Token is not valid")
        }
            //verifying the token
        const decodedMsg = jwt.verify(token,"devTinder@123");
        const {_id} = decodedMsg
        console.log("User found id ::::",_id);
        const user = await User.findById(_id);
        if(!user){
            throw new Error("User not found");
          }
        request.user = user;
        next();
    }
    catch(err){
        res.status(404).send("Error ::::" + err.message);
    }
    

}
module.exports = {
    adminAuth,
    userAuth
}