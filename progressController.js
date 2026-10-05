import User from '../models/User.js';
import Submission from '../models/Submission.js';
import Progress from '../models/Progress.js';
export async function dashboard(req,res){
 const user=await User.findById(req.user._id).select('-password');
 const progress=await Progress.findOne({userId:user._id});
 const submissions=await Submission.find({userId:user._id}).sort({createdAt:-1}).limit(10);
 res.json({user,progress,submissions});
}
export async function knowledge(req,res){
 const progress=await Progress.findOne({userId:req.user._id});
 const submissions=await Submission.find({userId:req.user._id}).sort({createdAt:-1}).limit(50);
 const counts={}; submissions.forEach(s=>(s.detectedConcepts||[]).forEach(c=>counts[c]=(counts[c]||0)+1));
 res.json({progress,conceptFrequency:counts});
}
