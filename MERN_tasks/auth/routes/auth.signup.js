const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const auth = require("../middlewares/auth");

const authRouter = express.Router();

authRouter.post("/api/signup", (req, res) => {
    const { name, email, password } = req.body;
    User.findOne({ email })
        .then((existingUser) => {
            if (existingUser) {
                return res
                    .status(400)
                    .json({ msg: "A User already exists with that email" });
            }
            new User({ name, email, password })
                .save()
                .then(async (newUser) => {
                    newUser.password = await bcrypt.hash(password, 10);
                    newUser
                        .save()
                        .then((finalUserData) => {
                            res.json({ msg: "Success", user: finalUserData });
                        })
                        .catch(function (e) {
                            res.status(500).json({ error: e.messgage });
                        });
                })
                .catch((e) => res.status(500).json({ error: e.message }));
        })
        .catch((e) => {
            res.status(500).json({ error: e.message });
        });
});

/// sign in

authRouter.post("/api/signin", async (req, res) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        return res
            .status(400)
            .json({ msg: "User does not exist. Try Signing Up" });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
        return res.status(400).json({ msg: "Incorrect password." });
    }

    const token = jwt.sign({ id: existingUser._id }, "passKey");
    res.json({ token, ...existingUser._doc });

    try {
    } catch (e) {
        res.status(500).json(e.message);
    }
});

authRouter.post("/tokenIsValid", async function (req, res) {
    try {
        const token = req.header("x-auth-token");
        if (!token) return res.json(false);
        const isVerified = jwt.verify(token, "passKey");
        if (!isVerified) return res.json(false);

        const user = await User.findById(isVerified.id);
        if (!user) return res.json(false);
        res.json(true);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

authRouter.get("/", auth, async (req, res) => {
    const user = await User.findById(req.user);
    res.json({ ...user._doc, token: req.token });
});

module.exports = authRouter;
