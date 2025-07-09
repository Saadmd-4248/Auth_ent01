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

    phoneNo: {
        type: String
    },

    profileImage: {
        type:String
    },

    password: {
        type: String,
        required: true,
    },


})

const userModel = mongoose.model("Auth", Userschema);
export default userModel;