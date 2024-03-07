const express = require('express');
const router = express.Router();
const session = require('express-session');

router.use(session({
    secret: 'your-secret-key', // Change this to a strong, random string
    resave: false,
    saveUninitialized: true,
  }));

const adminUser = [
    { id: 1, email: "zackyoung31@gmail.com", isAdmin:false},
    {id:2, email: "zackyaroo31@gmail.com", isAdmin:false},
    
  ];
  
  router.post("/admin", (req, res) => {
    const { email } = req.body;
   console.log( "email",email)
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
  
//   router.get("/adminAcc", (req, res) => {
//     // Check if the user is an admin based on the session variable
//     if (req.session.isAdmin ==true) {
//       return res.status(200).json({ msg: "Admin-only content" });
      
//     } else {
//       return res.status(401).json({ msg: "Unauthorized access" });
//     }
//   });
  
  
    

// Export the router
module.exports = router;