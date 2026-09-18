import express from "express";
import multer from 'multer';
import { upload } from '../middleware/uploadMiddleware.js';
import {
    createUser,
    getUsers,
    authenticate,
    userDelete,
    updateUsers,
    getProfile
} from "../controllers/userDetailsController.js";
import {
   forgotPassword, resetPassword
} from "../controllers/forgotPasswordController.js";

const router = express.Router();
// import verifyToken from '../middleware/verifytoken.js';
router.post("/create", createUser);
// router.put('/update/:idUser', updateUsers);
router.put('/update/:idUser',upload.single('profileImage'),updateUsers);
router.get('/profile/:idUser',getProfile);
router.get("/all", getUsers);
router.post('/authenticate', authenticate);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.delete('/delete/:idUser', userDelete);


export default router;