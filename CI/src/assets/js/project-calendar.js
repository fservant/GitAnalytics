function tableCreate(blob) {
  var tbl = document.getElementById('builds');
  var tbdy = document.createElement('tbody');
  var tr = document.createElement('tr');
  console.log(typeof blob);

  for (let [_key, elem] of Object.entries(blob)) {
    var tr = document.createElement('tr');
    var td = document.createElement('td');
    td.appendChild(document.createTextNode(elem.number));
    td.setAttribute('align', 'right')
    tr.appendChild(td);

    td = document.createElement('td');
    td.appendChild(document.createTextNode(elem.hash));
    tr.appendChild(td);

    td = document.createElement('td');
    td.appendChild(document.createTextNode(elem.owner));
    tr.appendChild(td);

    td = document.createElement('td');
    td.appendChild(document.createTextNode(elem.time));
    tr.appendChild(td);

    td = document.createElement('td');
    td.appendChild(document.createTextNode(elem.status));
    tr.appendChild(td);
    tbdy.appendChild(tr);
  }

  tbdy.append(tr);
  tbl.appendChild(tbdy);
}
function isValidDate(d) {
  return Object.prototype.toString.call(d) === "[object Date]" && d instanceof Date && !isNaN(d);
}

function dateFromISOString(s) {
  return new Date(new Date().setTime(Date.parse(s)));
}

function dataToDateMap(data) {
  let map = new Map();
  Object.values(data).forEach((elem) => {
    let from_date = dateFromISOString(elem.time);
    if(isValidDate(from_date)) {
      let utc = Date.UTC(from_date.getUTCFullYear(), from_date.getMonth(), from_date.getDay());
      map.set(utc, (map.has(utc) ? map.get(utc) : 0) + 1);
    }
  });
  let out_arr = [];
  for(let [key, val] of map.entries()) {
    out_arr.push([new Date(key), val]);
  }
  return out_arr;
}

function calendarCreate(data) {
  debugger;
  let dataTable = new google.visualization.DataTable();
  dataTable.addColumn({ type: 'date', id: 'Date' });
  dataTable.addColumn({ type: 'number', id: 'Won/Loss' });
  dataTable.addRows(dataToDateMap(data));
  let chart = new google.visualization.Calendar(document.getElementById('calendar_basic'));
  let options = {
    title: "Builds By Date",
    height: 350,
  };
  chart.draw(dataTable, options);
}


function makePage() {
  if (!firebase.apps.length) {
    firebase.initializeApp({
      apiKey: "AIzaSyDtPErxE8ob3bR0k3E2iJF1aNVfpnq9Skk",
      authDomain: "continuous-integration-a9f3c.firebaseapp.com",
      databaseURL: "https://continuous-integration-a9f3c.firebaseio.com",
      projectId: "continuous-integration-a9f3c",
      storageBucket: "continuous-integration-a9f3c.appspot.com",
      messagingSenderId: "821526453812"
    });
  }
  // Initialize Cloud Firestore through Firebase
  var db = firebase.firestore();
  // Disable deprecated features
  db.settings({
    timestampsInSnapshots: true
  });
  google.charts.load("current", {packages:["calendar"]});

  db.collection("history").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      tableCreate(doc.data());
      google.charts.setOnLoadCallback(calendarCreate(doc.data()));
    });
  });
}

window.onload = makePage;