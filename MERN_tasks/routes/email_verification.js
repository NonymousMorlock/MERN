const express = require('express')
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');

const router = express.Router();


// the route you'll call in your client app to send the verification mail
router.get('/verify/:token', async (req, res) => {
    try {
        // verify token
        // the jwt_secret isn't supposed to be in your code, so, store it in an env and use the variable here
        const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);

        // find user
        const user = await User.findById(decoded.id);

        // set user's verified field to true
        user.verified = true;
        await user.save();

        // then redirect to the app
        res.redirect('your/app/success/or/whatever/they/are/supposed/to/see')
    } catch(e) {
        res.redirect('your/app/error')
    }
});

module.exports = router;