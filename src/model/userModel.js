import mongoose from "mongoose";


const schemaModel = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    mobile_number: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        default: null,
    },

    otpExpires: {
        type: Date,
        default: null,
    }
},
    {
        timestamps: true
    }
);

const User = mongoose.model("user-info", schemaModel);
export default User;
