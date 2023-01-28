const express = require("express");
const mongoose = require("mongoose");

const authRouter = require("./auth/routes/auth.signup"); // for signing up and saving user to db

const verify = require('./routes/email_verification'); // for email verifikay ;)

const PORT = 3000;
const app = express();
const DB =
    "DB/connection/link";

app.use(express.json())
app.use(authRouter);
app.use('/', verify);

mongoose.connect(DB, { useNewUrlParser: true }).then(function() {
    console.log("Connection Successful");
}).catch(function(e) {
    console.log(e);
});

app.listen(PORT, "0.0.0.0", function () {
    console.log(`connected at port ${PORT}`);
});
