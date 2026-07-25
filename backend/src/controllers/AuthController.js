const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register new user
const registerUser = async (req, res) => {
    try {
        const { name, first_name, last_name, email, password } = req.body;

        // Construct full name if first_name / last_name provided
        const fullName = (name || `${first_name || ''} ${last_name || ''}`).trim();

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const role = email.toLowerCase().includes('admin') ? 'admin' : 'user';
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name: fullName,
            email: email.toLowerCase(),
            password: hashedPassword,
            role,
            watchlist: []
        });

        const token = jwt.sign(
            { id: newUser._id, email: newUser.email, name: newUser.name, role: newUser.role },
            process.env.JWT_SECRET || 'secretkey',
            { expiresIn: '7d' }
        );

        const userResponse = {
            _id: newUser._id,
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            watchlist: newUser.watchlist
        };

        res.status(201).json({
            message: 'User registered successfully',
            token,
            sessionId: token,
            userId: newUser._id,
            user: userResponse
        });

    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

// Login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, name: user.name, role: user.role },
            process.env.JWT_SECRET || 'secretkey',
            { expiresIn: '7d' }
        );

        const userResponse = {
            _id: user._id,
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            watchlist: user.watchlist
        };

        res.status(200).json({
            message: 'Login successful',
            token,
            sessionId: token,
            userId: user._id,
            user: userResponse
        });

    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

// Get current logged-in user profile & watchlist
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password').populate('watchlist');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user profile', error: error.message });
    }
};

// Google OAuth Trigger endpoint
const googleLogin = async (req, res) => {
    try {
        if (process.env.GOOGLE_CLIENT_ID) {
            const redirectUri = encodeURIComponent(`${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`);
            const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=email%20profile`;
            return res.redirect(googleAuthUrl);
        }

        res.status(200).json({
            message: 'Google OAuth trigger endpoint active',
            authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
            status: 'OAuth Basics Endpoint Ready'
        });
    } catch (error) {
        res.status(500).json({ message: 'Google login trigger error', error: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    googleLogin
};