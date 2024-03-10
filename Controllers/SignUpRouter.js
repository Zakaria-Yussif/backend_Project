const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const SignUp = require('../Modules/signUp'); // Assuming you have a SignUp model
const saltRounds = 10; // Number of salt rounds for bcrypt hashing

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
                user: 'zackyaroo31@gmail.com', // Your Gmail email
                pass: 'ednn sbpo darm wnmq' // Your Gmail password
            }
        });

        const mailOptions = {
            from: 'zakarias.yussif@gmail.com',
            to: email,
            subject: 'Confirm Account',
            html: `
                <div style="margin: 20px; font-size: 20px;">
                    <h1>ConnectTeam</h1>
                    <h4>Hi ${name},</h4>
                    <p>Welcome to ConnectTeam!</p>
                    <span>You have been succefully created Account:</span>
                
                    <span>Congratulations! Your account has been successfully created. To complete the registration process and activate your account, please click the button below:</span><br></br>

<button style={{ width: "150px", height: "20px", backgroundColor: "green", color: "white" }}>Confirm Account</button><br></br>


<span>By confirming your account, you will gain access to all the features and benefits of our platform/service.<span><br></br>

<span>If you have any questions or encounter any issues, please don't hesitate to contact our support team at [Support Contact Information].<span><br></br>

<p>Thank you for choosing us. We look forward to serving you!</p>
                    <a href="http://localhost:3000/login">Please, login in your Accounts for more details.</a>
                    <img src="https://plus.unsplash.com/premium_photo-1661396653077-f0e36d12398e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fGVtcGxveWVlJTIwdGFza3xlbnwwfHwwfHx8MA%3D%3D" style="display: block; margin-top: 20px; height: 150px; width: 420px;" />
                    <p>Thank you for choosing ConnectTeam!</p>
                    <div style="font-size: 15px; display: flex; flex-direction: row; margin-top: 20px;">
                        <h5>Follow ConnectTeam:</h5>
                        <img src="https://1.bp.blogspot.com/-S8HTBQqmfcs/XN0ACIRD9PI/AAAAAAAAAlo/FLhccuLdMfIFLhocRjWqsr9cVGdTN_8sgCPcBGAYYCw/s1600/f_logo_RGB-Blue_1024.png" alt="Facebook" style="margin-right: 10px; width: 30px; height: 30px;" />
                        <img src="http://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram" style="margin-right: 10px; width: 30px; height: 30px;" />
                        <img src="https://tse2.mm.bing.net/th?id=OIP.PXTov9TveYX3Upu592UOygHaHa&pid=Api&P=0&h=220" alt="Twitter" style="margin-right: 10px; width: 30px; height: 30px;" />
                    </div>
                    <b style="color: grey; font-family: 'Crimson Pro', serif; opacity: 0.3;">@copyRight||ConnectBusiness.com</b>
                </div>
            `,
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error('Error sending email:', error);
                res.status(500).json({ error: "Error sending email" });
            } else {
                console.log('Email sent:', info.response);
                res.status(200).json({ message: "Email sent successfully" });
            }
        });
    } catch (error) {
        console.error("Error during user signup:", error);
        res.status(500).json({ error: "Server error, please try again later" });
    }
});

module.exports = router;
