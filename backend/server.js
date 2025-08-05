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

// Middleware (CORRECT ORDER)
// 1. First, enable CORS
app.use(cors()); 
// 2. Second, enable JSON body parsing
app.use(express.json()); 

// API Routes (Defined after middleware)
app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Serve frontend in production
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

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
    connectDB(); 
    console.log("Server started at http://localhost:" + PORT);
});