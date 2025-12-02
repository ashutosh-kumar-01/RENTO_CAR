import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Car from "../models/Car.js";

// generate jwt token
const generateToken = (userId) => {
    const payload = { id: userId };
    return jwt.sign(payload, process.env.JWT_SECRET);
};

// register user
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Please fill all the fields" });
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
        }

        // Check if email is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email address" });
        }

        const userExists = await User.findOne({ email: email.toLowerCase() });
        if (userExists) {
            return res.status(400).json({ success: false, message: "User already exists with this email" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ 
            name, 
            email: email.toLowerCase(), 
            password: hashedPassword 
        });
        const token = generateToken(user._id.toString());

        return res.status(201).json({ success: true, message: "Account created successfully!", token });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: "Server error. Please try again." });
    }
};

// login user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please enter email and password" });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const token = generateToken(user._id.toString());

        return res.status(200).json({ success: true, message: "Login successful!", token });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: "Server error. Please try again." });
    }
};

// Get User data using Token (JWT)
export const getUserData = async (req, res) => {
    try {
        const { user } = req;
        res.json({ success: true, user });
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
};

// get all cars for the frontend
export const getCars = async (req, res) => {
    try {
        const cars = await Car.find({}); 
        res.json({ success: true, cars });
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
};
