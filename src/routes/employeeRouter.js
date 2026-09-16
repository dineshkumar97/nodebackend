import express from "express";

import {
    createEmployee,
    getEmployees,
    updateEmployee,
    toggleEmployeeStatus
} from "../controllers/employeeController.js";

const router = express.Router();
import verifyToken from '../middleware/verifytoken.js';

router.post("/create", createEmployee);
router.get("/all",verifyToken, getEmployees);
router.put('/update/:idUser', updateEmployee);
router.put('/status/:idUser',toggleEmployeeStatus);


export default router;