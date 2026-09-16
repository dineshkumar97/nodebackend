import mongoose from "mongoose";

const employeeListSchema = new mongoose.Schema(
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

        dob: {
            type: String,
            required: true,
        },
        department: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const EmployeeList = mongoose.model(
    "EmployeeList",
    employeeListSchema
);

export default EmployeeList;