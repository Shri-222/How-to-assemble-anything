
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firebaseUid : {
        type : String,
        required  :true,
        unique : true,
    },

    email : {
        type : String,
        required : true,

    },

    inventory : [{
        type : mongoose.Schema.ObjectId,
        ref : 'Part',
    }],

});


const User = mongoose.model('User', userSchema);

export default User;