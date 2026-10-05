import Problem from '../models/Problem.js';
export async function listProblems(req,res){res.json(await Problem.find().sort({createdAt:1}));}
export async function getProblem(req,res){const p=await Problem.findOne({slug:req.params.slug});if(!p)return res.status(404).json({message:'Problem not found'});res.json(p);}
export async function seedProblems(req,res){
 const data=[
 {slug:'evenodd',title:'Even/Odd Checker',description:'Read a number and determine whether it is even or odd.',difficulty:'Easy',language:'python',starterCode:'num = 10\nif num % 2 == 0:\n    print("Even")\nelse:\n    print("Odd")',concepts:['variables','conditionals','modulo']},
 {slug:'python-none',title:'Python: None Handling',description:'Understand and safely handle a None value.',difficulty:'Easy',language:'python',starterCode:'value = None\nprint(value.upper())',concepts:['null_safety','types']},
 {slug:'c-pointer',title:'C: Pointer Safety',description:'Fix the invalid pointer access.',difficulty:'Medium',language:'c',starterCode:'#include <stdio.h>\nint main(){ int *p; printf("%d", *p); return 0; }',concepts:['pointer_misuse','memory']},
 {slug:'java-npe',title:'Java: NullPointerException',description:'Find why a method is called on a null reference.',difficulty:'Medium',language:'java',starterCode:'public class Main { public static void main(String[] args){ String s=null; System.out.println(s.length()); }}',concepts:['null_safety','objects']}
 ];
 for(const x of data) await Problem.updateOne({slug:x.slug},{$set:x},{upsert:true});
 res.json({message:'Problems seeded',count:data.length});
}
