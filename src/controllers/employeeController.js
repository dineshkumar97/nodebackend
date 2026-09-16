import EmployeeList from "../models/employeeModels.js";


export const createEmployee = async (req, res) => {
    try {
        const { name, email, phone, dob, department } = req.body;
        const existingUser = await EmployeeList.findOne({ email });
        if (!existingUser) {
            const employees = new EmployeeList({ name, email, phone, dob, department });
            await employees.save();
            return res.status(201).json({ message: 'Employee Created' });
        }
        res.status(409).json({ message: 'Employee Already Exists' });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message
        });
    }
};





export const getEmployees = async (req, res) => {
    try {
        const users = await EmployeeList.find();

        res.status(200).json(users);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to get employees"
        });
    }
};

