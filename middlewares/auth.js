const jwt = require('jsonwebtoken');

require('dotenv').config();

function isAuthenticated(req,res,next) {
    const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1]
    
     if (!token) {
        // No token found, redirect to login or send error
        return res.status(401).redirect('/auth/login'); // or res.json({ error: "Not authorized" });
    }

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (err) {
        console.log(err);
        return res.status(403).redirect('/auth/login'); // invalid token
    }
}

module.exports = isAuthenticated;