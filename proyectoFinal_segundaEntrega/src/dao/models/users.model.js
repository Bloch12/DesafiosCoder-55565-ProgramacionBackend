import mongoose from "mongoose";

const userCollection = "users";
const userSchema = new mongoose.Schema({
    frist_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true,
    },
    age: Number,
    password: String,
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts"
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    }
    
});

export const usersModel = mongoose.model(userCollection, userSchema);