import React, { useState } from "react";
import ProblemList from "../components/ProblemList";

export default function Problems({ problems, onLoad }) {
  const [selected, setSelected] = useState(null);
  const problem = selected ? problems[selected] : null;

  return (
    <div className="page-pad">
      <div className="problems-layout">
        <ProblemList
          problems={problems}
          onSelect={(id) => setSelected(id)}
        />

        <div className="panel problem-detail">
          <div className="panel-h">
            <span>{problem ? problem.title : "Select Problem"}</span>
            <span className="tag">{problem ? problem.lang.toUpperCase() : "-"}</span>
          </div>

          <div className="problem-description">
            {problem ? (
              <>
                <b>{problem.title}</b>
                <br /><br />
                {problem.desc}
                <br /><br />
                <b>Click Load in Sandbox to test</b>
              </>
            ) : (
              "Choose from left. Even/Odd problem added for testing fix."
            )}
          </div>

          {problem && (
            <button className="btn btn-primary load-btn" onClick={() => onLoad(selected)}>
              Load in Sandbox →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
