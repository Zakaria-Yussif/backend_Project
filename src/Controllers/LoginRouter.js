

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import jwt module

const SignUp = require('../Modules/signUp'); // Assuming you have a SignUp model
require('dotenv').config();
const saltRounds = 10;


// Define the route handler using the router object
router.post('/login', async (req, res) => {
    const { password, email } = req.body;
    try {
        const user = await SignUp.findOne({ email });
        if (!user) {
            return res.status(401).json({ msg: "Invalid email" });
        }
        
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ msg: "Invalid password" });
        }
        
        const token = jwt.sign({
            userId: user._id,
            email: user.email,
            name: user.name
        }, process.env.ACCESS_TOKEN_SECRETE, { expiresIn: '1h' }); // Adjust expiration time as needed
        
        res.json({ token });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Server error" });
    }
});





module.exports = router;
