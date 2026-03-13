require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ielts-talkmate';
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB: ' + MONGODB_URI))
    .catch(err => console.error('MongoDB connection error:', err));

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, targetBand } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password: hashedPassword,
            targetBand: targetBand || 7.0,
            joinedAt: Date.now()
        });
        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'ielts_master_secret');
        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                targetBand: user.targetBand,
                joinedAt: user.joinedAt
            }
        });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'ielts_master_secret');
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                targetBand: user.targetBand,
                englishLevel: user.englishLevel,
                routine: user.routine,
                examDate: user.examDate,
                joinedAt: user.joinedAt
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Update Profile Route
app.put('/api/users/profile', async (req, res) => {
    try {
        const { userId, ...updates } = req.body;
        const user = await User.findByIdAndUpdate(userId, updates, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            targetBand: user.targetBand,
            englishLevel: user.englishLevel,
            routine: user.routine,
            examDate: user.examDate,
            joinedAt: user.joinedAt
        });
    } catch (err) {
        console.error('Update profile error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 API Endpoints active`);
});
