import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();
import connectDB from './Database/db.js';
import authRoute from './Routers/authRouter.js'
import userRoute from './Routers/userRouter.js'
import taskRoute from './Routers/taskRouter.js'


const app = express();

// Middleware :
app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

// Middleware :
app.use(cookieParser());

// Port 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on the PORT`)
})

// Image Uploads :
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname,"uploads")));

// Auth Route 
app.use('/api/auth', authRoute);

// User Route 
app.use('/api/user', userRoute);

// Task ROute
app.use('/api/tasks',taskRoute)

// Default route:
app.get('/',(req,res) => {
    //console.log("Task Manager App is running...");
    res.send("Task Manager App is running...")
});

