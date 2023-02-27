const jwt=require('jsonwebtoken');

const verifyJWT=(req,res,next)=>{
    const authHeader=req.headers.authorization || req.headers.Authorization;
    if(!authHeader?.startsWith('Bearer ')) return res.status(401).json({success:false,data:"unauthorised access"});
     //Bearer token
    const token=authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err,decoded)=>{
            if(err) return res.status(403).json({success:false,data:"forbidden access"});   //403-forbidden(invalid token/token expired)
            req.user=decoded;
            req.user.token=token;
            next();
        }
    )
}

module.exports=verifyJWT;