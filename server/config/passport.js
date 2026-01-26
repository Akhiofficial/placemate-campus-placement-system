const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback",
    passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
            // Prevent admins from logging in via Google
            if (user.role === 'admin' || user.role === 'superadmin') {
                return done(null, false, { message: 'Admins cannot login via Google' });
            }
            return done(null, user);
        }

        // Check if user exists by email
        const email = profile.emails[0].value;
        user = await User.findOne({ email });

        if (user) {
            // Prevent admins from linking Google account
            if (user.role === 'admin' || user.role === 'superadmin') {
                return done(null, false, { message: 'Admins cannot link Google account' });
            }
            // Link account
            user.googleId = profile.id;
            if (!user.profileImage) user.profileImage = profile.photos[0]?.value;
            await user.save();
            return done(null, user);
        }

        // Create new user
        // Securely get role from state
        let role = req.query.state;
        if (role !== 'student' && role !== 'company') {
            role = 'student'; // Default to student if invalid or restricted role
        }

        user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: email,
            profileImage: profile.photos[0]?.value,
            role: role,
            password: 'google-oauth-login' // Dummy password, though schema allows empty if googleId present, but just in case
        });

        await user.save();

        done(null, user);
    } catch (err) {
        console.error("Google Auth Error:", err);
        done(err, null);
    }
}));

module.exports = passport;
