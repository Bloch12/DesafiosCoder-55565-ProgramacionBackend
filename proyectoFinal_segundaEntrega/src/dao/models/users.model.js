import mongoose from "mongoose";

const userCollection = "users";
const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true,
    },
    password: String,
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    }
});

export const usersModel = mongoose.model(userCollection, userSchema);