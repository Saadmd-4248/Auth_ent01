import mongoose from 'mongoose';

const Userschema = new mongoose.Schema({
    firstName: {
        type: String
    },

    lastName: {
        type: String
    },

    email: {
        type: String,
        required: true,
    },

    // phoneNo: {
    //     type: String
    // },

    profileImage: {
        type:String
    },

    password: {
        type: String,
        required: true,
    },
    verifyOtp: {
        type: String,
        default: ''
    },
    verifyOtpExpireAt: {
        type: Number,
        default: 0
    },
    isAccountVerified: {
        type: Boolean,
        default: false
    },
    resetOtp: {
        type: String,
        default: ''
    },
    resetOtpExpireAt: {
        type: Number,
        default: 0
    },
})

const userModel = mongoose.model("Auth", Userschema);
export default userModel;