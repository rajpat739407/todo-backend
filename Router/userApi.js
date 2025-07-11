const mongoose = require('mongoose');
const express = require('express');
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const User = require("../model/userSchema");
const router = express.Router();
const bcrypt = require('bcryptjs');




router.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const hashedConfirmPassword = await bcrypt.hash(req.body.confirmPassword, 10);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            confirmPassword: hashedConfirmPassword
        });
        const savedUser = await user.save();
        res.status(201).json({ message: 'User registered successfully', user: savedUser });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user', error });
    }
});

router.get('/register', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users', error });
    }
});
router.get('/register/:email', async (req, res) => {
    try {
        const email= req.params.email;
        const user = await User.findOne({email:email});
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users', error });
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Error logging in user', error });
    }
}
);

router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    }
    catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users', error });
    }
});

router.get('/users/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Error fetching user', error });
    }
});


router.delete('/users/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user', error });
    }
});


router.put('/users/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const user = await User.findByIdAndUpdate(id, updatedData, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user', error });
    }
});


router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User with that email not found" });

    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetLink = `https://todo-frontend-vz1h.onrender.com/reset-password/${token}`;

    await sendEmail(
      email,
      "Password Reset",
      `You requested a password reset. Click the link to reset your password: ${resetLink}`
    );

    res.status(200).json({ message: "Reset email sent" });
  } catch (error) {
    console.error("Error in forgot-password:", error);
    res.status(500).json({ message: "Error sending reset link" });
  }
});


  router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  try {
    // Validate inputs
    if (!password || !confirmPassword) {
      return res.status(400).json({ message: "Password and confirmation are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Find user with valid token
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Hash new passwords
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedConfirm = await bcrypt.hash(confirmPassword, 10);

    // Update user
    user.password = hashedPassword;
    user.confirmPassword = hashedConfirm;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Detailed password reset error:", {
      message: error.message,
      stack: error.stack,
      requestBody: req.body
    });
    
    res.status(500).json({ 
      message: "Error resetting password",
      error: error.message 
    });
  }
});
  



module.exports = router;
