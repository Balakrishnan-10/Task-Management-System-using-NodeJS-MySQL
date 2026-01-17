import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = mysql.createPool({
    host: process.env.DB_HOST,       
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT || 3306,
});

// Test the connection
connectDB.getConnection()
    .then((connection) => {
        console.log("Database connected successfully!!!");
        connection.release();
    })
    .catch((err) => {
        console.error("Database connection failed:", err.message);
    });

export default connectDB;
