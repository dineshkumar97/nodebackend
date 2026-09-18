import express from "express";

import {
    createUser,
    getUsers,
    authenticate,
    userDelete,
    updateUsers
} from "../controllers/userDetailsController.js";
import {
   forgotPassword, resetPassword
} from "../controllers/forgotPasswordController.js";

const router = express.Router();
// import verifyToken from '../middleware/verifytoken.js';

router.post("/create", createUser);
router.put('/update/:idUser', updateUsers);
router.get("/all", getUsers);
router.post('/authenticate', authenticate);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.delete('/delete/:idUser', userDelete);


export default router;