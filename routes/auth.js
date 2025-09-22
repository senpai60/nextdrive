const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const isAuthenticated = require('../middlewares/auth');
const User = require('../models/user');
const { get } = require('mongoose');

// Helper function to check if user is logged in
function getAuthStatus(req) {
    return req.user ? true : false;
}

// Render signup page
router.get('/signup', (req, res) => {
    res.render('pages/signup', { err: null, authenticated: getAuthStatus(req) });
});

// Create user and set JWT token in cookie
router.post('/createuser', async (req, res) => {
    try {
        const { firstName, lastName, email, password, confirmpassword, terms } = req.body;

        if (!firstName || !lastName || !email || !password || !confirmpassword) {
            return res.render('pages/signup', { err: 'Please fill all the details', authenticated: getAuthStatus(req) });
        }

        if (password !== confirmpassword) {
            return res.render('pages/signup', { err: 'Passwords do not match', authenticated: getAuthStatus(req) });
        }

        if (!terms) {
            return res.render('pages/signup', { err: 'Please accept the terms and conditions', authenticated: getAuthStatus(req) });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('pages/signup', { err: 'Email already registered', authenticated: getAuthStatus(req) });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashPassword
        });

        const token = jwt.sign(
            { id: newUser._id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Set JWT in HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            maxAge: 3600000 // 1 hour
        });

        res.redirect('/'); // Redirect to dashboard or home

    } catch (err) {
        console.log(err);
        res.render('pages/signup', { err: 'Something went wrong. Try again.', authenticated: getAuthStatus(req) });
    }
});

// Render login page
router.get('/login', (req, res) => {
    res.render('pages/login', { err: null, authenticated: getAuthStatus(req) });
});

// Handle login
router.post('/requestlogin', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.render("pages/login", { err: 'Please check email or password!', authenticated: getAuthStatus(req) });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) return res.render("pages/login", { err: 'Please check email or password!', authenticated: getAuthStatus(req) });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.render("pages/login", { err: 'Please check email or password!', authenticated: getAuthStatus(req) });

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Set JWT in cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000
        });

        res.redirect('/'); // Redirect to protected page

    } catch (err) {
        console.log(err);
        res.render("pages/login", { err: 'Something went wrong. Try again.', authenticated: getAuthStatus(req) });
    }
});

// Logout route (protected)
router.get('/logout', isAuthenticated, (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
        
        
    });
    console.log(`the login status is:${getAuthStatus(req)}`);
    res.redirect('/');
});

module.exports = router;
