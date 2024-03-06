const express = require('express');
const router = express.Router();
const session = require('express-session');
const EmployeeList = require("../Modules/employeeList")
 const ProfileImgs = require("../Modules/profilePicture")


router.post('/employeeList', async (req, res) => {
    try {
      const {
        checked,
        ID,
        FirstName,
        LastName,
        Email,
        Contact,
        Contract,
        Position,
        
      } = req.body;
     
      let findPicture= await ProfileImgs.findOne({Email})
      // console.log(findPicture)
      const profilePicture = findPicture ? findPicture.Picture : null;
      // Create a new employee entry using the EmployeeList model
      const newEmployee = await EmployeeList.create({
       
        ID,
        FirstName,
        LastName,
        Email,
        Contact,
        Contract,
        Position,
        Picture: profilePicture,
      });
  
      console.log('Data created:', newEmployee);
      res.status(200).json({ message: 'Data created', newEmployee });
    } catch (error) {
      console.error('Error creating data:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  router.get("/getEmployeeList", async (req, res) => {
    try {
      const allEmployeeList = await EmployeeList.find({});
       const EmployeeInfo=[]
       console.log(EmployeeInfo)
      if (allEmployeeList.length === 0) {
        console.log("No new data");
        return res.status(201).json({ mgs: 'No new data' });
      }
      const arrayWithDuplicates = allEmployeeList;
  const uniqueArray = arrayWithDuplicates.filter((value, index, self) => self.indexOf(value) === index);
  
      console.log(uniqueArray)
      return res.status(200).json({mgs:"uniqueArray",uniqueArray})
      
      
      
    } catch (error) {
      console.error('Error fetching employees:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  router.post("/employeeUpdates", async (req, res) => {
    try {
      const {
        checked,
        _id,
        FirstName,
        LastName,
        Email,
        Contact,
        Contract,
        Position,
        Picture,
      } = req.body;
  
      // Validate the incoming data
      if (!_id || typeof _id !== "string") {
        return res.status(400).json({ error: "Invalid or missing ID in the request." });
      }
  
      // Assuming EmployeeList is a valid MongoDB collection
      const existingEmployee = await EmployeeList.findOne({ _id });
  
      if (!existingEmployee) {
        return res.status(404).json({ error: "Employee not found." });
      }
  
      // Implement your update logic here
      const updatedEmployee = await EmployeeList.findOneAndUpdate(
        { _id },
        {
          FirstName,
          LastName,
          Email,
          Contact,
          Contract,
          Position,
          Picture,
        },
        { new: true } // Return the updated document
      );
  
      res.status(200).json({ msg: "Employee data updated successfully.", data: updatedEmployee });
      console.log(updatedEmployee)
    } catch (error) {
      console.error("Error in /employeeUpdates route:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  });
  
  
  router.post("/deleteEmployeeInfo", async (req, res) => {
    const { _id } = req.body;
    console.log(_id);
  
    if (!_id || typeof _id !== "string") {
      return res.status(400).json({ error: "Invalid or missing ID in the request." });
    }
  
    // Use findOne to find the employee by ID
    const findID = await EmployeeList.findOne({ _id });
  
    if (!findID) {
      return res.status(404).json({ error: "Employee not found." });
    }
  
    // Remove the employee from the database
    await EmployeeList.deleteOne({ _id });
  
    // Respond with a JSON object containing a message and the deleted employee information
    res.status(200).json({ msg: "Employee Deleted Successfully.", findID });
  
    // Log the deleted employee information
  });
  
  module.exports = router;
  