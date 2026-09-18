import express from "express";

import {
    createUser,
    getUsers,
    authenticate
} from "../controllers/userDetailsController.js";
import {
   forgotPassword, resetPassword
} from "../controllers/forgotPasswordController.js";

const router = express.Router();
import verifyToken from '../middleware/verifytoken.js';

router.post("/create", createUser);
router.get("/all",verifyToken, getUsers);
router.post('/authenticate', authenticate);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
export default router;