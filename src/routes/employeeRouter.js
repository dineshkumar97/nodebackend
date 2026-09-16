import express from "express";

import {
    createEmployee,
    getEmployees,
} from "../controllers/employeeController.js";

const router = express.Router();
import verifyToken from '../middleware/verifytoken.js';

router.post("/create", createEmployee);
router.get("/all",verifyToken, getEmployees);

export default router;