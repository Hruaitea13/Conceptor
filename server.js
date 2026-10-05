import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import {connectDB} from './config/db.js';
import authRoutes from './routes/auth.js';
import problemRoutes from './routes/problems.js';
import submissionRoutes from './routes/submissions.js';
import progressRoutes from './routes/progress.js';

const app=express();
app.use(cors({origin:process.env.CLIENT_URL||'http://localhost:5173'}));
app.use(express.json({limit:'1mb'}));

app.get('/api/health',(req,res)=>res.json({ok:true,service:'Conceptor API'}));

// --- EXISTING ROUTES ---
app.use('/api/auth',authRoutes);
app.use('/api/problems',problemRoutes);
app.use('/api/submissions',submissionRoutes);
app.use('/api/progress',progressRoutes);

// --- NEW: OLLAMA AI ROUTE (FREE) ---
app.post('/api/ollama/hint', async (req,res)=>{
  const {code, error, language, level} = req.body;
  const prompt = `You are Socratic tutor for Conceptor. Language:${language} Level:${level} Code:${code} Error:${error}. Rules: Never give direct answer, give 1 short Socratic question hint only (2 lines max). Example: Instead of 'Add colon' say 'Line ah colon a awm em?'`;

  try{
    const ollamaRes = await fetch('http://localhost:11434/api/generate',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({model:'llama3', prompt, stream:false})
    });
    const data = await ollamaRes.json();
    res.json({hint: data.response});
  }catch(e){
    console.log("Ollama not running, using fallback");
    res.json({hint: `<b>🧠 Level ${level} - Think:</b><br>En teh, <code>num % 2</code> hian eng nge a pek le? 0 anih chuan Even, 1 anih chuan Odd. I if condition kha a dik em?<br><br><span style="font-size:12px;color:gray;">(Ollama offline - fallback hint)</span>`});
  }
});

const port=process.env.PORT||5000;
connectDB().then(()=>app.listen(port,()=>console.log(`Conceptor API + Ollama running on http://localhost:${port}`))).catch(e=>{console.error('MongoDB connection failed:',e.message);process.exit(1);});