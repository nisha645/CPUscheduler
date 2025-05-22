import React, { useState } from 'react';


const Home = () => {
  const [activeAlgo, setActiveAlgo] = useState('fcfs');

  const renderAlgoDetails = () => {
    switch (activeAlgo) {
      case 'fcfs':
        return (
          <div className="algo-details">
            <h2>First Come First Serve (FCFS) CPU Scheduling</h2>
            
            <h3>How Does FCFS Work?</h3>
            <p>FCFS is the simplest CPU scheduling algorithm which executes processes in the order they arrive in the ready queue.</p>
            
            <h3>Example of FCFS CPU Scheduling:</h3>
            <p><strong>Turnaround Time</strong> = Completion Time - Arrival Time</p>
            <p><strong>Waiting Time</strong> = Turnaround Time - Burst Time</p>
            
            <div className="abbreviations">
              <p><strong>AT</strong> : Arrival Time</p>
              <p><strong>BT</strong> : Burst Time or CPU Time</p>
              <p><strong>TAT</strong> : Turn Around Time</p>
              <p><strong>WT</strong> : Waiting Time</p>
            </div>
            
            <h4>Scenario 1: Processes with same Arrival Times</h4>
            <table>
              <thead>
                <tr>
                  <th>Processes</th>
                  <th>AT</th>
                  <th>BT</th>
                  <th>CT</th>
                  <th>TAT</th>
                  <th>WT</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>P1</td>
                  <td>0</td>
                  <td>5</td>
                  <td>5</td>
                  <td>5-0 = 5</td>
                  <td>5-5 = 0</td>
                </tr>
                <tr>
                  <td>P2</td>
                  <td>0</td>
                  <td>3</td>
                  <td>8</td>
                  <td>8-0 = 8</td>
                  <td>8-3 = 5</td>
                </tr>
                <tr>
                  <td>P3</td>
                  <td>0</td>
                  <td>8</td>
                  <td>16</td>
                  <td>16-0 = 16</td>
                  <td>16-8 = 8</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="4">Average Turn around time = 9.67</td>
                  <td colSpan="2">Average waiting time = 4.33</td>
                </tr>
              </tfoot>
            </table>
            
            <h4>Scenario 2: Processes with Different Arrival Times</h4>
            <table>
              <thead>
                <tr>
                  <th>Process</th>
                  <th>Completion Time (CT)</th>
                  <th>Turnaround Time (TAT = CT - AT)</th>
                  <th>Waiting Time (WT = TAT - BT)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>P2</td>
                  <td>3 ms</td>
                  <td>3 ms</td>
                  <td>0 ms</td>
                </tr>
                <tr>
                  <td>P1</td>
                  <td>8 ms</td>
                  <td>6 ms</td>
                  <td>1 ms</td>
                </tr>
                <tr>
                  <td>P3</td>
                  <td>12 ms</td>
                  <td>8 ms</td>
                  <td>4 ms</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="2">Average Turnaround time = 5.67</td>
                  <td colSpan="2">Average waiting time = 1.67</td>
                </tr>
              </tfoot>
            </table>
            
            <div className="advantages-disadvantages">
              <div>
                <h4>Advantages of FCFS</h4>
                <ul>
                  <li>Simple and easy to understand and implement</li>
                  <li>No starvation as every process gets chance to execute</li>
                </ul>
              </div>
              <div>
                <h4>Disadvantages of FCFS</h4>
                <ul>
                  <li>Poor performance as average wait time is high</li>
                  <li>Not suitable for time-sharing systems</li>
                  <li>Convoy effect occurs</li>
                </ul>
              </div>
            </div>
          </div>
        );
      
      case 'sjf':
        return (
          <div className="algo-details">
            <h2>Shortest Job First (SJF) CPU Scheduling</h2>
            
            <h3>How Does SJF Work?</h3>
            <p>SJF selects the process with the smallest burst time for execution next. It can be either preemptive or non-preemptive.</p>
            
            <h3>Example of SJF CPU Scheduling (Non-preemptive):</h3>
            <table>
              <thead>
                <tr>
                  <th>Process</th>
                  <th>AT</th>
                  <th>BT</th>
                  <th>CT</th>
                  <th>TAT</th>
                  <th>WT</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>P1</td>
                  <td>0</td>
                  <td>6</td>
                  <td>6</td>
                  <td>6</td>
                  <td>0</td>
                </tr>
                <tr>
                  <td>P2</td>
                  <td>0</td>
                  <td>8</td>
                  <td>14</td>
                  <td>14</td>
                  <td>6</td>
                </tr>
                <tr>
                  <td>P3</td>
                  <td>0</td>
                  <td>7</td>
                  <td>21</td>
                  <td>21</td>
                  <td>14</td>
                </tr>
                <tr>
                  <td>P4</td>
                  <td>0</td>
                  <td>3</td>
                  <td>3</td>
                  <td>3</td>
                  <td>0</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="4">Average Turnaround time = 11</td>
                  <td colSpan="2">Average waiting time = 5</td>
                </tr>
              </tfoot>
            </table>
            
            <div className="advantages-disadvantages">
              <div>
                <h4>Advantages of SJF</h4>
                <ul>
                  <li>Minimizes average waiting time</li>
                  <li>Optimal for minimizing waiting time</li>
                </ul>
              </div>
              <div>
                <h4>Disadvantages of SJF</h4>
                <ul>
                  <li>Difficult to predict burst time</li>
                  <li>Can lead to starvation for longer processes</li>
                  <li>Not suitable for interactive systems</li>
                </ul>
              </div>
            </div>
          </div>
        );
      
      case 'rr':
        return (
          <div className="algo-details">
            <h2>Round Robin CPU Scheduling</h2>
            
            <h3>How Does Round Robin Work?</h3>
            <p>Round Robin assigns a fixed time unit per process (time quantum) and cycles through them. If a process doesn't complete in its time quantum, it's preempted and moved to the end of the queue.</p>
            
            <h3>Example of Round Robin CPU Scheduling (Time Quantum = 4):</h3>
            <table>
              <thead>
                <tr>
                  <th>Process</th>
                  <th>AT</th>
                  <th>BT</th>
                  <th>CT</th>
                  <th>TAT</th>
                  <th>WT</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>P1</td>
                  <td>0</td>
                  <td>6</td>
                  <td>18</td>
                  <td>18</td>
                  <td>12</td>
                </tr>
                <tr>
                  <td>P2</td>
                  <td>0</td>
                  <td>8</td>
                  <td>22</td>
                  <td>22</td>
                  <td>14</td>
                </tr>
                <tr>
                  <td>P3</td>
                  <td>0</td>
                  <td>7</td>
                  <td>21</td>
                  <td>21</td>
                  <td>14</td>
                </tr>
                <tr>
                  <td>P4</td>
                  <td>0</td>
                  <td>3</td>
                  <td>3</td>
                  <td>3</td>
                  <td>0</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="4">Average Turnaround time = 16</td>
                  <td colSpan="2">Average waiting time = 10</td>
                </tr>
              </tfoot>
            </table>
            
            <div className="advantages-disadvantages">
              <div>
                <h4>Advantages of Round Robin</h4>
                <ul>
                  <li>No starvation as each process gets equal share of CPU</li>
                  <li>Suitable for time-sharing systems</li>
                  <li>Fair allocation of CPU across processes</li>
                </ul>
              </div>
              <div>
                <h4>Disadvantages of Round Robin</h4>
                <ul>
                  <li>Performance depends heavily on time quantum</li>
                  <li>Higher average waiting time than SJF</li>
                  <li>Context switching overhead</li>
                </ul>
              </div>
            </div>
          </div>
        );
      
      case 'priority':
        return (
          <div className="algo-details">
            <h2>Priority CPU Scheduling</h2>
            
            <h3>How Does Priority Scheduling Work?</h3>
            <p>Priority scheduling executes processes based on their priority. The process with highest priority is executed first. It can be either preemptive or non-preemptive.</p>
            
            <h3>Example of Priority CPU Scheduling (Non-preemptive):</h3>
            <p><em>Note: Lower number indicates higher priority</em></p>
            <table>
              <thead>
                <tr>
                  <th>Process</th>
                  <th>AT</th>
                  <th>BT</th>
                  <th>Priority</th>
                  <th>CT</th>
                  <th>TAT</th>
                  <th>WT</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>P1</td>
                  <td>0</td>
                  <td>6</td>
                  <td>3</td>
                  <td>15</td>
                  <td>15</td>
                  <td>9</td>
                </tr>
                <tr>
                  <td>P2</td>
                  <td>0</td>
                  <td>8</td>
                  <td>4</td>
                  <td>23</td>
                  <td>23</td>
                  <td>15</td>
                </tr>
                <tr>
                  <td>P3</td>
                  <td>0</td>
                  <td>7</td>
                  <td>1</td>
                  <td>7</td>
                  <td>7</td>
                  <td>0</td>
                </tr>
                <tr>
                  <td>P4</td>
                  <td>0</td>
                  <td>3</td>
                  <td>2</td>
                  <td>10</td>
                  <td>10</td>
                  <td>7</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="5">Average Turnaround time = 13.75</td>
                  <td colSpan="2">Average waiting time = 7.75</td>
                </tr>
              </tfoot>
            </table>
            
            <div className="advantages-disadvantages">
              <div>
                <h4>Advantages of Priority Scheduling</h4>
                <ul>
                  <li>Important processes can be prioritized</li>
                  <li>Flexible based on system requirements</li>
                </ul>
              </div>
              <div>
                <h4>Disadvantages of Priority Scheduling</h4>
                <ul>
                  <li>Starvation of lower priority processes</li>
                  <li>Indefinite blocking if priorities not adjusted</li>
                  <li>Priority inversion problem</li>
                </ul>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="home-container">
      <h1>CPU Scheduling Algorithms</h1>
      
      <div className="algo-selector">
        <button 
          className={activeAlgo === 'fcfs' ? 'active' : ''} 
          onClick={() => setActiveAlgo('fcfs')}
        >
          FCFS
        </button>
        <button 
          className={activeAlgo === 'sjf' ? 'active' : ''} 
          onClick={() => setActiveAlgo('sjf')}
        >
          SJF
        </button>
        <button 
          className={activeAlgo === 'rr' ? 'active' : ''} 
          onClick={() => setActiveAlgo('rr')}
        >
          Round Robin
        </button>
        <button 
          className={activeAlgo === 'priority' ? 'active' : ''} 
          onClick={() => setActiveAlgo('priority')}
        >
          Priority
        </button>
      </div>
      
      {renderAlgoDetails()}
    </div>
  );
};

export default Home;