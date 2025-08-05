import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { connectDB } from './config/db.js'; 
import eventRoutes from "./routes/event.route.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve(); 

app.use(cors()); 
app.use(express.json()); 
app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));
    app.get("/*any", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
} else {
    app.get('/', (req, res) => {
        res.send('API is running in development mode...');
    });
}

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
    connectDB(); 
    console.log("Server started at http://localhost:" + PORT);
});