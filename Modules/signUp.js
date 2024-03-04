const mongoose = require("mongoose")


const SignUpSchema= new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    // confirmPass:String,
    
   
});


const SignUp = new mongoose.model("SignUp", SignUpSchema);

module.exports=SignUp;