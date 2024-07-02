import jwt from "jsonwebtoken"
import dotenv from 'dotenv'
dotenv.config()

const verifyToken=(req,res,next)=>{
    const token=req.headers.authorization
    if(!token){
          return res.status(401).json({message:"No token provided"})
    }

    jwt.verify(token,process.env.JWT_SECRET,(error,decode)=>{
        const payloadToken= decode
        if(error){
            return res.status(401).json({message:"Token authentication failed"})
        }
        else{
               req.userid=payloadToken.user.id
               next()
        }
    })

}

export default verifyToken