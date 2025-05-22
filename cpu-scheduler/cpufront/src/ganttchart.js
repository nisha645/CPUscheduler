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