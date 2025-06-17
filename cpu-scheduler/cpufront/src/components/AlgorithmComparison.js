import React, { useState } from "react";
import "./AlgorithmComparison.css";

const AlgorithmComparison = ({ processes, quantum }) => {
  const [comparisonResults, setComparisonResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const compareAllAlgorithms = async () => {
    setLoading(true);
    const algorithms = ["FCFS", "SJF", "Priority", "Round Robin"];
    const results = [];

    for (const algo of algorithms) {
      const response = await fetch("http://127.0.0.1:5000/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          processes,
          algorithm: algo,
          quantum: algo === "Round Robin" ? quantum || "2" : undefined,
        }),
      });

      const data = await response.json();
      if (!data.error) {
        const avgWT = (
          data.metrics.reduce((acc, cur) => acc + cur.waiting_time, 0) /
          data.metrics.length
        ).toFixed(2);

        const avgTAT = (
          data.metrics.reduce((acc, cur) => acc + cur.turnaround_time, 0) /
          data.metrics.length
        ).toFixed(2);

        results.push({ algorithm: algo, avgWT, avgTAT });
      }
    }

    setComparisonResults(results);
    setLoading(false);
  };

  return (
    <div className="comparison-wrapper">
      <h2>Compare Scheduling Algorithms</h2> <br></br>
      <button onClick={compareAllAlgorithms} className="compare-btn">
        {loading ? "Comparing..." : "Compare All"}
      </button>

      {comparisonResults.length > 0 && (
        <>
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Algorithm</th>
                <th>Avg Waiting Time</th>
                <th>Avg Turnaround Time</th>
              </tr>
            </thead>
            <tbody>
              {comparisonResults.map((res, i) => (
                <tr key={i}>
                  <td>{res.algorithm}</td>
                  <td>{res.avgWT}</td>
                  <td>{res.avgTAT}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="bar-chart">
            {comparisonResults.map((res, i) => (
              <div key={i} className="bar-row">
                <span className="label">{res.algorithm}</span>
                <div className="bar waiting" style={{ width: `${res.avgWT * 70}px` }}>
                  WT: {res.avgWT}
                </div> 
                <div className="bar turnaround" style={{ width: `${res.avgTAT * 70}px` }}>
                  TAT: {res.avgTAT}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AlgorithmComparison;
