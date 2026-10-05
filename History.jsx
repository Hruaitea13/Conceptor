import React from "react";

export default function History({ state, onClear }) {
  const success = state.runs
    ? Math.round((state.history.filter((h) => !h.misconception).length / state.runs) * 100)
    : 0;

  return (
    <div className="history-scroll">
      <div className="history-head">
        <h2 className="section-title">History</h2>
        <button className="btn btn-ghost small-btn" onClick={onClear}>Clear</button>
      </div>

      <div className="stats-grid">
        <Stat value={state.runs} label="Runs" />
        <Stat value={state.hints} label="Hints" />
        <Stat value={`${success}%`} label="Success" />
        <Stat value={`${Math.round(state.runs * 2.5)}m`} label="Time" />
      </div>

      <div className="panel">
        <div className="panel-h">Recent</div>
        {state.history.length === 0 ? (
          <div className="muted-text">No history yet</div>
        ) : (
          state.history.slice().reverse().map((h) => (
            <div className="history-row" key={`${h.run}-${h.lang}`}>
              <span>#{h.run} {h.lang.toUpperCase()} - {h.misconception || "Success ✓"}</span>
              <span className={h.exitCode === 0 ? "success-text" : "error-text"}>
                {h.exitCode === 0 ? "Success" : "Error"}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div className="panel stat-card">
      <b>{value}</b>
      <div>{label}</div>
    </div>
  );
}
