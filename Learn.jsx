import React from "react";
import LearningPaths from "../components/LearningPaths";
import MasteryDashboard from "../components/MasteryDashboard";

export default function Learn({ state }) {
  const graph = <MasteryDashboard state={state} />;

  return (
    <div className="page-pad">
      <LearningPaths graph={graph} />
    </div>
  );
}
