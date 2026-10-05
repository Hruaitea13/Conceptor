import express from 'express';
const router = express.Router();

router.post('/hint', async (req, res) => {
  const { code, error, language, level } = req.body;
  
  const prompt = `
You are a Socratic programming tutor for Conceptor platform.
Student is at Level ${level}, Language: ${language}
Their code: ${code}
Error/Output: ${error}

RULES:
- Never give direct answer
- Give 1 Socratic hint only
- Ask a question to make them think
- Keep it short (2 lines max)
- Use Mizo + English mix if possible

Example: Instead of "Add colon" say "Line ${level} en la, if statement zawh hian eng nge dah ngai?"
`;

  try {
    const ollamaRes = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3', // or codellama
        prompt: prompt,
        stream: false
      })
    });
    
    const data = await ollamaRes.json();
    res.json({ hint: data.response });
  } catch (e) {
    // Fallback if Ollama not running
    res.json({ hint: `<b>🤖 AI Hint (Fallback):</b><br>Level ${level} - Check your logic: <code>num % 2 == 0</code> en la, eng nge a tih?` });
  }
});

export default router;