
function loadJSON(callback) {

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'rails50SimpleHistory.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

function tableCreate(blob) {
    var tbl = document.getElementById('builds');
    var tbdy = document.createElement('tbody');
    var tr = document.createElement('tr');

    for(var i = 0; i < blob.length; i++) {
        var tr = document.createElement('tr');
            var td = document.createElement('td');
            td.appendChild(document.createTextNode(blob[i].number));
            td.setAttribute('align', 'right')
            tr.appendChild(td);

            td = document.createElement('td');
            td.appendChild(document.createTextNode(blob[i].hash));
            tr.appendChild(td);

            td = document.createElement('td');
            td.appendChild(document.createTextNode(blob[i].owner));
            tr.appendChild(td);

            td = document.createElement('td');
            td.appendChild(document.createTextNode(blob[i].time));
            tr.appendChild(td);

            td = document.createElement('td');
            td.appendChild(document.createTextNode(blob[i].status));
            tr.appendChild(td);
        tbdy.appendChild(tr);
    }
    tbdy.append(tr);
    tbl.appendChild(tbdy);
    var body = document.getElementsByName('body')[0];
    var d3 = Object.assign({}, require("d3-format"), require("d3-geo"), require("d3-geo-projection"));
    body.appendChild(d3);

}


function drawChart() {
    // var gscript = document.createElement('script');
    // gscript.setAttribute('src', "https://www.gstatic.com/charts/loader.js");
    // document.head.appendChild(gscript);
    // gscript.google.charts.load("current", {packages:["calendar"]});
    // gscript.google.charts.setOnLoadCallback(drawChart);
    //
    // var dataTable = new google.visualization.DataTable();
    // dataTable.addColumn({ type: 'date', id: 'Date' });
    // dataTable.addColumn({ type: 'number', id: 'Won/Loss' });
    // dataTable.addRows([
    //     [ new Date(2012, 3, 13), 37032 ],
    //     [ new Date(2012, 3, 14), 38024 ],
    //     [ new Date(2012, 3, 15), 38024 ],
    //     [ new Date(2012, 3, 16), 38108 ],
    //     [ new Date(2012, 3, 17), 38229 ],
    //     // Many rows omitted for brevity.
    //     [ new Date(2013, 9, 4), 38177 ],
    //     [ new Date(2013, 9, 5), 38705 ],
    //     [ new Date(2013, 9, 12), 38210 ],
    //     [ new Date(2013, 9, 13), 38029 ],
    //     [ new Date(2013, 9, 19), 38823 ],
    //     [ new Date(2013, 9, 23), 38345 ],
    //     [ new Date(2013, 9, 24), 38436 ],
    //     [ new Date(2013, 9, 30), 38447 ]
    // ]);
    //
    // var chart = new google.visualization.Calendar(document.getElementById('calendar_basic'));
    //
    // var options = {
    //     title: "Builds By Date",
    //     height: 300,
    // };
    //
    // chart.draw(dataTable, options);
}
loadJSON(function(response) {
    var actual_json = JSON.parse(response);
    tableCreate(actual_json);
});

function makePage() {
    drawChart();
}
window.onload = makePage;