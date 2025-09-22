const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models/user');

// Render signup page
router.get('/signup', (req, res) => {
    res.render('pages/signup',{err:null});
});

// Create user and set JWT token in cookie
router.post('/createuser', async (req, res) => {
    try {
        const { firstName, lastName, email, password, confirmpassword, terms } = req.body;

        // Check required fields
        if (!firstName || !lastName || !email || !password || !confirmpassword) {
            return res.render('pages/signup', { err: 'Please fill all the details' });
        }

        // Password match check
        if (password !== confirmpassword) {
            return res.render('pages/signup', { err: 'Passwords do not match' });
        }

        // Terms acceptance
        if (!terms) {
            return res.render('pages/signup', { err: 'Please accept the terms and conditions' });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('pages/signup', { err: 'Email already registered' });
        }

        // Hash password
        const hashPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashPassword
        });

        // Create JWT token
        const token = jwt.sign(
            { id: newUser._id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Send token in HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // only send cookie over HTTPS in production
            maxAge: 3600000 // 1 hour
        });

        // Redirect or render success page
        res.redirect('/'); // or res.render('pages/dashboard') if you have one

    } catch (err) {
        console.log(err);
        res.render('pages/signup', { err: 'Something went wrong. Try again.' });
    }
});

router.get('/login', (req, res) => {
    res.render('pages/login',{err:null});
});

router.post('/requestlogin',async(req,res)=>{
    const{email,password} = req.body
    if(!email || !password) return res.render("pages/login",{err:'Please check email or password!'})
    
    try {
        const user =await User.findOne({email})
        if(!user) return res.render("pages/login",{err:'Please check email or password!'})
        const hashPassword = await bcrypt.compare(password,user.password)
        if(!hashPassword) return res.render("pages/login",{err:'Please check email or password!'})
        
        res.redirect('/')    
    } catch (err) {
        
    }        
})

module.exports = router;
