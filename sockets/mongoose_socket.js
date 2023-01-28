const express = require('express');
const socketio = require('socket.io');
const mongoose = require('mongoose');

// schema for the messages

const MessageSchema = new mongoose.Schema({ message: String });

// model for the messages

const Message = mongoose.model('Message', MessageSchema);

// create express
const app = express();

// Start the server and listen for incoming connections
const server = app.listen(3000, () => {
    console.log('Server started on port 3000');
});

// start socket
const io = socketio(server);

// listen for socket connections
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // then we start listening for messages
    socket.on('message', (msg) => {
        console.log(`Received message: ${msg}`);

        // we need to save the message to mongodb, so we need to create a message doc
        const message = new Message({message: msg});
        
        message.save((e) => {
            if(e) {
                console.log(`Error saving message to DB: ${e}`);
            } else {
                console.log('Message saved to DB');
            }
        });
    });

    // finally disconnections
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});



