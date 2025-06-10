const express = require("express");
const connectDb = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const authRouter = require("../routes/authentication");
const profileRouter = require("../routes/profile");
const connectionRouter = require("../routes/request");
const userRouter = require("../routes/user");
const cors = require("cors");
app.use(cors({
  origin : "http://localhost:3000",
  credentials : true
}));
app.use(express.json());
app.use(cookieParser());
app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",connectionRouter);
app.use("/",userRouter);

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
