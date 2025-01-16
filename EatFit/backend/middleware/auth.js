import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const protect = async (req, res, next) => {
    const { token } = req.headers;

    if (!token) {
        return res.status(401).json({ success: false, message: "No token provided, access denied" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = decoded.id; // Attach user ID to request body for later use
        next(); // Allow the request to proceed
    } catch (error) {
        res.status(401).json({ success: false, message: "Invalid token" });
    }
};

export default protect;
