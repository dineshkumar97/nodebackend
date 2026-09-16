import mongoose from "mongoose";

const userDetailsSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        phone: {
            type: String
        },

        password: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const UserDetails = mongoose.model(
    "UserDetails",
    userDetailsSchema
);

export default UserDetails;