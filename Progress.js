import mongoose from 'mongoose';
const progressSchema=new mongoose.Schema({userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,unique:true},concepts:{type:Map,of:Number,default:{variables:0,loops:0,functions:0,pointers:0,recursion:0,null_safety:0,syntax:0}},recentConcepts:[String],totalRuns:{type:Number,default:0},successfulRuns:{type:Number,default:0},hintsUsed:{type:Number,default:0}},{timestamps:true});
export default mongoose.model('Progress',progressSchema);
