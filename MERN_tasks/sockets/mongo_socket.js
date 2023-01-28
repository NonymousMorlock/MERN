const express = require('express');
const socketio = require('socket.io');
const mongodb = require('mongodb');

// check the mongoose socket before this one, coz I'll skip some comments here that I already made there
const app = express();

mongodb.MongoClient.connect('db/connection/link', (err, client) => {
    if (err) {
        console.log('Error connecting to MongoDB: ' + err);
        return;
    }

    // get your database ref
    const db = client.db('mydb');

    const server = app.listen(3000, () => {
        console.log('Server started on port 3000');
    });

    const io = socketio(server);

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

    socket.on('message', (msg) => {
        console.log(`Received message: ${msg}`);

            // Insert the message into the MongoDB database
            db.collection('messages').insertOne({ message: msg }, (err, _) => {
                if (err) {
                    console.log(`Error inserting message into DB: ${err}`);
                } else {
                    console.log('Message inserted into DB');
                }
            });
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
});
