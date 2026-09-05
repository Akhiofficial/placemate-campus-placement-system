// server/app.js
require('dotenv').config();
console.log("---------------------------------------------------");
console.log("SERVER STARTUP ENV CHECK");
console.log("OPENROUTER_API_KEY:", process.env.OPENROUTER_API_KEY ? "LOADED (Starts with " + process.env.OPENROUTER_API_KEY.substring(0, 5) + "...)" : "MISSING or UNDEFINED");
console.log("---------------------------------------------------");
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const studentRoutes = require('./routes/student');
const jobRoutes = require('./routes/jobs');
const applicationRoutes = require('./routes/applications');

const http = require('http');
const { Server } = require('socket.io');
const interviewRoutes = require('./routes/interviews');
const notificationRoutes = require('./routes/notifications');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins for dev
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.set('trust proxy', 1); // Trust first proxy (Render)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static('uploads'));

// Session Config (Required for Passport OAuth)
const session = require('express-session');
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret_key',
    resave: false,
    saveUninitialized: false
}));

const passport = require('passport');
require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes); // Dashboard & Profile
app.use('/api/jobs', jobRoutes); // Jobs
app.use('/api/applications', applicationRoutes); // Applications
app.use('/api/interviews', interviewRoutes); // Interviews
app.use('/api/notifications', notificationRoutes); // Notifications
app.use('/api/company', require('./routes/company')); // Company Dashboard
app.use('/api/ai', require('./routes/ai')); // AI Career Assistant

// Socket.io for WebRTC Signaling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).emit('user-connected', userId);
        console.log(`User ${userId} joined room ${roomId}`);

        socket.on('disconnect', () => {
            socket.to(roomId).emit('user-disconnected', userId);
        });
    });

    // Relay signals
    socket.on('offer', (data) => {
        socket.to(data.roomId).emit('offer', data);
    });

    socket.on('answer', (data) => {
        socket.to(data.roomId).emit('answer', data);
    });

    socket.on('ice-candidate', (data) => {
        socket.to(data.roomId).emit('ice-candidate', data);
    });

    // In-room chat relay
    socket.on('send-message', (data) => {
        socket.to(data.roomId).emit('receive-message', data);
    });
});




const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
