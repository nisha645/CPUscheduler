import React, { useState, useEffect } from "react";
import "./Scheduler.css"; // optional if you want to separate styles

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
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  const addProcess = () => {
    if (!pid || arrival === "" || burst === "") {
      setError("All fields except priority are required");
      return;
    }

    if (processes.find((p) => p.pid === pid)) {
      setError("Duplicate PID not allowed");
      return;
    }

    setProcesses([...processes, {
      pid,
      arrival_time: Number(arrival),
      burst_time: Number(burst),
      priority: Number(priority) || 0,
    }]);

    setPid(""); setArrival(""); setBurst(""); setPriority(""); setError("");
  };

  const clearAll = () => {
    setProcesses([]); setResult(null); setError("");
  };

  const simulate = async () => {
    if (!algorithm) return setError("Select an algorithm");

    if (algorithm === "Round Robin" && (!quantum || isNaN(quantum))) {
      return setError("Quantum must be a valid number for Round Robin");
    }

    const response = await fetch("http://127.0.0.1:5000/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ processes, algorithm, quantum: quantum || "2" }),
    });

    const data = await response.json();
    if (data.error) setError(data.error);
    else {
      setResult(data);
      setError("");
    }
  };

  const saveToFile = () => {
    const blob = new Blob([JSON.stringify(processes, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "processes.json";
    a.click();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        setProcesses(JSON.parse(event.target.result));
        setError("");
      } catch {
        setError("Invalid file format");
      }
    };
    reader.readAsText(file);
  };

  const getColorForPid = (pid) => {
    const colors = ["#0074D9", "#FF851B", "#2ECC40", "#B10DC9", "#FF4136", "#39CCCC", "#FFDC00", "#85144b", "#3D9970", "#7FDBFF"];
    return colors[parseInt(pid, 10) % colors.length];
  };

  const scale = 30;

  const avgWaiting = result && (result.metrics.reduce((a, b) => a + b.waiting_time, 0) / result.metrics.length).toFixed(2);
  const avgTurnaround = result && (result.metrics.reduce((a, b) => a + b.turnaround_time, 0) / result.metrics.length).toFixed(2);

  return (
    <div className={`app ${theme}`}>
      <h1>CPU SCHEDULER</h1>

      <div className="top-bar">
        <button onClick={toggleTheme}>Switch to {theme === "light" ? "Dark" : "Light"} Mode</button>
        <button onClick={saveToFile}>Save Processes</button>
        <input type="file" accept=".json" onChange={handleFileUpload} style={{ marginLeft: 10 }} />
      </div>

      <div className="controls">
        <label>
          Algorithm:
          <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
            <option>FCFS</option>
            <option>SJF</option>
            <option>Priority</option>
            <option>Round Robin</option>
          </select>
        </label>

        {algorithm === "Round Robin" && (
          <input placeholder="Quantum" value={quantum} onChange={(e) => setQuantum(e.target.value)} className="quantum" />
        )}

        <button onClick={simulate}>Run</button>
        <button onClick={addProcess}>+ Add Process</button>
        <button onClick={clearAll}>Clear All</button>
      </div>

      <div className="form-row">
        <input placeholder="PID" value={pid} onChange={(e) => setPid(e.target.value)} />
        <input placeholder="Arrival" value={arrival} type="number" onChange={(e) => setArrival(e.target.value)} />
        <input placeholder="Burst" value={burst} type="number" onChange={(e) => setBurst(e.target.value)} />
        <input placeholder="Priority (opt)" value={priority} type="number" onChange={(e) => setPriority(e.target.value)} />
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
          </div>

          <div className="gantt-section">
            <h2>Gantt Chart</h2>
            <div className="gantt-chart-container" style={{ overflowX: "auto" }}>
              <div className="gantt-chart" style={{ display: "flex", alignItems: "center" }}>
                {(() => {
                  const chart = [];
                  let currentTime = 0;

                  for (let i = 0; i < result.gantt.length; i++) {
                    const block = result.gantt[i];
                    const gap = block.start - currentTime;

                    if (gap > 0) {
                      chart.push(
                        <div className="gantt-block idle" key={`idle-${i}`} data-tooltip={`Idle (${currentTime}–${block.start})`} style={{ width: `${gap * scale}px` }}>
                          <span>Idle</span>
                        </div>
                      );
                    }

                    const width = (block.end - block.start) * scale;
                    chart.push(
                      <div className="gantt-block" key={i} data-tooltip={`P${block.pid} (${block.start}–${block.end})`} style={{ width: `${width}px`, backgroundColor: getColorForPid(block.pid) }}>
                        <span>P{block.pid}</span>
                      </div>
                    );

                    currentTime = block.end;
                  }

                  return chart;
                })()}
              </div>

              <div className="gantt-timeline" style={{ display: "flex", alignItems: "center", marginTop: 4, fontSize: 12, userSelect: "none", fontFamily: "monospace" }}>
                {(() => {
                  const timeline = [];
                  let currentTime = 0;

                  timeline.push(<span key="time-0" className="time-marker" style={{ width: "20px", textAlign: "center" }}>0</span>);

                  for (let i = 0; i < result.gantt.length; i++) {
                    const block = result.gantt[i];
                    const gap = block.start - currentTime;

                    if (gap > 0) {
                      timeline.push(<span key={`idle-${i}`} className="time-marker" style={{ width: `${gap * scale}px`, textAlign: "center" }}>{block.start}</span>);
                    } else if (gap === 0 && i !== 0) {
                      timeline.push(<span key={`start-${i}`} className="time-marker" style={{ width: "0px" }}>{block.start}</span>);
                    }

                    currentTime = block.end;

                    if (i === result.gantt.length - 1) {
                      timeline.push(<span key={`end-${i}`} className="time-marker" style={{ width: "40px", textAlign: "center" }}>{block.end}</span>);
                    }
                  }

                  return timeline;
                })()}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Scheduler;
