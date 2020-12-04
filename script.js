//when radio changed, show/hide time quantum input and show/hide priority column
let radios = document.querySelectorAll("#algorithms input");

function checkTimeQuantumInput() {
    radios.forEach((radio) => {
        if (radio.checked == true) {
            let timequantum = document.querySelector("#time-quantum").classList;
            if (radio.id == "rr") {
                timequantum.remove("hide");
            } else {
                timequantum.add("hide");
            }
        }
    });
}

function checkPriorityCell() {
    radios.forEach((radio) => {
        if (radio.checked == true) {
            let prioritycell = document.querySelectorAll(".priority");
            if (radio.id == "pnp" || radio.id == "pp") {
                prioritycell.forEach((element) => {
                    element.classList.remove("hide");
                });
            } else {
                prioritycell.forEach((element) => {
                    element.classList.add("hide");
                });
            }
        }
    });
}
radios.forEach((radio) =>
    radio.addEventListener("change", () => {
        checkTimeQuantumInput();
        checkPriorityCell();
    })
);

//resize burst time rows size on +/-
let process = 1;

function gcd(x, y) {
    while (y) {
        let t = y;
        y = x % y;
        x = t;
    }
    return x;
}

function lcm(x, y) {
    return (x * y) / gcd(x, y);
}

function lcmAll() {
    let result = 1;
    for (let i = 0; i < process; i++) {
        result = lcm(result, document.querySelector(".main-table").rows[2 * i + 2].cells.length);
    }
    return result;
}

function updateColspan() { //update burst time cell colspan
    let totalColumns = lcmAll();
    let processHeading = document.querySelector("thead .process-time");
    processHeading.setAttribute("colspan", totalColumns);
    let processTimes = [];
    let table = document.querySelector(".main-table");
    for (let i = 0; i < process; i++) {
        let row = table.rows[2 * i + 2].cells;
        processTimes.push(row.length);
    }
    for (let i = 0; i < process; i++) {
        let row1 = table.rows[2 * i + 1].cells;
        let row2 = table.rows[2 * i + 2].cells;
        for (let j = 0; j < processTimes[i]; j++) {
            row1[j + 3].setAttribute("colspan", totalColumns / processTimes[i]);
            row2[j].setAttribute("colspan", totalColumns / processTimes[i]);
        }
    }
}

function addremove() { //add remove bt-to time pair add event listener
    let processTimes = [];
    let table = document.querySelector(".main-table");
    for (let i = 0; i < process; i++) {
        let row = table.rows[2 * i + 2].cells;
        processTimes.push(row.length);
    }
    let addbtns = document.querySelectorAll(".add-process-btn");
    for (let i = 0; i < process; i++) {
        addbtns[i].onclick = () => {
            let table = document.querySelector(".main-table");
            let row1 = table.rows[2 * i + 1];
            let row2 = table.rows[2 * i + 2];
            let newcell1 = row1.insertCell(processTimes[i] + 3);
            newcell1.innerHTML = "IO";
            newcell1.classList.add("process-time");
            newcell1.classList.add("io");
            newcell1.classList.add("process-heading");
            let newcell2 = row2.insertCell(processTimes[i]);
            newcell2.innerHTML = '<input type="number" min="1" step="1" value="1">';
            newcell2.classList.add("process-time");
            newcell2.classList.add("io");
            newcell2.classList.add("process-input");
            let newcell3 = row1.insertCell(processTimes[i] + 4);
            newcell3.innerHTML = "CPU";
            newcell3.classList.add("process-time");
            newcell3.classList.add("cpu");
            newcell3.classList.add("process-heading");
            let newcell4 = row2.insertCell(processTimes[i] + 1);
            newcell4.innerHTML = '<input type="number" min="1" step="1" value="1">';
            newcell4.classList.add("process-time");
            newcell4.classList.add("cpu");
            newcell4.classList.add("process-input");
            processTimes[i] += 2;
            updateColspan();
        };
    }
    let removebtns = document.querySelectorAll(".remove-process-btn");
    for (let i = 0; i < process; i++) {
        removebtns[i].onclick = () => {
            if (processTimes[i] > 1) {
                let table = document.querySelector(".main-table");
                processTimes[i]--;
                let row1 = table.rows[2 * i + 1];
                row1.deleteCell(processTimes[i] + 3);
                let row2 = table.rows[2 * i + 2];
                row2.deleteCell(processTimes[i]);
                processTimes[i]--;
                table = document.querySelector(".main-table");
                row1 = table.rows[2 * i + 1];
                row1.deleteCell(processTimes[i] + 3);
                row2 = table.rows[2 * i + 2];
                row2.deleteCell(processTimes[i]);
                updateColspan();
            }
        };
    }
}
addremove();

document.querySelector(".add-btn").onclick = () => { //add row event listener
    process++;
    let rowHTML1 = `
                          <td class="process-id" rowspan="2">P${process}</td>
                          <td class="priority hide" rowspan="2"><input type="number" min="1" step="1" value="1"></td>
                          <td class="arrival-time" rowspan="2"><input type="number" min="0" step="1" value="0"> </td>
                          <td class="process-time cpu process-heading" colspan="">CPU</td>
                          <td class="process-btn"><button type="button" class="add-process-btn">+</button></td>
                          <td class="process-btn"><button type="button" class="remove-process-btn">-</button></td>
                      `;
    let rowHTML2 = `
                           <td class="process-time cpu process-input"><input type="number" min="1" step="1" value="1"> </td>
                      `;
    let table = document.querySelector(".main-table tbody");
    table.insertRow(table.rows.length).innerHTML = rowHTML1;
    table.insertRow(table.rows.length).innerHTML = rowHTML2;
    checkPriorityCell();
    addremove();
    updateColspan();
};
document.querySelector(".remove-btn").onclick = () => { //remove row event listener
    let table = document.querySelector(".main-table");
    if (process > 1) {
        table.deleteRow(table.rows.length - 1);
        table.deleteRow(table.rows.length - 1);
        process--;
    }
    updateColspan();
};
//----------------before calculate

class Input {
    constructor() {
        this.processId = [];
        this.priority = [];
        this.arrivalTime = [];
        this.processTime = [];
        this.processTimeLength = [];
        this.totalBurstTime = [];
        this.algorithm = "";
        this.algorithmType = "";
    }
}
class Utility {
    constructor() {
        this.remainingProcessTime = [];
        this.remainingBurstTime = [];
        this.currentProcessIndex = [];
        this.start = [];
        this.done = [];
        this.returnTime = [];
        this.currentTime = 0;
    }
}
class Output {
    constructor() {
        this.completionTime = [];
        this.turnAroundTime = [];
        this.waitingTime = [];
        this.responseTime = [];
        this.schedule = [];
        this.timeLog = [];
    }
}
class TimeLog {
    constructor() {
        this.time = -1;
        this.remain = [];
        this.ready = [];
        this.running = [];
        this.block = [];
        this.terminate = [];
    }
}

function setInput(input) {
    for (let i = 1; i <= process; i++) {
        input.processId.push(i - 1);
        let rowCells1 = document.querySelector(".main-table").rows[2 * i - 1].cells;
        let rowCells2 = document.querySelector(".main-table").rows[2 * i].cells;
        input.priority.push(Number(rowCells1[1].firstElementChild.value));
        input.arrivalTime.push(Number(rowCells1[2].firstElementChild.value));
        let ptn = Number(rowCells2.length);
        let pta = [];
        for (let j = 0; j < ptn; j++) {
            pta.push(Number(rowCells2[j].firstElementChild.value));
        }
        input.processTime.push(pta);
        input.processTimeLength.push(ptn);
    }
    //total burst time for each process
    input.totalBurstTime = new Array(process).fill(0);
    input.processTime.forEach((e1, i) => {
        e1.forEach((e2, j) => {
            if (j % 2 == 0) {
                input.totalBurstTime[i] += e2;
            }
        });
    });
}

function setUtility(input, utility) {
    utility.remainingProcessTime = input.processTime.slice();
    utility.remainingBurstTime = input.totalBurstTime.slice();
    utility.currentProcessIndex = new Array(process).fill(0);
    utility.start = new Array(process).fill(false);
    utility.done = new Array(process).fill(false);
    utility.returnTime = input.arrivalTime.slice();
}

function setOutput(input, output) {
    for (let i = 0; i < process; i++) {
        output.turnAroundTime[i] = output.completionTime[i] - input.arrivalTime[i];
        output.waitingTime[i] = output.turnAroundTime[i] - input.totalBurstTime[i];
    }
    //reduce schedule
    let newSchedule = [];
    let currentScheduleElement = output.schedule[0][0];
    let currentScheduleLength = output.schedule[0][1];
    for (let i = 1; i < output.schedule.length; i++) {
        if (output.schedule[i][0] == currentScheduleElement) {
            currentScheduleLength += output.schedule[i][1];
        } else {
            newSchedule.push([currentScheduleElement, currentScheduleLength]);
            currentScheduleElement = output.schedule[i][0];
            currentScheduleLength = output.schedule[i][1];
        }
    }
    newSchedule.push([currentScheduleElement, currentScheduleLength]);
    output.schedule = newSchedule;
}

function showGanttChart(output, outputDiv) {
    let ganttChartHeading = document.createElement("h3");
    ganttChartHeading.innerHTML = "Gantt Chart";
    outputDiv.appendChild(ganttChartHeading);

    let ganttChartData = [];
    let startGantt = 0;
    output.schedule.forEach((element) => {
        if (element[0] != -1) {
            ganttChartData.push([
                "Time",
                "P" + element[0],
                startGantt * 1000,
                (startGantt + element[1]) * 1000,
            ]);
        }
        startGantt += element[1];
    });
    ganttChartData.sort((a, b) => parseInt(a[1].substring(1, a[1].length)) - parseInt(b[1].substring(1, b[1].length)));
    let ganttChart = document.createElement("div");
    ganttChart.id = "gantt-chart";

    google.charts.load("current", { packages: ["timeline"] });
    google.charts.setOnLoadCallback(drawGanttChart);

    function drawGanttChart() {
        var container = document.getElementById("gantt-chart");
        var chart = new google.visualization.Timeline(container);
        var dataTable = new google.visualization.DataTable();

        dataTable.addColumn({ type: "string", id: "Gantt Chart" });
        dataTable.addColumn({ type: "string", id: "Process" });
        dataTable.addColumn({ type: "number", id: "Start" });
        dataTable.addColumn({ type: "number", id: "End" });
        dataTable.addRows(ganttChartData);

        var options = {
            timeline: {
                showRowLabels: false,
                // groupByRowLabel:true
                avoidOverlappingGridLines: true,
            }
        };
        chart.draw(dataTable, options);
    }
    outputDiv.appendChild(ganttChart);
}

function showTimelineChart(output, outputDiv) {
    let timelineChartHeading = document.createElement("h3");
    timelineChartHeading.innerHTML = "Timeline Chart";
    outputDiv.appendChild(timelineChartHeading);
    let timelineChartData = [];
    let startTimeline = 0;
    output.schedule.forEach((element) => {
        if (element[0] != -1) {
            timelineChartData.push([
                "P" + element[0],
                startTimeline * 1000,
                (startTimeline + element[1]) * 1000,
            ]);
        }
        startTimeline += element[1];
    });
    timelineChartData.sort((a, b) => parseInt(a[0].substring(1, a[0].length)) - parseInt(b[0].substring(1, b[0].length)));
    let timelineChart = document.createElement("div");
    timelineChart.id = "timeline-chart";

    google.charts.load("current", { packages: ["timeline"] });
    google.charts.setOnLoadCallback(drawTimelineChart);

    function drawTimelineChart() {
        var container = document.getElementById("timeline-chart");
        var chart = new google.visualization.Timeline(container);
        var dataTable = new google.visualization.DataTable();

        dataTable.addColumn({ type: "string", id: "Process" });
        dataTable.addColumn({ type: "number", id: "Start" });
        dataTable.addColumn({ type: "number", id: "End" });
        dataTable.addRows(timelineChartData);
        chart.draw(dataTable);
    }
    outputDiv.appendChild(timelineChart);
}

function showFinalTable(input, output, outputDiv) {
    let finalTableHeading = document.createElement("h3");
    finalTableHeading.innerHTML = "Final Table";
    outputDiv.appendChild(finalTableHeading);
    let table = document.createElement("table");
    table.classList.add("final-table");
    let thead = table.createTHead();
    let row = thead.insertRow(0);
    let headings = [
        "Process",
        "Arrival Time",
        "Total Burst Time",
        "Completion Time",
        "Turn Around Time",
        "Waiting Time",
        "Response Time",
    ];
    headings.forEach((element, index) => {
        let cell = row.insertCell(index);
        cell.innerHTML = element;
    });
    let tbody = table.createTBody();
    for (let i = 0; i < process; i++) {
        let row = tbody.insertRow(i);
        let cell = row.insertCell(0);
        cell.innerHTML = "P" + (i + 1);
        cell = row.insertCell(1);
        cell.innerHTML = input.arrivalTime[i];
        cell = row.insertCell(2);
        cell.innerHTML = input.totalBurstTime[i];
        cell = row.insertCell(3);
        cell.innerHTML = output.completionTime[i];
        cell = row.insertCell(4);
        cell.innerHTML = output.turnAroundTime[i];
        cell = row.insertCell(5);
        cell.innerHTML = output.waitingTime[i];
        cell = row.insertCell(6);
        cell.innerHTML = output.responseTime[i];
    }
    outputDiv.appendChild(table);

    let tbt = 0;
    input.totalBurstTime.forEach((element) => (tbt += element));
    let lastct = 0;
    output.completionTime.forEach((element) => (lastct = Math.max(lastct, element)));
    let cpu = document.createElement("p");
    cpu.innerHTML = "CPU Utilization : " + (tbt / lastct) * 100 + "%";
    outputDiv.appendChild(cpu);
    let tp = document.createElement("p");
    tp.innerHTML = "Throughput : " + process / lastct;
    outputDiv.appendChild(tp);
}

function setAlgorithmNameType(input, algorithm) {
    input.algorithm = algorithm;
    switch (algorithm) {
        case 'fcfs':
        case 'sjf':
        case 'ljf':
        case 'pnp':
        case 'hrrn':
            input.algorithmType = "nonpreemptive";
            break;
        case 'srjf':
        case 'lrjf':
        case 'pp':
            input.algorithmType = "preemptive";
            break;
        case 'rr':
            input.algorithmType = "roundrobin";
            break;
    }
}

function showAlgorithmChart(outputDiv) {
    let algorithmChart = document.createElement("div");
    algorithmChart.id = "algorithm-chart";
    let algorithmChartData = [];
    algorithmChartData.push([
        "Algorithm",
        "Completion Time",
        "Turn Around Time",
        "Waiting Time",
        "Response Time",
    ]);
    let algorithmArray = ["fcfs", "sjf", "srjf", "rr", "ljf", "lrjf", "pnp", "pp", "hrrn"];
    algorithmArray.forEach(currentAlgorithm => {
        let chartInput = new Input();
        let chartUtility = new Utility();
        let chartOutput = new Output();
        setInput(chartInput);
        setUtility(chartInput, chartUtility);
        setAlgorithmNameType(chartInput, currentAlgorithm);
        if (currentAlgorithm == 'rr') {
            roundrobin(chartInput, chartUtility, chartOutput);
        } else {
            algo(chartInput, chartUtility, chartOutput);
        }
        setOutput(chartInput, chartOutput);
        let avgct = 0;
        chartOutput.completionTime.forEach((element) => {
            avgct += element;
        });
        avgct /= process;
        let avgtat = 0;
        chartOutput.turnAroundTime.forEach((element) => {
            avgtat += element;
        });
        avgtat /= process;
        let avgwt = 0;
        chartOutput.waitingTime.forEach((element) => {
            avgwt += element;
        });
        avgwt /= process;
        let avgrt = 0;
        chartOutput.responseTime.forEach((element) => {
            avgrt += element;
        });
        avgrt /= process;
        algorithmChartData.push([currentAlgorithm, avgct, avgtat, avgwt, avgrt]);
    });
    google.charts.load("current", { packages: ["bar"] });
    google.charts.setOnLoadCallback(drawAlgorithmChart);

    function drawAlgorithmChart() {
        var data = google.visualization.arrayToDataTable(algorithmChartData);
        var options = {
            chart: {
                title: "Algorithms",
                subtitle: "Average Completion Time,Turn Around Time, Waiting Time, Response Time",
            },
        };
        var chart = new google.charts.Bar(
            document.getElementById("algorithm-chart")
        );
        chart.draw(data, google.charts.Bar.convertOptions(options));
    }
    outputDiv.appendChild(algorithmChart);
}

function nextTimeLog(timeLog) {
    let timeLogTableDiv = document.getElementById("time-log-table-div");
    timeLogTableDiv.innerHTML = "";

    let remainTable = document.createElement("table");
    remainTable.id = "remain-table";
    let remainTableHead = remainTable.createTHead();
    let remainTableHeadRow = remainTableHead.insertRow(0);
    let remainTableHeading = remainTableHeadRow.insertCell(0);
    remainTableHeading.innerHTML = "Remain";
    let remainTableBody = remainTable.createTBody();
    for (let i = 0; i < timeLog.remain.length; i++) {
        let remainTableBodyRow = remainTableBody.insertRow(i);
        let remainTableValue = remainTableBodyRow.insertCell(0);
        remainTableValue.innerHTML = 'P' + (timeLog.remain[i] + 1);
    }
    timeLogTableDiv.appendChild(remainTable);

    let readyTable = document.createElement("table");
    readyTable.id = "ready-table";
    let readyTableHead = readyTable.createTHead();
    let readyTableHeadRow = readyTableHead.insertRow(0);
    let readyTableHeading = readyTableHeadRow.insertCell(0);
    readyTableHeading.innerHTML = "Ready";
    let readyTableBody = readyTable.createTBody();
    for (let i = 0; i < timeLog.ready.length; i++) {
        let readyTableBodyRow = readyTableBody.insertRow(i);
        let readyTableValue = readyTableBodyRow.insertCell(0);
        readyTableValue.innerHTML = 'P' + (timeLog.ready[i] + 1);
    }
    timeLogTableDiv.appendChild(readyTable);

    let runningTable = document.createElement("table");
    runningTable.id = "running-table";
    let runningTableHead = runningTable.createTHead();
    let runningTableHeadRow = runningTableHead.insertRow(0);
    let runningTableHeading = runningTableHeadRow.insertCell(0);
    runningTableHeading.innerHTML = "Running";
    let runningTableBody = runningTable.createTBody();
    for (let i = 0; i < timeLog.running.length; i++) {
        let runningTableBodyRow = runningTableBody.insertRow(i);
        let runningTableValue = runningTableBodyRow.insertCell(0);
        runningTableValue.innerHTML = 'P' + (timeLog.running[i] + 1);
    }
    timeLogTableDiv.appendChild(runningTable);

    let blockTable = document.createElement("table");
    blockTable.id = "block-table";
    let blockTableHead = blockTable.createTHead();
    let blockTableHeadRow = blockTableHead.insertRow(0);
    let blockTableHeading = blockTableHeadRow.insertCell(0);
    blockTableHeading.innerHTML = "Block";
    let blockTableBody = blockTable.createTBody();
    for (let i = 0; i < timeLog.block.length; i++) {
        let blockTableBodyRow = blockTableBody.insertRow(i);
        let blockTableValue = blockTableBodyRow.insertCell(0);
        blockTableValue.innerHTML = 'P' + (timeLog.block[i] + 1);
    }
    timeLogTableDiv.appendChild(blockTable);

    let terminateTable = document.createElement("table");
    terminateTable.id = "terminate-table";
    let terminateTableHead = terminateTable.createTHead();
    let terminateTableHeadRow = terminateTableHead.insertRow(0);
    let terminateTableHeading = terminateTableHeadRow.insertCell(0);
    terminateTableHeading.innerHTML = "Terminate";
    let terminateTableBody = terminateTable.createTBody();
    for (let i = 0; i < timeLog.terminate.length; i++) {
        let terminateTableBodyRow = terminateTableBody.insertRow(i);
        let terminateTableValue = terminateTableBodyRow.insertCell(0);
        terminateTableValue.innerHTML = 'P' + (timeLog.terminate[i] + 1);
    }
    timeLogTableDiv.appendChild(terminateTable);

    let timeLogTime = document.getElementById("time-log-time");
    timeLogTime.innerHTML = "Time : " + timeLog.time;
}


function showOutput(input, output, outputDiv) {
    showGanttChart(output, outputDiv);
    showTimelineChart(output, outputDiv);
    showFinalTable(input, output, outputDiv);
    reduceTimeLog(output.timeLog);
    showTimeLog(outputDiv);
    showAlgorithmChart(outputDiv);
    document.querySelector("#start-time-log").onclick = () => {
        let index = 0;
        let interval = setInterval(() => {
            nextTimeLog(output.timeLog[index++]);
            if (index == output.timeLog.length) {
                clearInterval(interval);
            }
        }, 500);
    };
}

function reduceTimeLog(timeLog) {
    let timeLogLength = timeLog.length;
    let newTimeLog = [],
        j = 0;
    for (let i = 0; i < timeLogLength - 1; i++) {
        if (timeLog[i].time != timeLog[i + 1].time) {
            newTimeLog.push(timeLog[j]);
        }
        j = i + 1;
    }
    if (j == timeLogLength - 1) {
        newTimeLog.push(timeLog[j]);
    }
    return newTimeLog;
}

function moveElement(value, from, to) { //if present in from and not in to
    let index = from.indexOf(value);
    if (index != -1) {
        from.splice(index, 1);
    }
    if (to.indexOf(value) == -1) {
        to.push(value);
    }
}

function algo(input, utility, output) {
    let currentTimeLog = new TimeLog();
    currentTimeLog.remain = input.processId;
    output.timeLog.push(JSON.parse(JSON.stringify(currentTimeLog)));
    currentTimeLog.time++;
    while (utility.done.some((element) => element == false)) {
        let candidatesRemain = currentTimeLog.remain.filter((element) => input.arrivalTime[element] <= utility.currentTime);
        let candidatesBlock = currentTimeLog.block.filter((element) => utility.returnTime[element] <= utility.currentTime);
        let candidates = candidatesRemain.concat(candidatesBlock);
        candidates.forEach(element => {
            moveElement(element, currentTimeLog.remain, currentTimeLog.ready);
            moveElement(element, currentTimeLog.block, currentTimeLog.ready);
        });
        candidates = candidates.concat(currentTimeLog.ready);
        if (candidates.length > 0) {
            output.timeLog.push(JSON.parse(JSON.stringify(currentTimeLog)));
        }
        let found = -1;
        if (currentTimeLog.running.length == 1) {
            found = currentTimeLog.running[0];
        } else if (candidates.length > 0) {
            candidates.sort((a, b) => {
                switch (input.algorithm) {
                    case 'fcfs':
                        return utility.returnTime[a] - utility.returnTime[b];
                    case 'sjf':
                    case 'srjf':
                        return utility.remainingBurstTime[a] - utility.remainingBurstTime[b];
                    case 'ljf':
                    case 'lrjf':
                        return utility.remainingBurstTime[b] - utility.remainingBurstTime[a];
                    case 'pnp':
                    case 'pp':
                        return priorityPreference * (input.priority[a] - input.priority[b]);
                    case 'hrrn':
                        function responseRatio(id) {
                            let s = utility.remainingBurstTime[id];
                            let w = utility.currentTime - input.arrivalTime[id] - s;
                            return 1 + w / s;
                        }
                        return responseRatio(b) - responseRatio(a);
                }
            });
            found = candidates[0];
            moveElement(found, currentTimeLog.ready, currentTimeLog.running);
            output.timeLog.push(JSON.parse(JSON.stringify(currentTimeLog)));
            if (utility.start[found] == false) {
                utility.start[found] = true;
                output.responseTime[found] = utility.currentTime - input.arrivalTime[found];
            }
        }
        utility.currentTime++;
        currentTimeLog.time++;
        if (found != -1) {
            output.schedule.push([found + 1, 1]);
            utility.remainingProcessTime[found][utility.currentProcessIndex[found]]--;
            utility.remainingBurstTime[found]--;
            if (utility.remainingProcessTime[found][utility.currentProcessIndex[found]] == 0) {
                utility.currentProcessIndex[found]++;
                if (utility.currentProcessIndex[found] == input.processTimeLength[found]) {
                    utility.done[found] = true;
                    output.completionTime[found] = utility.currentTime;
                    moveElement(found, currentTimeLog.running, currentTimeLog.terminate);
                } else {
                    utility.returnTime[found] = utility.currentTime + input.processTime[found][utility.currentProcessIndex[found]];
                    utility.currentProcessIndex[found]++;
                    moveElement(found, currentTimeLog.running, currentTimeLog.block);
                }
            } else if (input.algorithmType == "preemptive") {
                moveElement(found, currentTimeLog.running, currentTimeLog.ready);
            }
        } else {
            output.schedule.push([-1, 1]);
        }
        output.timeLog.push(JSON.parse(JSON.stringify(currentTimeLog)));
    }
}

function roundrobin(input, utility, output) {
    function updateReadyQueue(currentTimeLog, input, utility) {
        let candidatesRemain = currentTimeLog.remain.filter((element) => input.arrivalTime[element] <= utility.currentTime);
        let candidatesBlock = currentTimeLog.block.filter((element) => utility.returnTime[element] <= utility.currentTime);
        let candidates = candidatesRemain.concat(candidatesBlock);
        candidates.sort((a, b) => utility.returnTime[a] - utility.returnTime[b]);
        candidates.forEach(element => {
            moveElement(element, currentTimeLog.remain, currentTimeLog.ready);
            moveElement(element, currentTimeLog.block, currentTimeLog.ready);
        });
    }
    let currentTimeLog = new TimeLog();
    currentTimeLog.remain = input.processId;
    output.timeLog.push(JSON.parse(JSON.stringify(currentTimeLog)));
    currentTimeLog.time++;
    let timeQuantum = document.querySelector("#tq").value;
    let remainingTimeRunning = 0;
    let firstReady = [];
    utility.currentTime--;
    currentTimeLog.time--;
    do {
        output.timeLog.push(JSON.parse(JSON.stringify(currentTimeLog)));
        utility.currentTime++;
        currentTimeLog.time++;
        output.schedule.push([-1, 1]);
        firstReady = input.processId.filter((element) => input.arrivalTime[element] <= utility.currentTime);

    } while (firstReady.length == 0);
    if (output.schedule.length > 0) {
        output.schedule.pop();
    }
    firstReady.forEach(element => {
        moveElement(element, currentTimeLog.remain, currentTimeLog.ready);
    });
    output.timeLog.push(JSON.parse(JSON.stringify(currentTimeLog)));
    while (utility.done.some((element) => element == false)) {
        let found = -1;
        if (currentTimeLog.running.length == 1) {
            found = currentTimeLog.running[0];
        } else if (currentTimeLog.ready.length > 0) { //new process in running
            found = currentTimeLog.ready[0];
            moveElement(found, currentTimeLog.ready, currentTimeLog.running);
            output.timeLog.push(JSON.parse(JSON.stringify(currentTimeLog)));
            if (utility.start[found] == false) {
                utility.start[found] = true;
                output.responseTime[found] = utility.currentTime - input.arrivalTime[found];
            }
            remainingTimeRunning = Math.min(utility.remainingProcessTime[found][utility.currentProcessIndex[found]], timeQuantum);
        }
        utility.currentTime++;
        currentTimeLog.time++;
        if (found != -1) {
            output.schedule.push([found + 1, 1]);
            utility.remainingProcessTime[found][utility.currentProcessIndex[found]]--;
            remainingTimeRunning--;
            if (remainingTimeRunning == 0) {
                if (utility.remainingProcessTime[found][utility.currentProcessIndex[found]] == 0) {
                    utility.currentProcessIndex[found]++;
                    if (utility.currentProcessIndex[found] == input.processTimeLength[found]) {
                        utility.done[found] = true;
                        output.completionTime[found] = utility.currentTime;
                        moveElement(found, currentTimeLog.running, currentTimeLog.terminate);
                    } else {
                        utility.returnTime[found] = utility.currentTime + input.processTime[found][utility.currentProcessIndex[found]];
                        utility.currentProcessIndex[found]++;
                        moveElement(found, currentTimeLog.running, currentTimeLog.block);
                    }
                    updateReadyQueue(currentTimeLog, input, utility);
                } else {
                    updateReadyQueue(currentTimeLog, input, utility);
                    moveElement(found, currentTimeLog.running, currentTimeLog.ready);
                }
            }
        } else {
            output.schedule.push([-1, 1]);
            updateReadyQueue(currentTimeLog, input, utility);
        }
        output.timeLog.push(JSON.parse(JSON.stringify(currentTimeLog)));
    }
}

document.querySelector(".calculate").onclick = () => { //event listener for calculate
    let outputDiv = document.getElementById("output");
    outputDiv.innerHTML = "";
    let mainInput = new Input();
    let mainUtility = new Utility();
    let mainOutput = new Output();
    setInput(mainInput);
    setUtility(mainInput, mainUtility);
    document.querySelectorAll("#algorithms input").forEach((element) => {
        if (element.checked == true) {
            setAlgorithmNameType(mainInput, element.id);
            if (element.id == 'rr') {
                roundrobin(mainInput, mainUtility, mainOutput);
            } else {
                algo(mainInput, mainUtility, mainOutput);
            }
        }
    });
    setOutput(mainInput, mainOutput);
    showOutput(mainInput, mainOutput, outputDiv);
}