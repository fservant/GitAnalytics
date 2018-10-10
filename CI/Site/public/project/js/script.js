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

  for (var i = 0; i < blob.length; i++) {
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
}


function drawChart() {

}

loadJSON(function (response) {
  var actual_json = JSON.parse(response);
  tableCreate(actual_json);
});

function makePage() {
  drawChart();
}

window.onload = makePage;
