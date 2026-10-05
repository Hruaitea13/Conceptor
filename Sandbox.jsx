import React from "react";
import CodeEditor from "../components/CodeEditor";
import SocraticTutor from "../components/SocraticTutor";
import MasteryDashboard from "../components/MasteryDashboard";

export default function Sandbox({
  code,
  setCode,
  language,
  onRun,
  running,
  messages,
  onNextHint,
  state
}) {
  return (
    <div className="grid sandbox-grid">
      <div className="panel">
        <CodeEditor
          code={code}
          setCode={setCode}
          language={language}
          onRun={onRun}
          running={running}
        />

        <div className={`output ${state.lastExitCode === 0 ? "ok" : state.lastExitCode === 1 ? "err" : ""}`}>
          {state.output || 'Click Run. Even/Odd code will now show Success + explanation!'}
        </div>
      </div>

      <SocraticTutor messages={messages} onNextHint={onNextHint} state={state} />
      <MasteryDashboard state={state} />
    </div>
  );
}