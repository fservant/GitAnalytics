

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

function breakTableCreate(blob) {
  var tbl = document.getElementById('breaks');
  var tbdy = document.createElement('tbody');
  var tr = document.createElement('tr');
  console.log(typeof blob);

  for (let [_key, elem] of Object.entries(blob)) {
    var tr = document.createElement('tr');
    var td = document.createElement('td');
    td.appendChild(document.createTextNode(_key));
    tr.appendChild(td);

    td = document.createElement('td');
    td.appendChild(document.createTextNode(elem.break));
    tr.appendChild(td);

    td = document.createElement('td');
    td.appendChild(document.createTextNode(elem.notbreak));
    tr.appendChild(td);

    td = document.createElement('td');
    td.appendChild(document.createTextNode(elem.fix));
    tr.appendChild(td);

    td = document.createElement('td');
    td.appendChild(document.createTextNode(elem.notfix));
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
      let utc = Date.UTC(from_date.getUTCFullYear(), from_date.getUTCMonth(), from_date.getUTCDate());
      adj_date = new Date(utc);
      map.set(utc, [adj_date, (map.has(utc) ? map.get(utc)[1] : 0) + 1]);
    }
  });
  let out_arr = [];
  for(let [key, val] of map.entries()) {
    out_arr.push(val);
  }
  return out_arr;
}

function calculateCalHeight(data) {
  var years = [];
  Object.values(data).forEach((elem) => {
    let from_date = dateFromISOString(elem.time);
    if(isValidDate(from_date)) {
      if (years.indexOf(from_date.getUTCFullYear()) < 0) {
        years.push(from_date.getUTCFullYear());
      }
    }
  });
  return years.length;
}

function calendarCreate(data) {
  let dataTable = new google.visualization.DataTable();
  dataTable.addColumn({ type: 'date', id: 'Date' });
  dataTable.addColumn({ type: 'number', id: 'Won/Loss' });
  dataTable.addRows(dataToDateMap(data));
  let chart = new google.visualization.Calendar(document.getElementById('calendar_basic'));
  let options = {
    title: "Builds By Date",
    height: calculateCalHeight(data) * 175,
  };
  chart.draw(dataTable, options);
}

function eventTypeCreate(data) {
  var cr_arr = [];
  var pr_arr = [];
  var push_arr = [];
  for (let [_key, elem] of Object.entries(blob)) {
    if (_key === 'cron') {
      cr_arr.push(['canceled', elem.canceled]);
      cr_arr.push(['errored', elem.errored]);
      cr_arr.push(['failed', elem.failed]);
      cr_arr.push(['passed', elem.passed]);
    }
    if (_key === 'pull_request') {
      pr_arr.push(['canceled', elem.canceled]);
      pr_arr.push(['errored', elem.errored]);
      pr_arr.push(['failed', elem.failed]);
      pr_arr.push(['passed', elem.passed]);
    }
    if (_key === 'push') {
      push_arr.push(['canceled', elem.canceled]);
      push_arr.push(['errored', elem.errored]);
      push_arr.push(['failed', elem.failed]);
      push_arr.push(['passed', elem.passed]);
    }
  }
  var options = {
    title: 'Cron'
  };

  var data = google.visualization.arrayToDataTable(cr_arr);
  var chart = new google.visualization.PieChart(document.getElementById('pie_cron'));
  chart.draw(data, options);

  var options = {
    title: 'Pull Requests'
  };

  var data = google.visualization.arrayToDataTable(pr_arr);
  var chart = new google.visualization.PieChart(document.getElementById('pie_pull'));
  chart.draw(data, options);

  var options = {
    title: 'Push'
  };

  var data = google.visualization.arrayToDataTable(push_arr);
  var chart = new google.visualization.PieChart(document.getElementById('pie_push'));
  chart.draw(data, options);
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

  db.collection("history").doc("rails").get().then((doc) => {
      tableCreate(doc.data());
      google.charts.setOnLoadCallback(calendarCreate(doc.data()));
  });
  db.collection("break").doc("rails").get().then((doc) => {
    breakTableCreate(doc.data());
    //google.charts.setOnLoadCallback(calendarCreate(doc.data()));
  });

  google.charts.load('current', {'packages':['corechart']});
  db.collection("build_type").doc("rails").get().then((doc) => {
    google.charts.setOnLoadCallback(eventTypeCreate(doc.data()));
});
}

window.onload = makePage;
