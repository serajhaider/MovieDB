const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

// Generate JWT token helper
const generateToken = (user) => {
    return jwt.sign(
        { 
            id: user._id, 
            email: user.email, 
            name: user.name, 
            role: user.role,
            avatar: user.avatar || ''
        },
        process.env.JWT_SECRET || 'secretkey',
        { expiresIn: '7d' }
    );
};

// Helper for default user avatar
const getDefaultAvatar = (name) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=e50914&color=fff&bold=true`;
};

// Register new user
const registerUser = async (req, res) => {
    try {
        const { name, first_name, last_name, email, password, avatar } = req.body;

        const fullName = (name || `${first_name || ''} ${last_name || ''}`).trim();

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const role = normalizedEmail.includes('admin') ? 'admin' : 'user';
        const hashedPassword = await bcrypt.hash(password, 10);
        const userAvatar = avatar || getDefaultAvatar(fullName);
        
        const newUser = await User.create({
            name: fullName,
            email: normalizedEmail,
            password: hashedPassword,
            avatar: userAvatar,
            role,
            watchlist: []
        });

        const token = generateToken(newUser);

        const userResponse = {
            _id: newUser._id,
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            avatar: newUser.avatar,
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

        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        if (!user.password && user.googleId) {
            return res.status(400).json({ message: 'This account uses Google Sign-In. Please sign in with Google.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Set default avatar if user doesn't have one
        if (!user.avatar) {
            user.avatar = getDefaultAvatar(user.name);
            await user.save();
        }

        const token = generateToken(user);

        const userResponse = {
            _id: user._id,
            id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
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

        if (!user.avatar) {
            user.avatar = getDefaultAvatar(user.name);
            await user.save();
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user profile', error: error.message });
    }
};

// Update profile information (Name, Avatar)
const updateProfile = async (req, res) => {
    try {
        const { name, avatar } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (name && name.trim()) user.name = name.trim();
        if (avatar !== undefined) user.avatar = avatar || getDefaultAvatar(user.name);

        await user.save();

        const updatedUser = {
            _id: user._id,
            id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
            watchlist: user.watchlist
        };

        res.status(200).json({
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};

// Google OAuth Trigger endpoint
const googleLogin = (req, res, next) => {
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
};

// Google OAuth Callback endpoint
const googleCallback = (req, res, next) => {
    passport.authenticate('google', { session: false }, (err, user) => {
        const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
        
        if (err || !user) {
            console.error('Google Auth Error:', err);
            return res.redirect(`${frontendUrl}/login?error=Google%20Authentication%20Failed`);
        }

        const token = generateToken(user);
        const targetPath = user.role === 'admin' ? '/admin' : '/';
        res.redirect(`${frontendUrl}${targetPath}?token=${token}`);
    })(req, res, next);
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    updateProfile,
    googleLogin,
    googleCallback
};