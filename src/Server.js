const express = require('express')
const mongoose = require('mongoose');
const connection = require('./connection')
const passport = require('passport');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

const signupRouter = require('./Controllers/SignUpRouter');
const loginRouter = require('./Controllers/LoginRouter');
const adminRouter = require('./Controllers/AdminRouter'); 
const employeeRouter = require('./Controllers/EmployeeRouter');
const passwordRouter =require('./Controllers/PasswordRouter');
const picturesRouter =require('./Controllers/PicturesRouter');
const taskRouter= require('./Controllers/TaskRouter');
const handleSocketIO = require('./Controllers/SocketRouter');
// const Movie = require('./Modules/movie')
//  const Login = require('./Modules/login')
//  const EmployeeList = require("./Modules/employeeList")
//  const ProfileImgs = require("./Modules/profilePicture")
//  const Task= require("./Modules/task")

//  const SignUp = require('./Modules/signUp')
// const auth = require("./Middleware/auth")
const cors = require('cors')
// const jwt = require('jsonwebtoken')
// const bcrypt = require('bcrypt')
//  const saltRounds = 10;
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




const wss = new WebSocket.Server({ port: 9700 })
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});


app.use('/', signupRouter);
app.use('/', loginRouter);
app.use("/", adminRouter)
app.use("/", employeeRouter);
app.use("/", passwordRouter);
app.use("/", picturesRouter);
app.use("/", taskRouter);





// app.get('/',  authenticateToken ,async (req, res) => {
    
//     res.send('Movie Date created')
//   })

handleSocketIO(io);


          







  



server.listen(port1, () => {
    console.log('listening on *:8700');
  });

  app.listen(port, () => {
    console.log(`Server is running and accessible from other devices on the same network at http://YOUR_LOCAL_IP:${port}`);
    console.log('Server is listening to port ' + port2)
  });

