const JWT = require("jsonwebtoken");
const JWT_SECRET = 'jisD3V';

 const generateToken = (userId)=>{
try{
return JWT.sign({userId:userId},JWT_SECRET,{expiresIn:"5d"});
}catch(err){
    console.error('Error occured in token generating in jwt',err)
}
}

 const verifyToken = (token) => {
    try {
      return JWT.verify(token, JWT_SECRET);
    } catch (err) {
        console.error('Error occured in token verifying in jwt',err)
      return null;
    }
  };
  module.exports = {
    generateToken,
    verifyToken
};