import jwt from 'jsonwebtoken';
import User from '../models/User.js';
export async function protect(req,res,next){
  try{
    const header=req.headers.authorization||'';
    const token=header.startsWith('Bearer ')?header.slice(7):null;
    if(!token) return res.status(401).json({message:'Authentication required'});
    const payload=jwt.verify(token,process.env.JWT_SECRET);
    req.user=await User.findById(payload.id).select('-password');
    if(!req.user) return res.status(401).json({message:'User not found'});
    next();
  }catch(e){return res.status(401).json({message:'Invalid or expired token'});}
}
