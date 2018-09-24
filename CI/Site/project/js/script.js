

function tableCreate() {
    var body = document.getElementsByTagName('body')[0];
    var tbl = document.createElement('table');
    var tbdy = document.createElement('tbody');
    for(var i = 0; i < 3; i++) {
        var tr = document.createElement('tbody');
        for(var j = 0; j < 2; j++) {
            var td = document.createElement('td');
            td.appendChild(document.createTextNode('\u0020'))
            tr.appendChild(td);
        }
        tbdy.appendChild(tr);
    }
    tbl.appendChild(tbdy);
    body.appendChild(tbl);
}
tableCreate();