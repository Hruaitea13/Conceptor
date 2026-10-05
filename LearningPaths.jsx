import React from "react";

const paths = [
  ["Basics - Even/Odd", "Modulo, if-else, logic", 95],
  ["Memory & Pointers", "malloc, pointers", 22],
  ["Null Safety", "None, null handling", 58]
];

export default function LearningPaths({ graph }) {
  return (
    <div className="learn-scroll">
      <h2 className="section-title">Learning Paths</h2>

      <div className="learning-grid">
        {paths.map(([title, desc, percent]) => (
          <div className="learning-card" key={title}>
            <b>{title}</b>
            <div className="muted-text">{desc}</div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${percent}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="panel full-graph">
        <div className="panel-h">Knowledge Graph</div>
        {graph}
      </div>
    </div>
  );
}
