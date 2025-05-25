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
module.exports = {
    adminAuth
}