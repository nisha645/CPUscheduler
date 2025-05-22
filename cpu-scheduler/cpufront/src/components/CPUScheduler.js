import React, { useState } from "react";

const Scheduler = () => {
  const [algorithm, setAlgorithm] = useState("FCFS");
  const [quantum, setQuantum] = useState("");
  const [processes, setProcesses] = useState([]);
  const [pid, setPid] = useState("");
  const [arrival, setArrival] = useState("");
  const [burst, setBurst] = useState("");
  const [priority, setPriority] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const scale = 60; // Increased scale for better visibility

  const addProcess = () => {
    if (!pid || arrival === "" || burst === "") {
      setError("All fields except priority are required");
      return;
    }

    if (processes.find((p) => p.pid === pid)) {
      setError("Duplicate PID not allowed");
      return;
    }

    const newProcess = {
      pid,
      arrival_time: Number(arrival),
      burst_time: Number(burst),
      priority: Number(priority) || 0,
    };
    setProcesses([...processes, newProcess]);
    setPid("");
    setArrival("");
    setBurst("");
    setPriority("");
    setError("");
  };

  const clearAll = () => {
    setProcesses([]);
    setResult(null);
    setError("");
  };

  const simulate = async () => {
    if (!algorithm) {
      setError("Select an algorithm");
      return;
    }

    if (algorithm === "Round Robin" && (quantum === "" || isNaN(quantum))) {
      setError("Quantum must be a valid number for Round Robin");
      return;
    }

    const response = await fetch("http://127.0.0.1:5000/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        processes,
        algorithm,
        quantum: quantum || "2",
      }),
    });

    const data = await response.json();
    if (data.error) {
      setError(data.error);
    } else {
      setResult(data);
      setError("");
    }
  };

  const avgWaiting =
    result &&
    (
      result.metrics.reduce((acc, cur) => acc + cur.waiting_time, 0) /
      result.metrics.length
    ).toFixed(2);

  const avgTurnaround =
    result &&
    (
      result.metrics.reduce((acc, cur) => acc + cur.turnaround_time, 0) /
      result.metrics.length
    ).toFixed(2);

  const getColorForPid = (pid) => {
    const colors = [
      "#0074D9",
      "#FF851B",
      "#2ECC40",
      "#B10DC9",
      "#FF4136",
      "#39CCCC",
      "#FFDC00",
      "#85144b",
      "#3D9970",
      "#7FDBFF",
    ];
    const index = parseInt(pid, 10) % colors.length;
    return colors[index];
  };

  const exportProcessesToCSV = () => {
    const csvContent = [
      ["PID", "Arrival Time", "Burst Time", "Priority"],
      ...processes.map(p => [p.pid, p.arrival_time, p.burst_time, p.priority])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "processes.csv";
    a.click();
  };

  const exportResultsToCSV = () => {
    if (!result) return;
    
    const csvContent = [
      ["PID", "Arrival", "Burst", "Completion", "Turnaround", "Waiting"],
      ...result.metrics.map(m => [
        m.pid,
        m.arrival_time,
        m.burst_time,
        m.completion_time,
        m.turnaround_time,
        m.waiting_time
      ])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "results.csv";
    a.click();
  };

  const renderGanttChart = () => {
    if (!result?.gantt) return null;

    let currentTime = 0;
    const timeMarkers = new Set();

    return (
      <div className="gantt-container">
        <div className="gantt-chart">
          {result.gantt.flatMap((block, index) => {
            const elements = [];
            
            // Add idle time block
            if (block.start > currentTime) {
              const idleDuration = block.start - currentTime;
              elements.push(
                <div
                  key={`idle-${index}`}
                  className="gantt-block idle"
                  style={{ width: `${idleDuration * scale}px` }}
                >
                  <div className="block-label">IDLE</div>
                  <div className="block-time">{currentTime}-{block.start}</div>
                </div>
              );
              timeMarkers.add(currentTime);
              timeMarkers.add(block.start);
            }

            // Add process block
            const duration = block.end - block.start;
            elements.push(
              <div
                key={`process-${index}`}
                className="gantt-block"
                style={{
                  width: `${duration * scale}px`,
                  backgroundColor: getColorForPid(block.pid),
                }}
              >
                <div className="block-label">P{block.pid}</div>
                <div className="block-time">{block.start}-{block.end}</div>
              </div>
            );

            timeMarkers.add(block.end);
            currentTime = block.end;
            return elements;
          })}
        </div>

        {/* Timeline markers */}
        <div className="timeline">
          {Array.from(timeMarkers)
            .sort((a, b) => a - b)
            .map(time => (
              <div
                key={time}
                className="timeline-marker"
                style={{ left: `${time * scale}px` }}
              >
                {time}
              </div>
            ))}
        </div>
      </div>
    );
  };

  return (
    <div className="scheduler-container">
      <h1>CPU SCHEDULER</h1>

      <div className="controls">
        <label>
          Algorithm:
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
          >
            <option>FCFS</option>
            <option>SJF</option>
            <option>Priority</option>
            <option>Round Robin</option>
          </select>
        </label>

        {algorithm === "Round Robin" && (
          <input
            placeholder="Quantum"
            value={quantum}
            onChange={(e) => setQuantum(e.target.value)}
            className="quantum"
          />
        )}

        <button onClick={simulate}>Run</button>
        <button onClick={addProcess}>+ Add Process</button>
        <button onClick={clearAll}>Clear All</button>
      </div>

      <div className="form-row">
        <input
          placeholder="PID"
          value={pid}
          onChange={(e) => setPid(e.target.value)}
        />
        <input
          placeholder="Arrival"
          value={arrival}
          type="number"
          onChange={(e) => setArrival(e.target.value)}
        />
        <input
          placeholder="Burst"
          value={burst}
          type="number"
          onChange={(e) => setBurst(e.target.value)}
        />
        <input
          placeholder="Priority (opt)"
          value={priority}
          type="number"
          onChange={(e) => setPriority(e.target.value)}
        />
      </div>

      {error && <div className="error">{error}</div>}

      <table>
        <thead>
          <tr>
            <th>PROCESS</th>
            <th>ARRIVAL TIME</th>
            <th>BURST TIME</th>
          </tr>
        </thead>
        <tbody>
          {processes.map((p, i) => (
            <tr key={i}>
              <td>P{p.pid}</td>
              <td>{p.arrival_time}</td>
              <td>{p.burst_time}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {result && (
        <>
          <h2>Results</h2>
          <table>
            <thead>
              <tr>
                <th>PROCESS ID</th>
                <th>ARRIVAL TIME</th>
                <th>BURST TIME</th>
                <th>COMPLETION TIME</th>
                <th>TURNAROUND TIME</th>
                <th>WAITING TIME</th>
              </tr>
            </thead>
            <tbody>
              {result.metrics.map((p, i) => (
                <tr key={i}>
                  <td>P{p.pid}</td>
                  <td>{p.arrival_time}</td>
                  <td>{p.burst_time}</td>
                  <td>{p.completion_time}</td>
                  <td>{p.turnaround_time}</td>
                  <td>{p.waiting_time}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="averages">
            <p><strong>Avg Waiting Time:</strong> {avgWaiting}</p>
            <p><strong>Avg Turnaround Time:</strong> {avgTurnaround}</p>
            <div className="export-buttons">
              <button onClick={exportProcessesToCSV}>Export Processes (CSV)</button>
              <button onClick={exportResultsToCSV}>Export Results (CSV)</button>
            </div>
          </div>

          <div className="gantt-section">
            <h2>Gantt Chart</h2>
            {renderGanttChart()}
          </div>
        </>
      )}
    </div>
  );
};

export default Scheduler;