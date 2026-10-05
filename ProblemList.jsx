import React from "react";

export default function ProblemList({ problems, onSelect }) {
  return (
    <div className="panel problem-list">
      <div className="panel-h">Problem Set</div>
      {Object.entries(problems).map(([id, p]) => (
        <button className="problem-item" key={id} onClick={() => onSelect(id)}>
          <b>{id === "evenodd" ? "Easy: " : ""}{p.title.replace(" (Your Code)", "")}</b>
          <div>{p.desc}</div>
        </button>
      ))}
    </div>
  );
}
