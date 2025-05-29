const mongoose = require("mongoose");
const connectionRequestSchema = new mongoose.Schema({
    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    status : {
        type : String,
        required : true,
        //we use enum when we have fixed define value of the field in this case status will have only these 4 values anything aprat from it will throw error
        enum : {
            values : ["accepted","rejected","ignore","interested"],
            message : `{VALUE} is incorrect status type`
        }
    }
},
{
    timestamps : true
}
)
connectionRequestSchema.index({fromUserId : 1,toUserId : 1})
//model always starts with capital letter. we pass model name & schema.
const ConnectionRequestModel = new mongoose.model("ConnectionRequestModel",connectionRequestSchema);
module.exports = ConnectionRequestModel