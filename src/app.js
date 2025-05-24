const express = require("express");
const app = express();
//now with this only home page will display but use app.get to match exact path then it will display matching route
app.use("/",(req,res)=>{
    res.send("Hello From home page");
})

app.use("/test",(req,res)=>{
    res.send("Hello From Server");
})
app.use("/hello",(req,res)=>{
    res.send("Hello From hello");
})
app.listen(5000,()=>{
    console.log("Server is listening on port 5000");
})