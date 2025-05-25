const mongoose = require("mongoose");

const connectDb =  async ()=>{
   await  mongoose.connect("mongodb+srv://kajal:kajal@namastenode.krebsmd.mongodb.net/devTinder");
};
module.exports = connectDb;


