const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/UserModel');

const getDefaultAvatar = (name) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=e50914&color=fff&bold=true`;
};

// Configure Google Strategy
const clientId = process.env.GOOGLE_CLIENT_ID || 'your-google-client-id.apps.googleusercontent.com';
const clientSecret = process.env.GOOGLE_CLIENT_SECRET || 'your-google-client-secret';
const callbackURL = process.env.GOOGLE_CALLBACK_URL || 
    `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`;

try {
    passport.use(
        new GoogleStrategy(
            {
                clientID: clientId,
                clientSecret: clientSecret,
                callbackURL: callbackURL
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const email = profile.emails && profile.emails[0] ? profile.emails[0].value.toLowerCase() : null;
                    const displayName = profile.displayName || email?.split('@')[0] || 'User';
                    const avatar = (profile.photos && profile.photos[0] && profile.photos[0].value) 
                        ? profile.photos[0].value 
                        : getDefaultAvatar(displayName);
                    
                    if (!email) {
                        return done(new Error('No email found in Google profile'), null);
                    }

                    // Find user by googleId or email
                    let user = await User.findOne({ 
                        $or: [{ googleId: profile.id }, { email }] 
                    });

                    if (user) {
                        let updated = false;
                        if (!user.googleId) {
                            user.googleId = profile.id;
                            updated = true;
                        }
                        if (!user.avatar) {
                            user.avatar = avatar;
                            updated = true;
                        }
                        if (updated) {
                            await user.save();
                        }
                        return done(null, user);
                    }

                    // Create new user automatically if missing
                    const role = email.includes('admin') ? 'admin' : 'user';
                    user = await User.create({
                        name: displayName,
                        email: email,
                        googleId: profile.id,
                        avatar: avatar,
                        role: role,
                        watchlist: []
                    });

                    return done(null, user);
                } catch (error) {
                    console.error('Google Auth Strategy Error:', error);
                    return done(error, null);
                }
            }
        )
    );
    console.log('Google OAuth Strategy initialized successfully');
} catch (error) {
    console.error('Error initializing Google Strategy:', error.message);
}

module.exports = passport;
