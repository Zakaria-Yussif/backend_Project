const mongoose= require("mongoose");
require("dotenv").config()
 const URL = process.env.Mongodb_URL

main().then(()=>console.log("Data succefully retrieved")).catch(err => console.log(err));

async function main() {
  await mongoose.connect(URL);

}


module.exports= main;