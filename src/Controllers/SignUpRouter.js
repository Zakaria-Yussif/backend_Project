const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const SignUp = require('../Modules/signUp'); // Assuming you have a SignUp model

const saltRounds = 10; // Number of salt rounds for bcrypt hashing

// Route handler for user signup
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if the email already exists in the database
        const existingUser = await SignUp.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: "Email already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user record in the database
        await SignUp.create({
            name: name,
            email: email,
            password: hashedPassword
        });

        // Send a confirmation email to the user
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'your_email@gmail.com', // Your Gmail email
                pass: 'your_password' // Your Gmail password
            }
        });

        const mailOptions = {
            from: 'your_email@gmail.com',
            to: email,
            subject: 'Welcome to Our App',
            html: `<p>Thank you for signing up!</p>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        // Respond with a success message
        res.status(201).json({ message: "User signed up successfully" });
    } catch (error) {
        console.error("Error during user signup:", error);
        res.status(500).json({ error: "Server error, please try again later" });
    }
});

module.exports = router;
