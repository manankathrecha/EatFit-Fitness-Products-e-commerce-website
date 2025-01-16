import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
    isStudent: { type: Boolean, default: false }, // New field: indicates if the user is a student
    studentEmail: { type: String, default: null }, // New field: student's email
    university: { type: String, default: null }, // New field: student's university
  },
  { minimize: false }
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
