
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userId : {
        type : String,
        unique : true,
    },

    userName : {
        type : String,
        unique : true,
    },

    email : {
        type : String,
        required : true,

    },

    password : {
        type : String,
        required : true,
    },

    refresh_token : {
        type : String,
        unique : true,
        expires : '1y', // Refresh token will expire after 1 year
    },

    inventory : {
        type : mongoose.Schema.ObjectId('Part')

    },

});


const User = mongoose.model('User', userSchema);

export default User;