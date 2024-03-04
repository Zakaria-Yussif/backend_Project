const mongoose = require("mongoose");

const EmployeeListSchema = new mongoose.Schema({

  ID: String,
  FirstName: String,
  LastName: String,
  Email: String,
  Contact: String,
  Contract: String,
  Position: String,
  Picture: String,
});

const EmployeeList = mongoose.model("EmployeeList", EmployeeListSchema);

module.exports = EmployeeList;
