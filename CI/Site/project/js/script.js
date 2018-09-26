
function loadJSON(callback) {

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'rails50analysis.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

function tableCreate() {
    var tbl = document.getElementById('builds');
    var tbdy = document.createElement('tbody');
    var tr = document.createElement('tr');
    loadJSON(function(response) {
        var actual_json = JSON.parse(response)
        console.log(actual_json)
    })
    for(var i = 0; i < 3; i++) {
        var tr = document.createElement('tr');
            var td = document.createElement('td');
            td.appendChild(document.createTextNode('1234'));
            tr.appendChild(td);

            td = document.createElement('td');
            td.appendChild(document.createTextNode('hashcode here'));
            tr.appendChild(td);

            td = document.createElement('td');
            td.appendChild(document.createTextNode('alyssa'));
            tr.appendChild(td);

            td = document.createElement('td');
            td.appendChild(document.createTextNode('12:45'));
            tr.appendChild(td);

            td = document.createElement('td');
            td.appendChild(document.createTextNode('passed'));
            tr.appendChild(td);
        tbdy.appendChild(tr);
    }
    tbdy.append(tr);
    tbl.appendChild(tbdy);
}
window.onload = tableCreate;