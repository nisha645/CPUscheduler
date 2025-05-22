# server.py
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(_name_)
CORS(app)

# Example process list: FCFS scheduling
processes = [
    {"name": "P1", "arrival": 0, "burst": 4},
    {"name": "P2", "arrival": 1, "burst": 3},
    {"name": "P3", "arrival": 2, "burst": 5},
]

@app.route('/schedule')
def schedule():
    current_time = 0
    timeline = []

    for proc in sorted(processes, key=lambda x: x["arrival"]):
        start = max(current_time, proc["arrival"])
        end = start + proc["burst"]
        timeline.append({
            "name": proc["name"],
            "start": start,
            "end": end
        })
        current_time = end

    return jsonify(timeline)

if _name_ == '_main_':
    app.run(debug=True)