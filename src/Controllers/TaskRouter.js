const express = require('express');
const router = express.Router();
const Task= require("../Modules/task")
const multer = require('multer');
const nodemailer = require('nodemailer');
const SignUp = require('../Modules/signUp'); 
const EmployeeList = require("../Modules/employeeList")
 const ProfileImgs = require("../Modules/profilePicture")


 const uploadFile = multer({  dest: 'uploads/',
 limits: { fileSize: 1024 * 1024 * 10 } // 10 MB limit
});


router.post('/task', uploadFile.single('File'), async (req, res) => {
 try {
   const {id, Title, Employee, Priority,File, DayTime,Message, AdminName, } = req.body;
   let Email;
   let userId;
   let Name;
    console.log( "file22",File)
   const file = req.File ? req.File.path : null;
    console.log( "file",file)
   if (typeof Message !== "string") {
     console.log(Message,  DayTime);
   }

   // Check if Employee is an array and has elements
   if (Array.isArray(Employee) && Employee.length > 0) {
     for (let i = 0; i < Employee.length; i++) {
       // Check if Employee[i] is an object with email and name properties
       if (Employee[i] && typeof Employee[i].email === "string" && typeof Employee[i].name === "string") {
         
        Email= Employee[i].email;
         userId= Employee[i].userId;
          Name= Employee[i].name
         console.log(Employee[i].userI);

         var transporter = nodemailer.createTransport({
           service: 'gmail',
           auth: {
               user: 'zakarias.yussif@gmail.com',
               pass: 'quizcazzmqwwethj'
           }
       });
     
       var mailOptions = {
           from: 'zakarias.yussif@gmail.com',
           to: Email,
           subject: ' Task Assigned',
           html: `
           <div style="margin: 20px; fontSize:20px">
           <h1>ConnectTeam</h1>
           <h4>Hi ${Name}</h4>
           <p>Welcome to ConnectTeam!</p>
           <p>Youn have been Assigned Task to work on with the following People:</p><br>
          <span > ${Employee.map(employee => employee.name).join(', ')}  </span>
           <p>You are requested to submit the task on ${DayTime}:</p>
            
           <span style="margin-top: 0px; background-color: #f2f2f288; width: 80%; min-height: 300px;">
 <h4>Note:</h4><br>
 <p style="margin-top: -10px;">${Message}<br></p>

 <p style=" color: #000000;">Yours Supervisor,</p>
      <span style="margin:-10px 0px 20px 0px">${AdminName}</span> <br>
</span>

<div></div>
           <a href="http://localhost:3000/login">Please, login in your Accounts for more datails.</a>
           <img src="https://plus.unsplash.com/premium_photo-1661396653077-f0e36d12398e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fGVtcGxveWVlJTIwdGFza3xlbnwwfHwwfHx8MA%3D%3D" style="display: inline-block; margin-top: 20px; height: 150px; width: 420px;" />
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

         
       } else {
         console.log("Invalid Employee object at index", i);
       }
     }
   }
  
   const createTask = await Task.create({
     id,
     Title,
     Employee,
     Priority,
     DayTime,
     File:file,
     Message,
     AdminName,
   });

   res.status(200).json({
     message: "Task assigned successfully",
     message1:"New Task",
     task: createTask,

   });

   
 
 } catch (error) {
   console.error(error);
   res.status(500).json({ message: "Internal server error" });
 }
});


router.get("/getAllTask", async (req, res) => {
 try {
   const allTask = await Task.find({});
    const TaskInfo=[]
    console.log(TaskInfo)
   if (allTask.length === 0) {
     console.log("No new data");
     return res.status(201).json({ mgs: 'No new data' });
   }
   const arrayWithDuplicates = allTask;
const uniqueArrayTask = arrayWithDuplicates.filter((value, index, self) => self.indexOf(value) === index);

   console.log(uniqueArrayTask)
   return res.status(200).json({mgs:"uniqueArray",uniqueArrayTask})
   
   
   
 } catch (error) {
   console.error('Error fetching employees:', error);
   res.status(500).json({ message: 'Internal Server Error' });
 }
});

router.post("/deleteEmployeeTask", async (req, res) => {
 const { _id } = req.body;
 console.log(_id);

 if (!_id || typeof _id !== "string") {
   return res.status(400).json({ error: "Invalid or missing ID in the request." });
 }

 // Use findOne to find the employee by ID
 const findID = await Task.findOne({ _id });

 if (!findID) {
   return res.status(404).json({ error: "Task not found." });
 }

 // Remove the employee from the database
 await Task.deleteOne({ _id });

 // Respond with a JSON object containing a message and the deleted employee information
 res.status(200).json({ msg: "Employee Task Successfully.", findID });

 // Log the deleted employee information
});

router.post("/getAllTaskAsigned", async (req, res) => {
 const { email } = req.body;

 try {
     const tasks = await Task.find({ 'Employee.email': email });
     console.log(tasks);

     if (tasks.length === 0) {
         // Return a response here and exit the function
         return res.status(201).json({ msg: "No Task Assigned" });
     }

     // Only reach this point if tasks.length is not 0
     res.status(200).json({ msg: "Data retrieved successfully", tasks });

 } catch (error) {
     // Handle the error and send an appropriate response
     res.status(500).json({ msg: "Server error" });
 }
});






 module.exports= router