import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.json({ success: false, message: "Not authorized. Login Again." });
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.json({ success: false, message: "Not authorized. Login Again." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded || !decoded.id) {
             return res.json({ success: false, message: "Not authorized. Invalid token." });
        }

        req.user = await User.findById(decoded.id).select("-password");
        
        if (!req.user) {
            return res.json({ success: false, message: "User not found." });
        }

        next();
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
}


