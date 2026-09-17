import EmployeeList from "../models/employeeModels.js";


export const createEmployee = async (req, res) => {
    try {
        const { name, email, phone, dob, department } = req.body;
        const existingUser = await EmployeeList.findOne({ email });
        if (!existingUser) {
            const employees = new EmployeeList({ name, email, phone, dob, department,isActive: true });
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

export const updateEmployee = async (req, res) => {
    try {
        const { name, email, phone, dob, department,isActive } = req.body
        const user = await EmployeeList.findByIdAndUpdate(req.params.idUser, { name, email, phone, dob, department ,isActive});
        await user.save();
        return res.status(201).json({ message: 'Employee list updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
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

export const toggleEmployeeStatus = async (req, res) => {
    try {
        const { idUser } = req.params;
        const employee = await EmployeeList.findById(idUser);
        if (!employee) {
            return res.status(404).json({
                message: 'Employee not found'
            });
        }
        employee.isActive = !employee.isActive;
        await employee.save();
        return res.status(200).json({
            message: employee.isActive
                ? 'Employee activated successfully'
                : 'Employee deactivated successfully',
            data: employee
        });
    } catch (error) {
        console.error('Toggle employee status error:', error);
        return res.status(500).json({
            message: 'Failed to update employee status'
        });
    }
};

export const searchEmployees = async (req, res) => {
    try {
        const { name, email, department, isActive } = req.body;
        let filter = {};
        if (name) {
            filter.name = { $regex: name, $options: "i" };
        }
        if (email) {
            filter.email = { $regex: email, $options: "i" };
        }
        if (department) {
            filter.department = { $regex: department, $options: "i" };
        }
        if (isActive !== undefined && isActive !== null) {
            filter.isActive = isActive;
        }
        const employees = await EmployeeList.find(filter);
         return res.status(200).json({
            message: 'Success',
            data: employees
        });
       
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to search employees"
        });
    }
};