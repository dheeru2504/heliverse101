import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            unique: true,
            required: true,
        },

        first_name: {
            type: String,
            required: true,
            trim: true,
        },
        last_name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        gender: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            required: true,
        },
        domain: {
            type: String,
            required: true,
        },
        available: {
            type: Boolean,
            required: false,
        },

    },
    { timestamps: true }
);

export default mongoose.model("users", userSchema);
