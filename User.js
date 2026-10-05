import mongoose from 'mongoose';
const masterySchema=new mongoose.Schema({variables:{type:Number,default:0},loops:{type:Number,default:0},functions:{type:Number,default:0},pointers:{type:Number,default:0},recursion:{type:Number,default:0}},{_id:false});
const userSchema=new mongoose.Schema({name:{type:String,required:true,trim:true},email:{type:String,required:true,unique:true,lowercase:true,trim:true},password:{type:String,required:true},xp:{type:Number,default:0},level:{type:Number,default:1},streak:{type:Number,default:0},mastery:{type:masterySchema,default:()=>({})}},{timestamps:true});
export default mongoose.model('User',userSchema);
