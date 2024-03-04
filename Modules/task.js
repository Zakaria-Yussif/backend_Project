const mongoose = require("mongoose")


const TaskSchema= new mongoose.Schema({
    AdminName:String,
    Title: String,
    id:String,
    Employee: [
        {
          name: String,
          userId: String,
          Picture:String,
          email:String,
        }
      ],
    Priority: String,
    DayTime:String,
    File:[String],
    Message:String,
   
    
    
   
});


const Task = new mongoose.model("Task", TaskSchema);

module.exports=Task;