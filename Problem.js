import mongoose from 'mongoose';
const problemSchema=new mongoose.Schema({slug:{type:String,unique:true},title:String,description:String,difficulty:{type:String,enum:['Easy','Medium','Hard'],default:'Easy'},language:{type:String,default:'python'},starterCode:String,concepts:[String]},{timestamps:true});
export default mongoose.model('Problem',problemSchema);
