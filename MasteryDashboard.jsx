import React from "react";

export default function MasteryDashboard({ state }) {
  const color = state.pointer < 30 ? "#ef4444" : state.pointer < 60 ? "#f97316" : "#22d3ee";

  return (
    <div className="panel">
      <div className="panel-h">Mastery Dashboard</div>

      <div className="graph">
        <div className="graph-node">
          <div className="circle-node" style={{ borderColor: color }}>
            <span>{state.pointer}%</span>
            <span className="node-label">Logic</span>
          </div>
          <div className="node-status" style={{ color }}>
            {state.pointer < 30 ? "BOTTLENECK" : "Good"}
          </div>
        </div>

        <div className="graph-node">
          <div className="circle-node purple">
            <span>85%</span>
            <span className="node-label">Scoping</span>
          </div>
          <div className="node-status purple-text">Solid</div>
        </div>
      </div>

      <div className="mastery-box">
        <b>
          Mastery: {state.mastery}% - {state.pointer < 30 ? "Bottleneck" : "Strong"}
        </b>
        <br />
        Last: {state.misconception || "Success ✓"} | Exit: {state.lastExitCode ?? "-"} | {state.apiUsed ? "Real" : "Offline"}
      </div>

      <div className="logs">{state.logs.map((log, i) => <div key={i}>- {log}</div>)}</div>
    </div>
  );
}
