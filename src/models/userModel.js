const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
const userSchema = new mongoose.Schema(
    {
    firstName : {
        type : String,
        required : true,
        minLength : 4,
        maxLength : 25
    },
    lastName : {
        type : String
    },
    email : {
        type : String,
        required : true,
        lowercase : true,
        trim : true,
        unique : true
    },
    age : {
        type : Number,
        min : 18
    },
    gender : {
        type : String,
        validate(value){
            if(value != 'male' && value != 'female' && value != 'other'){
                throw new Error("Invalid Gender");
            }
        }
    },
    about : {
        type : String,
        default : "This is the default about message"
    },
    hobbies : {
        type : [String]
    },
    password : { 
        type : String,
        required : true
    },
    photoUrl : {
        type : String,
        default : 'https://www.pnrao.com/wp-content/uploads/2023/06/dummy-user-male.jpg'
    }
},
{
    timestamps : true
});
//never use arrow function for this because arrow function works different incase of this
userSchema.methods.getJWT = async function (){
    //this will point to current user instance i.e if we are passing elon creditentials then this will refer to elon schema/obj.
    const user = this;
    const token = await jwt.sign({_id : user._id},"devTinder@123",{expiresIn:'7d'});
    return token;
}
userSchema.methods.validatePassword = async function(userInputPassword){
    const user = this;
    const userHashPaswword = user.password
    console.log("userInput::",userInputPassword,"user hash",userHashPaswword)
    const isPasswordValid = await bcrypt.compare(userInputPassword,userHashPaswword)
    return isPasswordValid
} 
const User = mongoose.model("User",userSchema);
module.exports = User;