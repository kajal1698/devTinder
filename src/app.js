const express = require("express");
const app = express();
const {adminAuth} = require("../middlewares/auth")
//now with this only home page will display but use app.get to match exact path then it will display matching route

//this will match all the http method API calls to /test
app.use("/test",(req,res)=>{
    res.send("Hello From test");
})
// app.use("/user",(req,res)=>{
//     //request handler 1
//     console.log("request handler 1");
//     res.send("handler 1 response");
// },(req,res)=>{
//     console.log("request handler 2");
//     res.send("handler 2 response");
// }
// )

//case 1

// app.use("/user",(req,res,next)=>{
//     //request handler 1
//     console.log("request handler 1");
//     res.send("handler 1 response");
//     next();
// },(req,res)=>{
//     console.log("request handler 2");
//     res.send("handler 2 response");
// }
// )

//case 2

// app.use("/user",(req,res,next)=>{
//     //request handler 1
//     console.log("request handler 1");
//     next();
//     res.send("handler 1 response");
// },(req,res)=>{
//     console.log("request handler 2");
//     res.send("handler 2 response");
// }
// )

//case 3

// app.use("/user",(req,res,next)=>{
//     //request handler 1
//     console.log("request handler 1");
//     next();
//     // res.send("handler 1 response");
// },(req,res)=>{
//     console.log("request handler 2");
//     res.send("handler 2 response");
// }
// )

//case 4

// app.use("/user",(req,res,next)=>{
//     //request handler 1
//     console.log("request handler 1");
//     next();
//     // res.send("handler 1 response");
// },(req,res,next)=>{
//     console.log("request handler 2");
//     next();
//     // res.send("handler 2 response");
// }
// )

//case 5

// app.use("/user",(req,res,next)=>{
//     //request handler 1
//     console.log("request handler 1");
//     next();
//     // res.send("handler 1 response");
// },(req,res,next)=>{
//     console.log("request handler 2");
//     // next();
//     // res.send("handler 2 response");
// }
// )
//this will only handle GET call to /user
app.get("/user",(req,res)=>{
    res.send({firstName : "Kajal",lastName: "Soni"});
})
app.post("/user",(req,res)=>{
    res.send("user data saved successfully");
})
app.use("/hello",(req,res)=>{
    res.send("Hello From hello");
})
app.use("/hello/2",(req,res)=>{
    res.send("hello from 2");
})
// app.use("/",(req,res)=>{
//     res.send("Hello From home page");
// })

app.use('/admin',adminAuth);
app.get('/admin/getAllData',(req,res)=>{
    res.send("All data sent by admin");
})
app.listen(5000,()=>{
    console.log("Server is listening on port 5000");
})