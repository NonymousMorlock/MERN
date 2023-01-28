const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        required: true,
        type: String,
        trim: true,
    },
    verified: {
        required: true,
        type: Boolean,
        default: false,
    },
    email: {
        required: true,
        type: String,
        trim: true,
        validate: {
            validator: function (value) {
                const re = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                return value.match(re);
            },
            message: "Invalid email address",
        },
    },
    password: {
        required: true,
        type: String,
        trim: true,
        validate: {
            validator: (value) => {
                let count = 0
                count += value.length >= 8 ? 1 : 0;
                count+= /\d/.test(value) ? 1 : 0;
                count+= /[A-Z]/.test(value) ? 1 : 0;
                count+= /[a-z]/.test(value) ? 1 : 0;
                count+= /[@$!%*?&]/.test(value) ? 1 : 0;
                
                return count >= 5;
            },
            message:
                "Password must be at least 8 characters long, contain at least one number, one uppercase letter, one lowercase letter, and one special character",
        },
    },
    address: {
        type: String,
        default: "",
    },
    type: {
        type: String,
        default: "user",
    },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
