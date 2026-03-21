
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

    parts : [{
        type : mongoose.Schema.ObjectId,
        ref : 'Part',
    }],

    inventory : [{
        type : mongoose.Schema.ObjectId,
        ref : 'Inventory',
    }],

    blueprint : [{
        type : mongoose.Schema.ObjectId,
        ref : 'Blueprint',
    }]

});


const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;