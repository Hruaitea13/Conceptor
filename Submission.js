import mongoose from 'mongoose';
const submissionSchema=new mongoose.Schema({userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},problemId:{type:mongoose.Schema.Types.ObjectId,ref:'Problem'},language:String,code:String,output:String,error:String,status:{type:String,enum:['success','error'],default:'error'},exitCode:Number,detectedConcepts:[String],hintsUsed:{type:Number,default:0}},{timestamps:true});
export default mongoose.model('Submission',submissionSchema);
