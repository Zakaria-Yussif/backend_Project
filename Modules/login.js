const mongoose = require("mongoose")


const LoginSchema= new mongoose.Schema({
    email:String,
    password:String,
    
   
});


const Login = new mongoose.model("Login", LoginSchema);

module.exports=Login;