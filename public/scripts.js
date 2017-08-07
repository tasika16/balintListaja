var simulators = [
  { 'name': "Heavy Minigun Guy", 'identity': "T6000", 'cost': 20000 },
  { 'name': "Boba Fet", 'identity': "T5220", 'cost': 15000 }
];

var delete_btn = '';
var table_data = "<tr>";
var table_body = document.getElementById('dataTableBody');

buildTable();

function sumCost() {
  var sum = 0;
  for (var i = 0; i < simulators.length; i++) {
    sum += simulators[i].cost;
  }
  return sum;
}

function formatCurrency(simulator) {
  return simulator.cost.toString();
}

function buildTable() {
  var tr = "<tr>";
  var trc = "</tr>";
  var td = "<td>";
  var tdc = "</td>";
  var th = "<th>";
  var thc= "</th>";

  simulators.sort(customSort);
  removeTable();

  for (var i = 0; i < simulators.length; i++) {
    delete_btn = '<button type="button" class="icon-button" onclick="deleteRowFunction(' + i +
      ' )"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button>';
    table_data += td + simulators[i].name + tdc + td + simulators[i].identity + tdc + td + "$" +
      formatCurrency(simulators[i]) + tdc + td + delete_btn + tdc + trc;
  }

  var table_header = tr + th + "Name" + thc + th + "Type number" + thc + th + "Price" + 
  thc + th+ "" +thc + trc ;

  var table_footer = tr + td + " " + tdc + td + simulators.length.toString() + " simulators" + tdc + td + "$" +
    sumCost().toString() + " total" + tdc + td + tdc + trc;

  dataTableHead.innerHTML += table_header;
  table_body.innerHTML += table_data;
  dataTableFooter.innerHTML += table_footer;
}

function sumCostSearchTable(search_result) {
  var sum = 0;
  for (var i = 0; i < search_result.length; i++) {
    sum += search_result[i].cost;
  }
  return sum;
}

function filteredSimulators(query) {
  return simulators.filter(function (s) {
    return s.name.toLowerCase().indexOf(query.toLowerCase()) > -1
      || s.identity.toLowerCase().indexOf(query.toLowerCase()) > -1;
  });
}

function buildSearchTable() {
  var tr = "<tr>";
  var trc = "</tr>";
  var td = "<td>";
  var tdc = "</td>";
  var searched = document.getElementById("searchTxt").value.toString();

  if (searched.trim() == "") {
    document.getElementById("searchErrorLabel").innerHTML = "Please fill the search field!";
  }
  else {
    document.getElementById("searchErrorLabel").innerHTML = "";
    var search_result = filteredSimulators(searched);

    search_result.sort(customSort);
    removeTable();

    for (var i = 0; i < search_result.length; i++) {
      delete_btn = '<button type="button" class="icon-button"  onclick="deleteRowFunction(' + i +
        ' )"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button>';
      table_data += td + search_result[i].name + tdc + td + search_result[i].identity + tdc + td + "$" +
        search_result[i].cost.toString() + tdc + td + delete_btn + tdc + trc;
    }

    var table_header = tr + td + " " + tdc + td + search_result.length.toString() + " simulators" + tdc + td + "$" +
      sumCostSearchTable(search_result).toString() + " total" + tdc + trc;

    dataTableHead.innerHTML += table_header;
    table_body.innerHTML += table_data;
  }

}

function removeTable() {
  table_body.innerHTML = "";
  dataTableHead.innerHTML = "";
  table_data = "";
}

function customSort(a, b) {
  var name_a = a.name.toUpperCase();
  var name_b = b.name.toUpperCase();
  if (name_a < name_b) {
    return -1;
  }
  else if (name_a > name_b) {
    return 1;
  }
  return 0;
}

function checkedID(tmp_identity) {
  var is_ID = false;
  var i = 0;
  while (i < simulators.length && simulators[i].identity !== tmp_identity.trim()) {
    i++;
  }
  if (i < simulators.length) {
    return true;
  }
  else {
    return false;
  }
  return is_ID;
}

function htmlEncode(str) {
  str = str.toString();
  return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
}

function addDataArray() {

  var tmp_name = htmlEncode(document.getElementById("nameInpt").value);
  var tmp_identity = htmlEncode(document.getElementById("identifyInpt").value);
  var tmp_cost = htmlEncode(document.getElementById("costInpt").value);

  if (tmp_name.trim() === '' || tmp_identity.trim() === '' || tmp_cost.trim() === '') {
    document.getElementById("formErrorLabel").innerHTML = "Please fill every field!";
  }
  else if (checkedID(tmp_identity)) {
    document.getElementById("formErrorLabel").innerHTML = "This ID already exists!";
  }
  else if (!(Number.isInteger((parseInt(tmp_cost))))) {
    document.getElementById("formErrorLabel").innerHTML = "Please fill the cost field just number!";
  }
  else {
    document.getElementById("formErrorLabel").innerHTML = "";
    var simulator = {
      name: tmp_name,
      identity: tmp_identity,
      cost: parseInt(tmp_cost)
    };
    console.log(simulator);
    simulators.push(simulator);
    //removeTable();
    buildTable();
  }


}

function deleteRowFunction(btnIDX) {
  simulators.splice(btnIDX, 1);
  buildTable();
}