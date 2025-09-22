const express = require('express');
const router = express.Router()
const bcrypt = require('bcrypt');

const User = require('../models/user');


router.get('/signup',(req,res)=>{
    res.render('pages/signup')
})
router.post('/createuser',async(req,res)=>{
    try {
        const {firstName,lastName,email,password,confirmpassword,terms} =req.body
        if(req.body==null) {
            return res.render('pages/signup',{err:'please fill all the details'})
        }
        if (password!==confirmpassword) {
            return res.render('pages/signup',{err:'pelase match the password with confirm password'})
        }

        if (terms===null) {
            return res.render('pages/signup',{err:'pelase check the terms and condition'})
        }

        const hashPassword = await bcrypt.hash(password,10)
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password:hashPassword
        })
        console.log(newUser);
        
       await newUser.save()
       res.redirect('/')        
            
    } catch (err) {
        console.log(err);
        
    }
})

module.exports = router