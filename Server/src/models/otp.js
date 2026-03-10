
import mongoose from "mongoose";
import MailSender from "../../utils/mailSender";

const OTPSchemas = new mongoose.Schema({
    email : {
        type : String,
        required : true
    },

    otp : {
        type : String,
        required : true
    },

    createdAt : {
        type : Date,
        default : Date.now(),
        expires : 10 * 60 * 60      // expires after 10 min 
    }
});

exports.SendVerificationMail = async ({ email, otp }) => {
    try {
        
        const mailResponse = await MailSender(
            email,
            'Verification Mail From - How To Assemble Anything',
            `This is your OTP : - ${otp}`
        );

        console.log('OPT Send Successfully', mailResponse)

    } catch (error) {
        console.log('Error while Sending Mail', error);
    }
}

const OTP = mongoose.model('OTP', OTPSchemas);

export default OTP;