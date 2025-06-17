from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/schedule", methods=["POST"])
def schedule():
    try:
        data = request.get_json()
        processes = data.get("processes", [])
        algorithm = data.get("algorithm", "")
        quantum_raw = data.get("quantum", 2)

        try:
            quantum = int(quantum_raw) if str(quantum_raw).strip() != "" else 2
        except ValueError:
            return jsonify({"error": "Quantum must be an integer"}), 400

        if not processes or not algorithm:
            return jsonify({"error": "Missing processes or algorithm"}), 400

        for p in processes:
            if not all(k in p for k in ["pid", "arrival_time", "burst_time"]):
                return jsonify({"error": "Missing fields in process"}), 400

        pids = [p["pid"] for p in processes]
        if len(pids) != len(set(pids)):
            return jsonify({"error": "Duplicate PID found"}), 400

        # Convert types
        for p in processes:
            p["arrival_time"] = int(p["arrival_time"])
            p["burst_time"] = int(p["burst_time"])
            p["priority"] = int(p.get("priority", 0))

        if algorithm == "FCFS":
            result = fcfs(processes)
        elif algorithm == "SJF":
            result = sjf(processes)
        elif algorithm == "Priority":
            result = priority(processes)
        elif algorithm == "Round Robin":
            result = round_robin(processes, quantum)
        else:
            return jsonify({"error": "Unknown algorithm"}), 400

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ----------- ALGORITHMS ------------

def fcfs(processes):
    processes = sorted(processes, key=lambda x: x["arrival_time"])
    time = 0
    gantt = []
    metrics = []

    # Add initial IDLE block if the first process arrives after time 0
    if processes[0]["arrival_time"] > 0:
        idle_start = 0
        idle_end = processes[0]["arrival_time"]
        gantt.append({
            "pid": "idle",
            "start": idle_start,
            "end": idle_end,
            "duration": idle_end - idle_start
        })
        time = idle_end

    for p in processes:
        start = max(time, p["arrival_time"])
        end = start + p["burst_time"]
        time = end

        gantt.append({
            "pid": p["pid"],
            "start": start,
            "end": end,
            "duration": p["burst_time"]
        })

        metrics.append({
            "pid": p["pid"],
            "arrival_time": p["arrival_time"],
            "burst_time": p["burst_time"],
            "completion_time": end,
            "turnaround_time": end - p["arrival_time"],
            "waiting_time": start - p["arrival_time"]
        })

    return {"metrics": metrics, "gantt": gantt}



def sjf(processes):
    processes = sorted(processes, key=lambda x: (x["arrival_time"], x["burst_time"]))
    time = 0
    completed = 0
    n = len(processes)
    visited = [False] * n
    gantt = []
    metrics = []
    idle_start = None

    while completed < n:
        idx = -1
        min_bt = float('inf')

        for i, p in enumerate(processes):
            if p["arrival_time"] <= time and not visited[i] and p["burst_time"] < min_bt:
                min_bt = p["burst_time"]
                idx = i

        if idx == -1:
            if idle_start is None:
                idle_start = time
            time += 1
            continue
        else:
            if idle_start is not None:
                gantt.append({
                    "pid": "idle",
                    "start": idle_start,
                    "end": time,
                    "duration": time - idle_start
                })
                idle_start = None

        p = processes[idx]
        start = time
        end = time + p["burst_time"]
        time = end
        visited[idx] = True
        completed += 1

        gantt.append({"pid": p["pid"], "start": start, "end": end, "duration": p["burst_time"]})
        metrics.append({
            "pid": p["pid"],
            "arrival_time": p["arrival_time"],
            "burst_time": p["burst_time"],
            "completion_time": end,
            "turnaround_time": end - p["arrival_time"],
            "waiting_time": start - p["arrival_time"]
        })

    return {"metrics": metrics, "gantt": gantt}


def priority(processes):
    # Assign automatic priority if not given (None, '', 0, or negative)
    current_priority = 30
    for p in processes:
        try:
            if p["priority"]=="None" or p["priority"] <= 0:
                p["priority"] = current_priority
                current_priority += 1
        except:
            p["priority"] = current_priority
            current_priority += 1

    # Sort by arrival time and then priority
    processes = sorted(processes, key=lambda x: (x["arrival_time"], x["priority"]))

    time = 0
    completed = 0
    n = len(processes)
    visited = [False] * n
    gantt = []
    metrics = []
    idle_start = None

    while completed < n:
        idx = -1
        highest_priority = float("inf")

        for i, p in enumerate(processes):
            if p["arrival_time"] <= time and not visited[i] and p["priority"] < highest_priority:
                highest_priority = p["priority"]
                idx = i

        if idx == -1:
            if idle_start is None:
                idle_start = time
            time += 1
            continue
        else:
            if idle_start is not None:
                gantt.append({
                    "pid": "idle",
                    "start": idle_start,
                    "end": time,
                    "duration": time - idle_start
                })
                idle_start = None

        p = processes[idx]
        start = time
        end = time + p["burst_time"]
        time = end
        visited[idx] = True
        completed += 1

        gantt.append({
            "pid": p["pid"],
            "start": start,
            "end": end,
            "duration": p["burst_time"]
        })

        metrics.append({
            "pid": p["pid"],
            "arrival_time": p["arrival_time"],
            "burst_time": p["burst_time"],
            "completion_time": end,
            "turnaround_time": end - p["arrival_time"],
            "waiting_time": start - p["arrival_time"]
        })

    return {"metrics": metrics, "gantt": gantt}


def round_robin(processes, quantum):
    queue = []
    time = 0
    gantt = []
    metrics = []
    completed_pids = set()
    n = len(processes)

    remaining = {p["pid"]: p["burst_time"] for p in processes}
    arrival_map = {p["pid"]: p["arrival_time"] for p in processes}
    pid_map = {p["pid"]: p for p in processes}

    arrival_sorted = sorted(processes, key=lambda x: x["arrival_time"])
    i = 0  # Index for process arrivals

    while len(completed_pids) < n:

        # Add newly arrived processes to queue
        while i < n and arrival_sorted[i]["arrival_time"] <= time:
            queue.append(arrival_sorted[i]["pid"])
            i += 1

        # If no process is ready, system is idle
        if not queue:
            # Determine next process arrival
            next_arrival = arrival_sorted[i]["arrival_time"] if i < n else time + 1
            idle_duration = next_arrival - time

            gantt.append({
                "pid": "idle",
                "start": time,
                "end": time + idle_duration,
                "duration": idle_duration
            })

            time += idle_duration

            # Add processes that arrive during idle time
            while i < n and arrival_sorted[i]["arrival_time"] <= time:
                queue.append(arrival_sorted[i]["pid"])
                i += 1

            continue

        # Get next process from queue
        pid = queue.pop(0)
        bt = remaining[pid]
        run_time = min(bt, quantum)
        start = time
        end = time + run_time
        time = end
        remaining[pid] -= run_time

        gantt.append({
            "pid": pid,
            "start": start,
            "end": end,
            "duration": run_time
        })

        # Add processes that arrived during this execution
        while i < n and arrival_sorted[i]["arrival_time"] <= time:
            queue.append(arrival_sorted[i]["pid"])
            i += 1

        # If the process is not finished, put it back in the queue
        if remaining[pid] > 0:
            queue.append(pid)
        else:
            p = pid_map[pid]
            completion_time = time
            turnaround = completion_time - p["arrival_time"]
            waiting = turnaround - p["burst_time"]
            metrics.append({
                "pid": pid,
                "arrival_time": p["arrival_time"],
                "burst_time": p["burst_time"],
                "completion_time": completion_time,
                "turnaround_time": turnaround,
                "waiting_time": waiting
            })
            completed_pids.add(pid)

    # Sort metrics by original process arrival order
    metrics.sort(key=lambda x: arrival_map[x["pid"]])
    return {"metrics": metrics, "gantt": gantt}


if __name__ == "__main__":
    app.run(debug=True)
