import connectDB from "../Database/db.js";
import fs from "fs";
import path from "path";

// Admin routes :-
// Get Users - api/user/all_users
export const getAllUsers = async (req, res) => {
  try {
    const userRole = req.user?.role;

    const [users] = await connectDB.query(
      "SELECT id, username, email, role, contact, profile_image FROM users"
    );

    res.status(200).json({
      message: "All users fetched successfully",
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error during get all users!!!",
      error: error.message,
    });
  }
};

// Delete User - api/user/delete/:id
export const deleteUser = async (req, res) => {
  try {
    const id = req.user?.id;
    const role = req.user?.role;
    const userId = req.params.id;

    if (!id || role !== "admin") {
      return res.status(403).json({
        message: "Unauthorized : Admin access required!!!",
      });
    }

    if (id == userId) {
      return res.status(400).json({
        message: "Admin cannot delete own account!!!",
      });
    }

    const [userData] = await connectDB.query(
      "SELECT profile_image FROM users WHERE id=?",
      [userId]
    );

    if (userData.length === 0) {
      return res.status(404).json({
        message: "User not found...",
      });
    }

    const profileImage = userData[0].profile_image;

    if (profileImage) {
      const imageFile = path.basename(profileImage);

      const imagePath = path.join(process.cwd(), "uploads", imageFile);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log("Profile image deleted:", imagePath);
      } else {
        console.warn("Image not found:", imagePath);
      }
    }

    await connectDB.query("DELETE FROM users WHERE id=?", [userId]);

    res.status(200).json({
      message: "User deleted successfully by admin!!!",
      userId: userId,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error while deleting user...",
      error: error.message,
    });
  }
};

// User routes :-
export const updateuser = async (req, res) => {
  try {
    const user_id = req.user?.id;
    let { username, email, contact } = req.body;
    if (!user_id) {
      return res
        .status(401)
        .json({ message: "Unauthorized access : User not found..." });
    }

    username = username?.trim() || null;
    email = email?.trim() || null;
    contact = contact?.trim() || null;

    const [existingUser] = await connectDB.query(
      "SELECT * FROM users WHERE id=?",
      [user_id]
    );
    if (existingUser.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    await connectDB.query(
      `UPDATE users SET
      username = COALESCE(?,username),
      email = COALESCE(?,email),
      contact = COALESCE(?,contact)
      WHERE id=?`,
      [username, email, contact, user_id]
    );

    const [updateUser] = await connectDB.query(
      "SELECT id,username,email,contact,role,profile_image FROM users WHERE id=?",
      [user_id]
    );
    res
      .status(200)
      .json({ message: "User updated successfully.", user: updateUser[0] });
  } catch (error) {
    res.status(500).json({
      message: "Server error during update user!!!",
      error: error.message,
    });
  }
};
