 
 const jwt =require("jsonwebtoken")
require("dotenv").config()
 
// const verifyToken= (req, res, next)=>{
//     const authHeader = req.header['authorization']
//     let token = authHeader && authHeader.split("")[1];
//   console.log(token)
// if(!token){
//  res.status(401).send({msg:"not authourized"})
//  }
//  let verifiedToken =jwt.verify(token,process.env.ACCESS_TOKEN)
// console.log("token",verifiedToken)
// if(!verifiedToken){
//   res.send({msg:"invalid Token"})
// } 
// req.findEmail= verifiedToke
//     let token =req.headers.authorization.split;
//     // console.log(token)
//     // if(!token){
//     //     res.status(401).send({msg:"not authourized"})
//     // }
//     // let verifiedToken =jwt.verify(token,process.env.ACCESS_TOKEN)
//     // console.log("token",verifiedToken)
//     // if(!verifiedToken){
//     //     res.send({msg:"invalid Token"})
//     // } 
//     // req.findEmail= verifiedToken
//  





//  module.exports = verifyToken;