// someOtherFile.js
const { verifyToken } = require('../config/jwt');
const User = require('../models/userModel');

const userProtect = async (req,res,next)=>{
    console.log('token verifying function reached');
try{
const token = req.headers.authorization;

if(!token){
    return res.status(401).json({ message: 'Authorization token is missing' });
}
const decoded = await verifyToken(token);
const userId = decoded.userId;
const user = await User.findById(userId);

if(!user){
    return res.status(401).json({error:"Invalid token"})
}

req.user = user
next();
}catch(err){
    console.error('Error verifying user token:', err);
    return res.status(401).json({ message: 'Invalid authorization token' });
}
}

module.exports = userProtect;