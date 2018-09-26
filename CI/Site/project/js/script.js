
function tableCreate() {
    var tbl = document.getElementById('builds');
    var tbdy = document.createElement('tbody');
    var tr = document.createElement('tr');

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