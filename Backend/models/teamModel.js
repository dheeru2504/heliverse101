import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    }],
});

export default mongoose.model("teams", teamSchema);
