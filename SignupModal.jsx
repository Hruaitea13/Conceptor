import React, { useState } from "react";

export default function SignupModal({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  const submit = () => {
    if (!email.trim()) {
      alert("Email needed");
      return;
    }
    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }
    onCreate({ name, email, password });
  };

  return (
    <div className="modal-overlay">
      <div className="signup-card">
        <div className="modal-head">
          <h3>Create Account</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <input className="input" placeholder="Full Name" value={name}
          onChange={(e) => setName(e.target.value)} />
        <input className="input" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} />

        <div className="input-wrap">
          <input className="input" type={show1 ? "text" : "password"} placeholder="Password"
            value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="eye" type="button" onClick={() => setShow1(v => !v)}>
            {show1 ? "🙈" : "👁️"}
          </button>
        </div>

        <div className="input-wrap">
          <input className="input" type={show2 ? "text" : "password"} placeholder="Confirm Password"
            value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          <button className="eye" type="button" onClick={() => setShow2(v => !v)}>
            {show2 ? "🙈" : "👁️"}
          </button>
        </div>

        <button className="btn btn-primary signup-submit" onClick={submit}>
          Create →
        </button>
      </div>
    </div>
  );
}
