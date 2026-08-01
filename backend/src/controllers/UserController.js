const User = require('../models/UserModel');

// GET /api/users/watchlist - Get logged in user's watchlist
const getWatchlist = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('watchlist');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user.watchlist || []);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching watchlist', error: error.message });
    }
};

// POST /api/users/watchlist/toggle/:movieId - Toggle movie in user's watchlist
const toggleWatchlist = async (req, res) => {
    try {
        const { movieId } = req.params;
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const index = user.watchlist.findIndex(id => id.toString() === movieId);
        if (index > -1) {
            user.watchlist.splice(index, 1);
        } else {
            user.watchlist.push(movieId);
        }

        await user.save();
        const updatedUser = await User.findById(req.user.id).populate('watchlist');
        res.status(200).json({
            message: index > -1 ? 'Removed from watchlist' : 'Added to watchlist',
            watchlist: updatedUser.watchlist
        });
    } catch (error) {
        res.status(500).json({ message: 'Error toggling watchlist', error: error.message });
    }
};

// POST /api/users/watchlist/:movieId - Add movie to user's watchlist
const addToWatchlist = async (req, res) => {
    try {
        const { movieId } = req.params;
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.watchlist.includes(movieId)) {
            user.watchlist.push(movieId);
            await user.save();
        }

        const updatedUser = await User.findById(req.user.id).populate('watchlist');
        res.status(200).json(updatedUser.watchlist);
    } catch (error) {
        res.status(500).json({ message: 'Error adding to watchlist', error: error.message });
    }
};

// DELETE /api/users/watchlist/:movieId - Remove movie from user's watchlist
const removeFromWatchlist = async (req, res) => {
    try {
        const { movieId } = req.params;
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.watchlist = user.watchlist.filter(id => id.toString() !== movieId);
        await user.save();

        const updatedUser = await User.findById(req.user.id).populate('watchlist');
        res.status(200).json(updatedUser.watchlist);
    } catch (error) {
        res.status(500).json({ message: 'Error removing from watchlist', error: error.message });
    }
};

// GET /api/users - Admin: List all registered users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users list', error: error.message });
    }
};

// PUT /api/users/:id/role - Admin: Update user role (user/admin)
const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role specified' });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User role updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user role', error: error.message });
    }
};

// DELETE /api/users/:id - Admin: Delete user
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};

module.exports = {
    getWatchlist,
    toggleWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    getAllUsers,
    updateUserRole,
    deleteUser
};
