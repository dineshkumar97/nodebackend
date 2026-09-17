import EmployeeList from "../models/employeeModels.js";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";

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

export const exportEmployeesExcel = async (req, res) => {

    try {

        const {
            name,
            email,
            department,
            isActive
        } = req.body;

        const filter = {};

        if (name?.trim()) {
            filter.name = {
                $regex: name.trim(),
                $options: "i"
            };
        }

        if (email?.trim()) {
            filter.email = {
                $regex: email.trim(),
                $options: "i"
            };
        }

        if (department?.trim()) {
            filter.department = {
                $regex: department.trim(),
                $options: "i"
            };
        }

        if (isActive !== null && isActive !== undefined) {
            filter.isActive = isActive;
        }

        const employees = await EmployeeList
            .find(filter)
            .sort({ createdAt: -1 })
            .lean();

        const workbook = new ExcelJS.Workbook();

        const worksheet =
            workbook.addWorksheet("Employees");

        worksheet.columns = [
            {
                header: "S.No",
                key: "sno",
                width: 8
            },
            {
                header: "Employee Name",
                key: "name",
                width: 25
            },
            {
                header: "Email",
                key: "email",
                width: 30
            },
            {
                header: "Department",
                key: "department",
                width: 20
            },
            {
                header: "Phone",
                key: "phone",
                width: 18
            },
            {
                header: "Status",
                key: "status",
                width: 15
            }
        ];

        employees.forEach((employee, index) => {

            worksheet.addRow({
                sno: index + 1,
                name: employee.name || "",
                email: employee.email || "",
                department: employee.department || "",
                phone: employee.phone || "",
                status: employee.isActive
                    ? "Active"
                    : "Inactive"
            });

        });

        worksheet.getRow(1).font = {
            bold: true
        };

        const buffer =
            await workbook.xlsx.writeBuffer();

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            'attachment; filename="Employee_List.xlsx"'
        );

        return res.status(200).send(
            Buffer.from(buffer)
        );

    } catch (error) {

        console.error("Excel error:", error);

        return res.status(500).json({
            success: false,
            message: "Excel export failed"
        });
    }
};


export const exportEmployeesPDF = async (req, res) => {

    try {

        const {
            name,
            email,
            department,
            isActive
        } = req.body;

        const filter = {};

        if (name) {
            filter.name = {
                $regex: name.trim(),
                $options: "i"
            };
        }

        if (email) {
            filter.email = {
                $regex: email.trim(),
                $options: "i"
            };
        }

        if (department) {
            filter.department = {
                $regex: department.trim(),
                $options: "i"
            };
        }

        if (isActive !== null && isActive !== undefined) {
            filter.isActive = isActive;
        }

        const employees = await EmployeeList
            .find(filter)
            .sort({ createdAt: -1 });

        const doc = new PDFDocument({
            size: "A4",
            layout: "landscape",
            margin: 30
        });

        res.setHeader(
            "Content-Type",
            "application/pdf"
        );

        res.setHeader(
            "Content-Disposition",
            'attachment; filename="Employee_List.pdf"'
        );

        doc.pipe(res);

        // Title
        doc
            .fontSize(18)
            .text("Employee List", {
                align: "center"
            });

        doc.moveDown();

        // Table header
        let y = 80;

        doc.fontSize(10);

        doc.text("S.No", 30, y);
        doc.text("Name", 60, y);
        doc.text("Email", 180, y);
        doc.text("Department", 350, y);
        doc.text("Phone", 440, y);
        doc.text("Status", 520, y);

        y += 20;

        employees.forEach((employee, index) => {

            doc.text(
                String(index + 1),
                30,
                y
            );

            doc.text(
                employee.name || "",
                60,
                y,
                {
                    width: 110
                }
            );

            doc.text(
                employee.email || "",
                180,
                y,
                {
                    width: 160
                }
            );

            doc.text(
                employee.department || "",
                350,
                y,
                {
                    width: 80
                }
            );

            doc.text(
                employee.phone || "",
                440,
                y
            );

            doc.text(
                employee.isActive
                    ? "Active"
                    : "Inactive",
                520,
                y
            );

            y += 20;

            // New page
            if (y > 550) {
                doc.addPage();
                y = 50;
            }

        });

        doc.end();

    } catch (error) {

        console.error("PDF export error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to export employees"
        });
    }
};