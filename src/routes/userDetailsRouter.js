import express from "express";

import {
    createUser,
    getUsers,
    authenticate
} from "../controllers/userDetailsController.js";

const router = express.Router();
import verifyToken from '../middleware/verifytoken.js';

router.post("/create", createUser);
router.get("/all",verifyToken, getUsers);
router.post('/authenticate', authenticate);

export default router;