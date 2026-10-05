import React, { useEffect, useRef } from "react";

export default function CodeEditor({ code, setCode, language, onRun, running }) {
  const lineRef = useRef(null);
  const areaRef = useRef(null);

  const lineCount = Math.max(code.split("\n").length, 10);

  useEffect(() => {
    if (lineRef.current && areaRef.current) {
      lineRef.current.scrollTop = areaRef.current.scrollTop;
    }
  }, [code]);

  return (
    <>
      <div className="panel-h">
        <span>Editor • <span className="lang-label">{language.toUpperCase()}</span></span>
        <span className={running ? "status running" : "status"}>{running ? "● Running..." : "● Ready"}</span>
      </div>

      <div className="editor-wrap">
        <div className="line-nums" ref={lineRef}>
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        <textarea
          ref={areaRef}
          className="code-area"
          spellCheck="false"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onScroll={() => {
            if (lineRef.current) lineRef.current.scrollTop = areaRef.current.scrollTop;
          }}
        />
      </div>

      <button className="btn btn-run" disabled={running} onClick={onRun}>
        {running ? "⏳ Running..." : "▶ Run & Analyze"}
      </button>
    </>
  );
}
