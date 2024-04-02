import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoute.js"
import teamRoutes from "./routes/teamRoutes.js"
//configure env
dotenv.config();

try {
    const conn = await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
    });
    //console.log(`connected to Mongodb Database ${conn.connection.host}`);
} catch (error) {
    // console.log(`Error in Mongodb ${error}`.bgRed.white);
}


const app = express();
const corsOptions = {
    origin: '*',
    method: "GET,POST,PUT,DELETE",
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,

}

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/user", userRoutes);
app.use("/api/user", teamRoutes);

app.get("/", (req, res) => {
    res.json("hello");
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, async () => {
    // try {
    //   await connectDB();
    // } catch (error) {
    //   // console.log(`Error in Mongodb ${error}`.bgRed.white);
    // }
    console.log(`server started on PORT ${PORT}`);
});