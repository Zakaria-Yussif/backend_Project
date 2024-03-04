const mongoose = require("mongoose")


const profileImgSchema= new mongoose.Schema({
    userId:String,
    Email:String,
    name:String,
    Picture: String,
   
    
    
   
});


const profileImg = new mongoose.model("profileImg", profileImgSchema);

module.exports=profileImg;