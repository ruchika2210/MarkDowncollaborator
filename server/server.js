// Import required modules
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();  // Load environment variables

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../client/build')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// WebSocket connection
io.on('connection', (socket) => {
    console.log('New client connected');

    // Broadcast drawing data to other clients
    socket.on('drawing', (data) => {
        socket.broadcast.emit('drawing', data);
    });

    // Clear canvas event
    socket.on('clearCanvas', () => {
        socket.broadcast.emit('clearCanvas');
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Serve the React application
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
