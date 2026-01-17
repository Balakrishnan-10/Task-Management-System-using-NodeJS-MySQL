import connectDB from "../Database/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { username, email, contact, password,role } = req.body;
    const profile_image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, Email, and Password are required!",
      });
    }

    const [existingUser] = await connectDB.query(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        message: "Username or Email already exists!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await connectDB.query(
      `INSERT INTO users (username, email, contact, password, profile_image, role)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [username, email, contact || null, hashedPassword, profile_image,role]
    );

    res.status(201).json({
      message: "User registered successfully!",
      user: {
        id: result.insertId,
        username,
        email,
        contact: contact || null,
        role: role,
        profile_image,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error during user registration.",
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const [users] = await connectDB.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: "Invalid user details." });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password." });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: process.env.JWT_EXPIRES || "1d",
      }
    );

    const cookieExpireDays = Number(process.env.COOKIE_EXPIRES) || 7;

    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
    });

    res.status(200).json({
      message: "User login successful!!!",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error during user login.",
      error: error.message,
    });
  }
};

export const myprofile = async (req, res) => {
  try {
    const user_id = req.user.id;

    const [users] = await connectDB.query(
      "SELECT id,username,email,contact,profile_image FROM users WHERE id=?",[user_id]
    );

    if (users.length === 0) {
      return res.status(404).json({message:"User not found..."})
    }
    res.status(200).json(users[0]);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error during current user profile", error: error.message });
  }
};
