import validator from "validator";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import userModel from "../models/userModel.js";

// Function to create a token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
}

// Route for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = createToken(user._id);
            res.json({ 
                success: true, 
                token,
                user: { // Include user data, especially the 'isStudent' flag
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    isStudent: user.isStudent,
                    studentEmail: user.studentEmail,
                    university: user.university
                }
            });
        } else {
            res.json({ success: false, message: 'Invalid credentials' });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Route for user register
const registerUser = async (req, res) => {
    try {
        const { name, email, password, isStudent, studentEmail, university } = req.body;

        // Check if the user already exists
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        // Validate email format & strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        // If user is a student, validate student email and university
        if (isStudent) {
            if (!validator.isEmail(studentEmail)) {
                return res.json({ success: false, message: "Please enter a valid student email" });
            }
            if (!university || university.trim() === "") {
                return res.json({ success: false, message: "University name is required for students" });
            }
        }

        // Hash user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user with or without student info
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            isStudent: isStudent || false,
            studentEmail: isStudent ? studentEmail : null,
            university: isStudent ? university : null
        });

        const user = await newUser.save();
        const token = createToken(user._id);

        res.json({
            success: true,
            token,
            user: { // Include user data, especially the 'isStudent' flag
                id: user._id,
                name: user.name,
                email: user.email,
                isStudent: user.isStudent,
                studentEmail: user.studentEmail,
                university: user.university
            }
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Route for admin login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Add this function to your userController.js
const getUserProfile = async (req, res) => {
  try {
      const user = await userModel.findById(req.userId); // Assumes req.userId is populated by middleware

      if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
      }

      res.json({ success: true, user });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
  }
};


export { loginUser, registerUser, adminLogin, getUserProfile }
