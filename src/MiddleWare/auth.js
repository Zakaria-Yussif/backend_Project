// Import necessary modules
const passport = require('passport');
const express = require('express');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const LocalStrategy = require('passport-local').Strategy; 
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Define Passport local strategy
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

// Initialize Express app
const app = express();

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

// Middleware to authenticate token
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

// Export the middleware function
module.exports = authenticateToken;
