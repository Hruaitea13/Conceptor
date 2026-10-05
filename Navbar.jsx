import React from "react";

export default function Navbar({ activeTab, onTabChange, language, onLanguageChange, userEmail, onLogout }) {
  const tabs = [
    ["dashboard", "Dashboard"],
    ["sandbox", "Sandbox"],
    ["problems", "Problems"],
    ["learn", "Learn"],
    ["knowledge", "Knowledge"],
    ["history", "History"]
  ];

  return (
    <div className="topbar">
      <div className="topbar-left">
        <div className="app-brand">
          ⬡ <span>CONCEPTOR</span>
          <small>FIXED</small>
        </div>

        <div className="nav">
          {tabs.map(([id, label]) => (
            <button
              key={id}
              className={activeTab === id ? "nav-item active" : "nav-item"}
              onClick={() => onTabChange(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="topbar-right">
        <select className="select" value={language} onChange={(e) => onLanguageChange(e.target.value)}>
          <option value="python">Python</option>
          <option value="python3">Python3</option>
          <option value="c">C</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
        </select>
        <span className="user-email">{userEmail}</span>
        <button className="btn btn-ghost logout-btn" onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
}
