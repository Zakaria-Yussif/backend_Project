const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const SignUp = require('../Modules/signUp'); // Assuming you have a SignUp model

const saltRounds = 10; // Number of salt rounds for bcrypt hashing



router.put("/updatePassword", async (req, res) => {
    const { email, newPassword } = req.body;
  
    try {
      // Find the user by email
      const user = await SignUp.findOne({ email });
  
      // Check if the user exists
      if (!user) {
        return res.status(401).json({ msg: "Email not registered" });
      } 
      
      if (newPassword== ""){
   return res.status(204).json({msg:"no password"})
  
  
   }
    
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Update the user's password in the database
      user.password = hashedPassword;
      await user.save();
  
      // You might want to send a success response
      return res.status(200).json({ msg: "Password updated successfully" });
    } catch (error) {
      // Handle any errors that might occur during the process
      console.error(error);
      return res.status(500).json({ msg: "Internal server error" });
    }
  });
  
  
    router.post("/passwordResetReqest", async (req,res)=>{
  const {email}= req.body
  let userEmail = await SignUp.findOne({email});
  if(!userEmail){
    res.status(409).json({mgs:"Email not resgistered"})
  }else{
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'zakarias.yussif@gmail.com',
          pass: 'quizcazzmqwwethj'
      }
  });

  var mailOptions = {
      from: 'zakarias.yussif@gmail.com',
      to: email,
      subject: ' Reset Password',
      html: `
      <div style="margin: 20px;">
      <h1>ConnectTeam</h1>
      <h4>Hi ${userEmail.name}</h4>
      <p>Welcome to ConnectTeam!</p>
      <p>We're excited to have you on board. Your registration was successful.</p>
      <p>Click the following button to reset your password and start exploring our services:</p>
      <a href="http://localhost:3000/resetPassword" style="display: inline-block; padding: 10px; background-color: #009E60; color: #fff; border-style: none; text-decoration: none;">
        Reset Password
      </a>
      <p>If you didn't request this, please ignore this email. Your account is secure.</p>
      <img src="https://media.istockphoto.com/id/495341926/photo/talking-to-partner.jpg?s=612x612&w=0&k=20&c=4E5iGa4QqN6kwZNlfhbfU0xE5UavxAcNC0uqc5TgSXE=" style="display: inline-block; margin-top: 20px; height: 200px; width: 420px;" />
      <p>Thank you for choosing ConnectTeam!</p>

      <div style="font-size: 15px; display: flex; flex-direction: row; margin: 20px;">
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
          console.log(error);
      } else {
          console.log('Email sent: ' + info.response);
          res.send({ msg: "Welcome to Minster cleaning services" });
      }
  });
  }

    })



    module.exports = router;