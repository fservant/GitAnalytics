
function tableCreate(blob) {
    var tbl = document.getElementById('builds');
    var tbdy = document.createElement('tbody');
    var tr = document.createElement('tr');
    console.log(typeof blob);

    for (let [_key, elem] of Object.entries(blob)) {
      console.log(elem)
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

function makePage() {
    // Initialize Cloud Firestore through Firebase
    var db = firebase.firestore();
    // Disable deprecated features
    db.settings({
        timestampsInSnapshots: true
    });

    db.collection("history").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()[50554]}`);
      console.log(doc.data()[50554])
      tableCreate(doc.data())
    });
  });
}

window.onload = makePage;
