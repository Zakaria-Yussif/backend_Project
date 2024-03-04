const express = require('express')
const mongoose = require('mongoose');
const connection = require('./connection')
const passport = require('passport');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

// const Movie = require('./Modules/movie')
 const Login = require('./Modules/login')
 const EmployeeList = require("./Modules/employeeList")
 const ProfileImgs = require("./Modules/profilePicture")
 const Task= require("./Modules/task")

 const SignUp = require('./Modules/signUp')
const auth = require("./Middleware/auth")
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
 const saltRounds = 10;
var nodemailer = require('nodemailer');
const WebSocket = require('ws');






const app = express()
let port = 9000;
let port1=8700;
let port2= 9700;

app.use(express.json())
app.use(express.static("public"))
app.use(cors())
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
app.use(bodyParser.json({limit: '50mb', parameterLimit:50000})); 
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit:50000}));
app.use(session({
  secret: 'your-secret-key', // Change this to a strong, random string
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

const wss = new WebSocket.Server({ port: 9700 })





app.get('/',  authenticateToken ,async (req, res) => {
    
    res.send('Movie Date created')
  })



app.post('/signUp', async (req, res) => {
  try {
      const { name, email, password} = req.body; // Include password field
   console.log(password)
      let findEmail = await SignUp.findOne({ email });
      
      if (findEmail) {
       return res.status(409).json({ msg1: "Email already exists" });
        
        console.log("email exist")
      }

      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create the user only if the email does not exist
      await SignUp.create({
          name: name,
          email: email,
          password: hashedPassword,
      });

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
          subject: '  ConnectTeam ',
          html: `
          <div>
            <h1>ConnectTeam</h1>
            <h4>Hi ${name}</h4>
            <p>Welcome to ConnectTeam!</p>
            <p>We're excited to have you on board. Your registration was successful.</p>
            <p>Please click the following button to Confirm your Account and start exploring our services:</p>
            <a href="http://localhost:3000/login" style="display: inline-block; padding: 3px; background-color: #009E60; color: #fff; border-style: none; height: 25px; text-decoration: none; width: 130px;">
              
               Confirm Account
              
            </a>
            <p></p>
            <img src="https://media.istockphoto.com/id/495341926/photo/talking-to-partner.jpg?s=612x612&w=0&k=20&c=4E5iGa4QqN6kwZNlfhbfU0xE5UavxAcNC0uqc5TgSXE=" style="display: inline-block; margin-top: 20px; height: 200px; width: 420px;" />
            <p>Thank you for choosing ConnectTeam!</p>
            
      
            <div style=" font-size: 15px; dispaly:flex; flex-direction:row; margin:20;">
            <h5>Follow ConnectTeam:</h5>
  
              <img src="https://1.bp.blogspot.com/-S8HTBQqmfcs/XN0ACIRD9PI/AAAAAAAAAlo/FLhccuLdMfIFLhocRjWqsr9cVGdTN_8sgCPcBGAYYCw/s1600/f_logo_RGB-Blue_1024.png" alt="Facebook" style="margin-right: 10px; width:30px; height:30px;" />
              <img src="http://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram" style="margin-right: 10px; width:30px; height:30px;" />
              <img src="https://tse2.mm.bing.net/th?id=OIP.PXTov9TveYX3Upu592UOygHaHa&pid=Api&P=0&h=220" alt="Twitter" style="margin-right: 10px; width:30px; height:30px;"/>
            </div>
            <b style=" color:grey; font-family: 10px 'Crimson Pro', serif; opacity: 0.3;">@copyRight||ConnectBusiness.com</b>
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

  } catch (error) {
      console.error("Error during user registration:", error);
      res.status(500).send("Server error, please try again later");
  }
});


app.post('/login',  async (req, res) => {
  
  
  
  const { password, email } = req.body;
  let findEmail = await SignUp.findOne({ email });


  if (!findEmail) {
    res.send({ msg: "Invalid Email" });
    return;
  }
  

  let storedHashedPassword = findEmail.password;
  console.log(storedHashedPassword);
 console.log(password)
  const validatePass = await bcrypt.compare(password.trim(), storedHashedPassword.trim());
  console.log(validatePass);

  if (!validatePass) {
    res.send({ msg: "Invalid Password" });
    return;
  }

 
 


  let token = jwt.sign({
    userId: findEmail._id,
    findEmail: findEmail.email,
    findName:findEmail.name
  }, process.env.ACCESS_TOKEN_SECRETE);

  res.json({ token });
  
  
});

const adminUser = [
  { id: 1, email: "zackyoung31@gmail.com", isAdmin:false},
  {id:2, email: "zackyaroo31@gmail.com", isAdmin:false},
  
];

app.post("/admin", (req, res) => {
  const { email } = req.body;

  // Check if the user is an admin
  const isAdmin = adminUser.some(user => user.email === email);

  if (isAdmin) {
    // Set a session variable to mark the user as authenticated
    req.session.isAdmin = true;
console.log(req.session.isAdmin)
    return res.status(200).json({ msg: "Welcome to AdminPage" });
  } else {
    return res.status(401).json({ msg: "Unauthorized user" });
  }
});

// Example route that requires admin authentication
app.get("/adminAcc", (req, res) => {
  // Check if the user is an admin based on the session variable
  if (req.session.isAdmin ==true) {
    return res.status(200).json({ msg: "Admin-only content" });
    
  } else {
    return res.status(401).json({ msg: "Unauthorized access" });
  }
});


  

app.post('/employeeList', async (req, res) => {
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

app.get("/getEmployeeList", async (req, res) => {
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

app.post("/employeeUpdates", async (req, res) => {
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


app.post("/deleteEmployeeInfo", async (req, res) => {
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


  

  app.get("/getE",  async (req, res) => {
    try {
      const bookId = userId;
      const book = await Book.findById(bookId); 
       res.send("book")// Retrieve by ID
      console.log(book);
    } catch (error) {
      console.error("Error:", error);
    }
    
      
  });
  
  app.put("/updatePassword", async (req, res) => {
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
  
  
    app.post("/passwordResetReqest", async (req,res)=>{
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
  
  
  
    
    
    
    
    // Passport local strategy for username/password authentication
    passport.use(new LocalStrategy(
      (email, password, done) => {
        const user = users.find(u => u.email === email);
    
        if (!user) {
          return done(null, false, { message: 'Incorrect username or password.' });
        }
    
        // Compare passwords (replace with actual password hashing logic)
        if (user.password === password) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect username or password.' });
        }
      }
    ));
    // Serialize user to store in the session
    passport.serializeUser((user, done) => {
      done(null, user.id);
    });
    
    // Deserialize user from the session
    passport.deserializeUser((id, done) => {
      const user = users.find(u => u.id === id);
      done(null, user);
    });
    
    // Routes
    app.get('/', (req, res) => {
      res.send('Welcome to the home page!');
    });
    
    // Authentication route
    app.post('/login',
      passport.authenticate('local', {
        successRedirect: '/adminAcc',
        failureRedirect: '/',
        failureFlash: true
      })
    );
    
    // Admin route (protected)
    app.get('/admin', isAuthenticated, (req, res) => {
      res.send('Welcome to the admin page!');
    });
    
    // Logout route
    app.get('/logout', (req, res) => {
      req.logout();
      res.redirect('/');
    });
    
    // Middleware to check if the user is authenticated
    function isAuthenticated(req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      } else {
        res.redirect('/');
      }
    }
    
    // Start the server
   
  

  function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).send({ msg: "Missing Authorization header" });
    }

    const authParts = authHeader.split(' ');
    if (authParts.length !== 2 || authParts[0] !== 'Bearer') {
        return res.status(401).send({ msg: "Invalid Authorization header format" });
    }

    let token = authParts[1];

    try {
        const verifiedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = verifiedToken; // Attach the verified token data to the request

        console.log(verifiedToken, "token"); // Log the verified token data
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(401).send({ msg: "Invalid token" });
    }
}
  
const io = new Server(server, {
  cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
  }
});

const connectedUsers = {};

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  // Event handler for setting userId
  socket.on('setUserId', (userId) => {
    // Store the userId along with the socket connection
    connectedUsers[userId] = socket.id; 
    console.log("User connected with userId:", userId);
    
    socket.emit('connectedWithId', userId);
  });

  // Event handler for disconnection
  socket.on('disconnect', () => {
    for (const [key, value] of Object.entries(connectedUsers)) {
      if (value === socket.id) {
        delete connectedUsers[key];
        console.log("User disconnected with userId:", key);
        io.emit("callEnd"); // Inform all clients about the call ending
        break;
      }
    }
  });

  // Event handler for sending messages
  socket.on("send_message", (data) => {
    socket.broadcast.emit("received_message", data);
  });

  // Event handler for callUser
  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name });
  });

  // Event handler for answerCall
  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });

  // Emitting the socket ID to the client
  socket.emit("me", socket.id);

  // Function to check if a user is online
  socket.on("checkOnlineStatus", (id, callback) => {
    const isOnline = connectedUsers.hasOwnProperty(id);
    callback({ userId: id, isOnline });
    console.log("onlineStatus", { userId: id, isOnline });
  });
});

// Example usage

// console.log(`User with ID ${userIdToCheck} is ${isUserOnline(userIdToCheck) ? 'online' : 'offline'}`);



  
  const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, profileImg, cb) {
        cb(null, profileImg.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Import your Mongoose ProfileImgs model

app.post('/uploadPicture', async (req, res) => {
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

app.get("/getAllPictures", async (req, res) => {
  try {
    const findAllPictures = await ProfileImgs.find({}); // Use the find method to retrieve all records

    res.status(200).json({ msg: "Pictures available",  findAllPictures });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.post('/getProfilePicture', async (req, res) => {
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

const uploadFile = multer({
  dest: 'uploads/',
  limits: { fileSize: 1024 * 1024 * 10 } // 10 MB limit
});


app.post('/task', uploadFile.single('File'), async (req, res) => {
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



app.get("/getAllTask", async (req, res) => {
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

app.post("/deleteEmployeeTask", async (req, res) => {
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


app.post("/getAllTaskAsigned", async (req, res) => {
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





server.listen(port1, () => {
    console.log('listening on *:8700');
  });

  app.listen(port, () => {
    console.log(`Server is running and accessible from other devices on the same network at http://YOUR_LOCAL_IP:${port}`);
    console.log('Server is listening to port ' + port2)
  });

