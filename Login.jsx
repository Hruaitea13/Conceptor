import React, { useState } from "react";

export default function Login({ onLogin, onOpenSignup }) {
  const [email, setEmail] = useState("judge@hackathon.com");
  const [password, setPassword] = useState("demo123");
  const [showPassword, setShowPassword] = useState(false);

  const submit = () => {
    onLogin(email, password);
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-left">
          <h1 className="brand-title">⬡ CONCEPTOR</h1>
          <p className="brand-subtitle">SOCRATIC SANDBOX - BUG FIXED VERSION</p>
          <div className="feature-list">
            <div>✓ Real compilers (Piston API)</div>
            <div>✓ 5 Languages: Python, Python3, C, C++, Java</div>
            <div>✓ Socratic hints, never direct answer</div>
            <div>✓ Eye icon hide/view password</div>
            <div>✓ Create Account working</div>
            <div>✓ Even/Odd bug fixed!</div>
          </div>
        </div>

        <div className="login-right">
          <h2>Welcome back</h2>
          <div className="login-form">
            <label>EMAIL</label>
            <input
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>PASSWORD</label>
            <div className="input-wrap">
              <input
                className="input"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                className="eye"
                onClick={() => setShowPassword((v) => !v)}
                type="button"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <button className="btn btn-primary" onClick={submit}>
              Login →
            </button>

            <div className="login-create">
              No account?{" "}
              <span className="link" onClick={onOpenSignup}>
                Create account
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
