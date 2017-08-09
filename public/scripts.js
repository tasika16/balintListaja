
var simulators = [
  { 'name': "Heavy Minigun Guy", 'identity': "T6000", 'cost': 20000 },
  { 'name': "Boba Fet", 'identity': "T5220", 'cost': 15000 }
];


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
  var thc = "</th>";
  var delete_btn = '';
  var table_data = "<tr>";
  //var table_body = $('#dataTableBody')[0];
  $('#dataTableBody').html("");
  $('#dataTableHead').html("");
  $('#dataTableFooter').html("");

  simulators.sort(customSort);
  //removeTable();

  for (var i = 0; i < simulators.length; i++) {
    delete_btn = '<button type="button" id="deleteBtn" class="icon-button" ><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button>';
    table_data += td + simulators[i].name + tdc + td + simulators[i].identity + tdc + td + "$" +
      formatCurrency(simulators[i]) + tdc + td + delete_btn + tdc + trc;
  }

  var table_header = tr + th + "Name" + thc + th + "Type number" + thc + th + "Price" +
    thc + th + "" + thc + trc;

  var table_footer = tr + td + " " + tdc + td + simulators.length.toString() + " simulators" + tdc + td + "$" +
    sumCost().toString() + " total" + tdc + td + tdc + trc;

  //dataTableHead.innerHTML += table_header;
  $('#dataTableHead').html(table_header);
  //table_body.innerHTML += table_data;
  $('#dataTableBody').html(table_data);
  //dataTableFooter.innerHTML += table_footer;
  $('#dataTableFooter').html(table_footer);
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

/*---SearchTable---*/
$("#searchTxt").on("keypress", function () {
  var tr = "<tr>";
  var trc = "</tr>";
  var td = "<td>";
  var tdc = "</td>";
  var th = "<th>";
  var thc = "</th>";
  var searched = $('#searchTxt').val();
  var delete_btn = '';
  var table_data = "<tr>";
  $('#dataTableBody').html("");
  $('#dataTableHead').html("");
  $('#dataTableFooter').html("");

  $('#searchErrorLabel').html("");
  var search_result = filteredSimulators(searched);

  search_result.sort(customSort);
  //removeTable(search_result.sort(customSort));

  for (var i = 0; i < search_result.length; i++) {
    delete_btn = '<button type="button" id="deleteBtn" class="icon-button" ><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button>';
    table_data += td + search_result[i].name + tdc + td + search_result[i].identity + tdc + td + "$" +
      formatCurrency(search_result[i]) + tdc + td + delete_btn + tdc + trc;
  }
  var table_header = tr + th + "Name" + thc + th + "Type number" + thc + th + "Price" +
    thc + th + "" + thc + trc;

  var table_footer = tr + td + " " + tdc + td + search_result.length.toString() + " simulators" + tdc + td + "$" +
    sumCostSearchTable(search_result).toString() + " total" + tdc + td + tdc + trc;

  //dataTableHead.innerHTML += table_header;
  $('#dataTableHead').html(table_header);
  //table_body.innerHTML += table_data;
  $('#dataTableBody').html(table_data);
  //dataTableFooter.innerHTML += table_footer;
  $('#dataTableFooter').html(table_footer);
});
/*---Reset the table after search---*/
$('#searchTxt').on("keyup", function () {
  if (!this.value) {
    buildTable();
  }
});

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

/*---Add new row to table---*/

$("#addDataToArray").on("click", function () {

  var tmp_name = htmlEncode($('#nameInpt').val());
  var tmp_identity = htmlEncode($('#identifyInpt').val());
  var tmp_cost = htmlEncode($('#costInpt').val());

  if (tmp_name.trim() === '' || tmp_identity.trim() === '' || tmp_cost.trim() === '') {
    $('#formErrorLabel').html("Please fill every field!");
  }
  else if (checkedID(tmp_identity)) {
    $('#formErrorLabel').html("This ID already exists!");
  }
  else if (!(Number.isInteger((parseInt(tmp_cost))))) {
    $('#formErrorLabel').html("Please fill the cost field just number!");
  }
  else {
    $('#formErrorLabel').html("");
    var simulator = {
      name: tmp_name,
      identity: tmp_identity,
      cost: parseInt(tmp_cost)
    };
    //console.log(simulator);
    simulators.push(simulator);

    //simulators.sort(customSort);
    //console.log(tmp_identity);
    //var new_row_idx = simulators.findIndex(s => s.identity === tmp_identity);
    //buildTableInsert(new_row_idx);

    buildTable();
    $("div").children().eq(2).children('input').val('');
  }
});


/*
function buildTableInsert(new_row_idx){
  var table = $('#dataTableBody')[0];
  var new_simulator = table.insertRow(new_row_idx);
  console.log(new_simulator.insertCell(0))
  var new_simulator_name = new_simulator.insertCell(0);
  var new_simulator_ID = new_simulator.insertCell(1);
  var new_simulator_cost = new_simulator.insertCell(2);
  var new_simulator_d_btn = new_simulator.insertCell(3);
 
  console.log(simulators[new_row_idx].name);
  $("#new_simulator_name").html(simulators[new_row_idx].name);
  $("#new_simulator_ID").html(simulators[new_row_idx].identity);
  $("#new_simulator_cost").html(simulators[new_row_idx].cost);
  $("#new_simulator_d_btn").html(simulators[new_row_idx].name);
 
  new_simulator_name = simulators[new_row_idx].name;
  new_simulator_ID = simulators[new_row_idx].identity;
  new_simulator_cost = simulators[new_row_idx].cost;
  new_simulator_d_btn = simulators[new_row_idx].name;
}*/

/*---Error label set zero---*/
$("div").children('input').on("keypress", function () {
  $(".formErLabel").html('');
});

function deleteRowFunction(btnIDX) {
  simulators.splice(btnIDX, 1);
  buildTable();
}

$('table').on("click", 'button', function () {
  console.log($(this).index(".icon-button"));
  simulators.splice(($(this).index(".icon-button")), 1);
  buildTable();
});
