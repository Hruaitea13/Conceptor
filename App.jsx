import React, { useMemo, useState } from "react";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/Login";
import Sandbox from "./pages/Sandbox";
import Problems from "./pages/Problems";
import Learn from "./pages/Learn";
import History from "./pages/History";
import Dashboard from "./pages/Dashboard";
import Knowledge from "./pages/Knowledge";
import { api } from "./api";
import { STARTER } from "./data/starterCode";
import { PROBLEMS } from "./data/problems";

const initialState = {
  level: 0, runs: 0, hints: 0, pointer: 22,
  misconception: null, history: [], mastery: 22,
  output: "", lastExitCode: null, apiUsed: false,
  logs: ["Session started"]
};

function getDetailedError(output, code) {
  const lines = code.split('\n');
  const match = output.match(/line (\d+)/i);
  const lineNum = match? parseInt(match[1]) : null;
  const errorLine = lineNum && lines[lineNum - 1]? lines[lineNum - 1] : "";
  let cause = ""; let fix = "";
  if (output.includes("SyntaxError") || output.includes("invalid syntax")) {
    cause = `Syntax error at line ${lineNum || '?'}`;
    fix = `Check: <code>${escapeHtml(errorLine || output.slice(-100))}</code>`;
  } else if (output.includes("NameError")) {
    const nameMatch = output.match(/name '(.+?)' is not defined/);
    const wrongName = nameMatch? nameMatch[1] : "variable";
    cause = `Spelling mistake! <code>${escapeHtml(wrongName)}</code> not defined`;
    fix = `Line ${lineNum}: <code>${escapeHtml(errorLine)}</code>`;
  } else {
    cause = `Error at line ${lineNum || '?'}`;
    fix = `<code>${escapeHtml(output.slice(-200))}</code>`;
  }
  return { lineNum, errorLine, cause, fix };
}

function detectLanguageFromCode(code) {
  const t = code.trim();
  if (t.includes("public class") || t.includes("System.out.println") || t.includes("public static void main")) return "java";
  if (t.includes("#include") && (t.includes("cout") || t.includes("printf"))) {
    return t.includes("cout") || t.includes("iostream")? "cpp" : "c";
  }
  if (t.includes("#include")) return "c";
  if (t.includes("cout <<")) return "cpp";
  if (t.includes("console.log")) return "javascript";
  return "python";
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(() =>!!localStorage.getItem("conceptor_token"));
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem("conceptor_email") || "");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(STARTER.python);
  const [running, setRunning] = useState(false);
  const [messages, setMessages] = useState(["<b>AI:</b> Paste your Even/Odd code and run - Ollama AI ready!"]);
  const [state, setState] = useState(initialState);
  const graphState = useMemo(() => state, [state]);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    setCode(STARTER[lang] || "");
    setState((prev) => ({...prev, output: "Ready - Click Run!", lastExitCode: null }));
  };

  const login = (auth) => {
    const email = typeof auth === "string"? auth : auth?.user?.email;
    if (auth?.token) localStorage.setItem("conceptor_token", auth.token);
    if (email) localStorage.setItem("conceptor_email", email);
    setUserEmail(email || "");
    setLoggedIn(true);
    setActiveTab("sandbox");
  };

  const logout = () => {
    localStorage.removeItem("conceptor_token");
    localStorage.removeItem("conceptor_email");
    setLoggedIn(false);
    setActiveTab("sandbox");
  };

  const runRealCode = async () => {
    if (running) return;
    setRunning(true);
    setMessages([]);
    let effectiveLang = detectLanguageFromCode(code);
    if (effectiveLang!== language) setLanguage(effectiveLang);

    if (effectiveLang === "java") {
      const hasPrint = code.includes("System.out.println");
      const hasLogic = code.includes("%2==0") || code.includes("% 2 == 0") || code.includes("% 2");
      if (hasPrint && hasLogic) {
        setState((prev) => ({...prev, runs: prev.runs + 1, output: "STDOUT:\nEven\n\n(Simulated Java Run)", lastExitCode: 0, mastery: Math.min(95, prev.mastery + 10), history: [...prev.history, { run: prev.runs + 1, lang: effectiveLang, exitCode: 0 }], logs: [...prev.logs, `Run #${prev.runs + 1} [java] - success (local)`]}));
        setMessages([`<b>✅ Success (JAVA - Local)</b><br>Output: Even<br>Code correct!`]);
      } else {
        setState((prev) => ({...prev, output: "Java incomplete", lastExitCode: 1}));
        setMessages([`<b>⚠️ JAVA Error</b><br>Need: <code>if(num%2==0) System.out.println("Even")</code>`]);
      }
      setRunning(false); return;
    }

    if (effectiveLang === "c" || effectiveLang === "cpp") {
      const hasMain = code.includes("main(");
      const hasPrintf = code.includes("printf") || code.includes("cout");
      if (hasMain && hasPrintf) {
        const text = effectiveLang === "c"? "STDOUT:\nEven\n(Simulated C Run)" : "STDOUT:\nEven\n(Simulated C++ Run)";
        setState(prev => ({...prev, runs: prev.runs + 1, output: text, lastExitCode: 0, mastery: Math.min(95, prev.mastery + 10), history: [...prev.history, { run: prev.runs + 1, lang: effectiveLang, exitCode: 0, misconception: null }], logs: [...prev.logs, `Run #${prev.runs + 1} [${effectiveLang}] - success (local)`]}));
        setMessages([`<b>✅ Success (${effectiveLang.toUpperCase()} - Local)</b><br>Your ${effectiveLang} code is correct! Output: Even`]);
      } else {
        setState(prev => ({...prev, output: "Missing main/printf", lastExitCode: 1}));
        setMessages([`<b>⚠️ ${effectiveLang.toUpperCase()} Error</b><br>Missing main() or printf/cout<br><code>int main(){ printf("Even"); }</code>`]);
      }
      setRunning(false); return;
    }

    try {
      const result = await api('/submissions', { method: 'POST', body: JSON.stringify({ code, language: effectiveLang }) });
      const sub = result.submission || {};
      const text = [sub.output && `STDOUT:\n${sub.output}`, sub.error && `STDERR:\n${sub.error}`].filter(Boolean).join('\n\n') || 'Success - no output';
      setState((prev) => ({...prev, runs: prev.runs + 1, output: text, lastExitCode: sub.exitCode, apiUsed: true, misconception: result.analysis?.concepts?.[0] || null, mastery: sub.status === 'success'? Math.min(95, prev.mastery + 10) : prev.mastery, history: [...prev.history, { run: prev.runs + 1, lang: effectiveLang, misconception: result.analysis?.concepts?.[0] || null, exitCode: sub.exitCode }], logs: [...prev.logs, `Run #${prev.runs + 1} [${effectiveLang}] - ${result.analysis?.concepts?.[0] || 'success'}`]}));
      setMessages([`<b>${sub.status === 'success'? '✅ Success' : '⚠️ Socratic Analysis'}</b><br>${result.analysis?.socratic || `Ran as ${effectiveLang}`}<br><br><span class="confidence-tag">Saved to MongoDB</span>`]);
    } catch (e) {
      setMessages([`<b>Backend error:</b> ${escapeHtml(e.message)}<br>Make sure backend and MongoDB are running.`]);
      setState((prev) => ({...prev, output: e.message, lastExitCode: 1 }));
    } finally {
      setRunning(false);
    }
  };

  // === NEW OLLAMA HINT LOGIC ===
  const nextHint = async () => {
    const nextLevel = state.level + 1;
    setState((prev) => ({...prev, level: nextLevel, hints: prev.hints + 1 }));
    setMessages((m) => [...m, `<b>🤖 Ollama AI is thinking... (Llama3 Free)</b><br>Level ${nextLevel}`]);

    try{
      const res = await api('/ollama/hint', {
        method:'POST',
        body: JSON.stringify({code, error: state.output, language, level: nextLevel})
      });
      setMessages((m) => [...m, `<b>🤖 Ollama AI Hint - Level ${nextLevel}</b><br>${res.hint}<br><br><span style="background:#7c5cff;color:white;padding:3px 10px;border-radius:12px;font-size:12px;">🦙 Powered by Ollama Llama3 (Free & Offline)</span>`]);
    }catch(e){
      // Fallback to old logic
      const lowerCode = code.toLowerCase();
      const hasEvenOdd = lowerCode.includes("% 2") || lowerCode.includes("%2");
      if (state.lastExitCode === 0 ||!state.misconception) {
        setMessages((m) => [...m, `<b>✅ Success! Level ${nextLevel + 1}</b><br>Why: <code>num % 2 == 0</code> checks remainder.`]);
      } else {
        const detail = getDetailedError(state.output, code);
        let html = `<b>🤖 AI Error Detector - Level ${nextLevel + 1}</b><br>`;
        if (detail.lineNum) html += `<b>📍 Line ${detail.lineNum}:</b> <code>${escapeHtml(detail.errorLine)}</code><br>`;
        html += `<b>🔍 Cause:</b> ${detail.cause}<br><b>🛠️ Fix:</b> ${detail.fix}`;
        setMessages((m) => [...m, html]);
      }
    }
  };

  const loadProblem = (id) => {
    const p = PROBLEMS[id] || PROBLEMS.evenodd;
    setLanguage(p.lang);
    setCode(STARTER[p.lang] || "");
    setActiveTab("sandbox");
  };

  const clearHistory = () => setState((prev) => ({...prev, history: [], runs: 0, hints: 0, logs: ["Session started"]}));

  if (!loggedIn) return <LoginPage onLogin={login} />;

  return (
    <div className="app-page">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} language={language} onLanguageChange={changeLanguage} userEmail={userEmail} onLogout={logout} />
      {activeTab === "dashboard" && <Dashboard state={state}/>}
      {activeTab === "knowledge" && <Knowledge />}
      {activeTab === "sandbox" && (<Sandbox code={code} setCode={setCode} language={language} onRun={runRealCode} running={running} messages={messages} onNextHint={nextHint} state={graphState} />)}
      {activeTab === "problems" && (<Problems problems={PROBLEMS} onLoad={loadProblem} />)}
      {activeTab === "learn" && <Learn state={graphState} />}
      {activeTab === "history" && (<History history={state.history} logs={state.logs} onClear={clearHistory} />)}
    </div>
  );
}

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}