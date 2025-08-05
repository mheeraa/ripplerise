import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
// Import connectDB with curly braces if it's a named export
import { connectDB } from './config/db.js'; 

// Import your existing routes
import eventRoutes from "./routes/event.route.js";
import authRoutes from "./routes/auth.route.js";
// NEW: Import the user routes
import userRoutes from "./routes/user.route.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Your existing __dirname definition
const __dirname = path.resolve(); 

app.use(cors()); // allows requests from frontend
app.use(express.json()); // allows us to accept JSON data in the req.body

// API Routes
app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);
// NEW: Use the user routes
app.use("/api/users", userRoutes);


if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));
    app.get("/*any", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
} else {
    // Add a simple route for development mode to confirm server is running
    app.get('/', (req, res) => {
        res.send('API is running in development mode...');
    });
}

// Optional: Add a basic error handling middleware (good practice)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


app.listen(PORT, () => {
    connectDB(); // Your existing connectDB call
    console.log("Server started at http://localhost:" + PORT);
});