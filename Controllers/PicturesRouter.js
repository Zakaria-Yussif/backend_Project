const express = require('express');
const router = express.Router();
const session = require('express-session');
const EmployeeList = require("../Modules/employeeList")
 const ProfileImgs =require("../Modules/profilePicture")


router.post('/uploadPicture', async (req, res) => {
    try {
      const { profileImg, userId, name, Email } = req.body;
  
      
  
      const findUser = await ProfileImgs.findOne({ userId });
  
      if (findUser) {
        // Update existing user's profile picture
        const updatedPic = await ProfileImgs.findOneAndUpdate(
          { userId },
          { Picture: profileImg},
          { new: true } // Return the updated document
        );
  
        return res.status(200).json({ msg: 'File updated successfully.', updatedUser: updatedPic });
      }
  
      // Create a new user with the profile picture
      await ProfileImgs.create({
        userId: userId,
        Email: Email,
        name: name,
        Picture: profileImg,
      });
  
      res.status(200).json({ msg: 'File uploaded successfully.' });
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      res.status(500).json({ msg: 'Internal server error.' });
    }
  });
  
  router.get("/getAllPictures", async (req, res) => {
    try {
      const findAllPictures = await ProfileImgs.find({}); // Use the find method to retrieve all records
  
      res.status(200).json({ msg: "Pictures available",  findAllPictures });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  router.post('/getProfilePicture', async (req, res) => {
    const { userId } = req.body;
    console.log(userId)
  
    if (!userId) {
      res.status(400).json({ msg: 'Invalid or missing user ID.' });
    } else {
      try {
        const profilePicture = await ProfileImgs.findOne({userId});
      // console.log(profilePicture)
  
        if (!profilePicture) {
          res.status(404).json({ msg: 'Profile picture not found.' });
        } else {
          res.status(200).json({ msg: 'Profile picture found.', profilePicture})
        }
      } catch (error) {
        console.error('Error retrieving profile picture:', error);
        res.status(500).json({ msg: 'Internal server error.' });
      }
    }
  });
  
  
module.exports =router;