import UserDetails from "../models/userDetailsModel.js";
import bcrypt from 'bcryptjs';
import generationToken from "../tokengeneration/generationToken.js";
import { sendSignupCreatedEmail } from "../services/emailService.js";

export const createUser = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        const existingUser = await UserDetails.findOne({ email });
        if (!existingUser) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new UserDetails({ name, email, phone, password: hashedPassword });
            await newUser.save();
            await sendSignupCreatedEmail(newUser);
            return res.status(201).json({ message: 'Signup successfully' });
        }
        res.status(409).json({ message: 'User Already Exists' });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message
        });
    }
};





export const getUsers = async (req, res) => {
    try {
        const users = await UserDetails.find();

        res.status(200).json(users);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to get users"
        });
    }
};



// export const authenticate = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await UserDetails.findOne({ email });
//         if (!user) {
//             return res.status(400).json({ message: 'Invalid email format' });
//         }
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ message: 'InCorrect Password' });
//         }
//         // const token = generationToken(user);
//         const message = {
//             // token:token,
//             message: 'Login Successfully...'
//         }
//         res.json(message)
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             message: error.message
//         });
//     }
// }

export const authenticate = async (req, res) => {
    try {
        const { email, password } = req.body;
        // 1. Find user by email
        const user = await UserDetails.findOne({ email });
        // 2. Email not found
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }
        // 3. Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        // 4. Password doesn't match
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }
        // 5. Login successful
        const token = generationToken(user);
        return res.status(200).json({
            message: "Login successful",
            token: token
        });

    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(500).json({
            message:  error.message
        });
    }
};


export const userDelete = async (req, res) => {
    try {
        const { idUser } = req.params;

        const user = await UserDetails.findByIdAndDelete(idUser);

        if (!user) {
            return res.status(404).json({
                message: 'user not found'
            });
        }

        return res.status(200).json({
            message: 'user deleted successfully',
            data: user
        });

    } catch (error) {
        console.error('Delete user error:', error);

        return res.status(500).json({
            message: 'Failed to delete department'
        });
    }
};


// | Situation                         |                      Status |
// | --------------------------------- | --------------------------: |
// | User created                      |               `201 Created` |
// | User already exists               |              `409 Conflict` |
// | Invalid/missing input             |           `400 Bad Request` |
// | Login unauthorized/wrong password |          `401 Unauthorized` |
// | No permission                     |             `403 Forbidden` |
// | User not found                    |             `404 Not Found` |
// | Server/database error             | `500 Internal Server Error` |
