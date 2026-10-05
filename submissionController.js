import Submission from '../models/Submission.js';
import Problem from '../models/Problem.js';
import User from '../models/User.js';
import Progress from '../models/Progress.js';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

function analyse(text, language, exitCode) {
  if (exitCode === 0) return [];
  const t = (text || '').toLowerCase();
  if (!t.trim()) return ['logic'];
  if (t.includes('nonetype') || t.includes('nullpointer')) return ['null_safety'];
  if (t.includes('segmentation fault') || t.includes('segfault')) return ['pointer_misuse'];
  if (t.includes('syntaxerror')) return ['syntax'];
  if (t.includes('nameerror') || t.includes('is not defined') || t.includes('referenceerror')) return ['variables'];
  if (t.includes('indexerror') || t.includes('out of range')) return ['logic'];
  if (t.includes('typeerror') || t.includes('zerodivision') || t.includes('valueerror')) return ['logic'];
  return ['logic'];
}

async function runLocally(code, language) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'conceptor-'));
  const fileName = path.join(tmpDir, 'main.py');
  fs.writeFileSync(fileName, code, 'utf-8');

  const commands = [
    `python "${fileName}"`,
    `py "${fileName}"`,
    `python3 "${fileName}"`
  ];

  for (const cmd of commands) {
    try {
      const { stdout } = await execAsync(cmd, { timeout: 5000, cwd: tmpDir });
      try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}
      return { output: stdout, error: '', exitCode: 0 };
    } catch (err) {
      const out = err.stdout || '';
      const errOut = err.stderr || out || err.message || '';
      
      if (errOut.includes('not recognized') || errOut.includes('not found') || errOut.includes('was not found')) {
        continue; // Try next command
      }
      
      try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}
      return { output: '', error: errOut || out, exitCode: 1 };
    }
  }

  try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}
  return { output: '', error: 'Python not found. Please add Python to PATH. Install from python.org and check "Add to PATH"', exitCode: 1 };
}

export async function submit(req, res) {
  try {
    const { code, language = 'python', problemSlug } = req.body;
    if (!code?.trim()) return res.status(400).json({ message: 'Code is required' });

    const result = await runLocally(code, language);
    let output = result.output || '';
    let error = result.error || '';
    let exitCode = result.exitCode;

    if (error === '' && output.toLowerCase().includes('traceback')) {
      error = output;
      output = '';
      exitCode = 1;
    }

    const concepts = analyse(error, language, exitCode);
    const problem = problemSlug ? await Problem.findOne({ slug: problemSlug }) : null;
    const status = exitCode === 0 ? 'success' : 'error';

    const submission = await Submission.create({
      userId: req.user._id,
      problemId: problem?._id,
      language,
      code,
      output,
      error,
      status,
      exitCode,
      detectedConcepts: concepts
    });

    await User.findByIdAndUpdate(req.user._id, { $inc: { xp: status === 'success' ? 25 : 5 } });

    await Progress.findOneAndUpdate(
      { userId: req.user._id },
      {
        $setOnInsert: { userId: req.user._id },
        $inc: { totalRuns: 1, successfulRuns: status === 'success' ? 1 : 0 },
        $push: { recentConcepts: { $each: concepts, $slice: -10 } }
      },
      { upsert: true, new: true }
    );

    if (concepts.length) {
      const inc = {};
      concepts.forEach(c => inc[`concepts.${c}`] = 5);
      await Progress.findOneAndUpdate({ userId: req.user._id }, { $inc: inc });
    }

    let socraticMsg = '';
    let nextHint = '';

    if (status === 'success') {
      if (!output.trim()) {
        socraticMsg = 'Code executed but produced no output. Did you forget print()?';
        nextHint = 'Use print() to display your result, e.g., print(a+b)';
      } else {
        socraticMsg = `Success! Output: ${output.trim().slice(0, 200)}`;
        nextHint = 'Try different inputs. What happens with 0 or negative numbers?';
      }
    } else {
      if (concepts.includes('syntax')) {
        socraticMsg = `Syntax Error: ${error.split('\n').slice(-3).join(' ').slice(0, 200)}`;
        nextHint = 'Check missing colons, brackets, or indentation.';
      } else if (concepts.includes('variables')) {
        socraticMsg = `Variable Error: ${error.slice(0, 200)}`;
        nextHint = 'Check variable spelling. Python is case-sensitive.';
      } else {
        socraticMsg = `Runtime Error: ${error.slice(0, 200)}`;
        nextHint = 'Check your logic and test with sample values.';
      }
    }

    res.status(201).json({
      submission,
      analysis: { concepts, status, socratic: socraticMsg, nextHint }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Submission failed: ' + e.message });
  }
}

export async function history(req, res) {
  res.json(await Submission.find({ userId: req.user._id }).populate('problemId', 'slug title').sort({ createdAt: -1 }).limit(50));
}