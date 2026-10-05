import React from "react";

export default function SocraticTutor({ messages, onNextHint, state }) {
  const isSuccess = state?.lastExitCode === 0;

  return (
    <div className="panel">
      <div className="panel-h">
        <span>Socratic AI Tutor</span>
        <span className="tag" style={{ background: isSuccess ? "#22c55e" : "#3b82f6", color: "white" }}>
          {isSuccess ? "Success! 🎉" : "Fixed"}
        </span>
      </div>

      <div className="chat">
        {messages.map((message, index) => (
          <div className="tutor-msg ai" key={index} dangerouslySetInnerHTML={{ __html: message }} />
        ))}
      </div>

      <button className="btn next-hint" onClick={onNextHint}>
        {isSuccess ? "Next Challenge →" : "Next Hint →"}
      </button>
    </div>
  );
}