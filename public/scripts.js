var simulators = [
  { 'name': "Heavy Minigun Guy", 'type_number': "T6000", 'price': 20000 },
  { 'name': "Boba Fet", 'type_number': "T5220", 'price': 15000 }
];


buildTable(simulators);

function sumprice() {
  var sum = 0;
  for (var i = 0; i < simulators.length; i++) {
    sum += simulators[i].price;
  }
  return sum;
}

function formatCurrency(format_price) {
  format_price = format_price.toString();
  var counter = 0;
  format_price = format_price.split("").reverse();
  console.log(format_price);
  for (var i = 0; i < format_price.length; i++) {
    if (counter === 3) {
      format_price.splice(i, 0, ',');
      counter = 0;
    }
    else {
      counter++;
    }
  }
  format_price.splice(format_price.length, 0, "$");
  format_price = format_price.reverse().join("");
  console.log(format_price);
  return format_price;
}

function sumpriceSearchTable(search_result) {
  var sum = 0;
  for (var i = 0; i < search_result.length; i++) {
    sum += search_result[i].price;
  }
  return sum;
}

function filteredSimulators(query) {
  return simulators.filter(function (s) {
    return s.name.toLowerCase().indexOf(query.toLowerCase()) > -1
      || s.type_number.toLowerCase().indexOf(query.toLowerCase()) > -1;
  });
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

function buildTable(build_array) {
  var tr = "<tr>";
  var trc = "</tr>";
  var td = "<td>";
  var tdc = "</td>";
  var th = "<th>";
  var thc = "</th>";
  var delete_btn = '';
  var table_data = "<tr>";

  build_array.sort(customSort);
  for (var i = 0; i < build_array.length; i++) {
    delete_btn = '<button type="button" id="deleteBtn" class="icon-button" ><i class="fa fa-trash" aria-hidden="true"></i></button>';
    table_data += td + build_array[i].name + tdc + td + build_array[i].type_number + tdc + td +
      formatCurrency(build_array[i].price) + tdc + td + delete_btn + tdc + trc;
  }

  var table_header = tr + th + "Name" + thc + th + "Type number" + thc + th + "Price" +
    thc + th + "" + thc + trc;

  var table_footer = tr + td + " " + tdc + td + build_array.length.toString() + " simulators" + tdc + td +
    formatCurrency(sumprice()) + " total" + tdc + td + tdc + trc;

  $('#dataTableHead').html(table_header);
  $('#dataTableBody').html(table_data);
  $('#dataTableFooter').html(table_footer);
}

/*---SearchTable---*/
$("#searchTxt").on("keypress", function () {
  var searched = $('#searchTxt').val();
  var search_result = filteredSimulators(searched);
  search_result.sort(customSort);
  buildTable(search_result);
});

/*---Reset the table after search---*/
$('#searchTxt').on("keyup", function () {
  if (!this.value) {
    buildTable(simulators);
  }
});

function checkedID(tmp_type_number) {
  var is_ID;
  var i = 0;
  while (i < simulators.length && simulators[i].type_number !== tmp_type_number.trim()) {
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
  var tmp_type_number = htmlEncode($('#type_numberInpt').val());
  var tmp_price = htmlEncode($('#priceInpt').val());

  if (tmp_name.trim() === '' || tmp_type_number.trim() === '' || tmp_price.trim() === '') {
    $('#formErrorLabel').html("Please fill every field!");
  }
  else if (checkedID(tmp_type_number)) {
    $('#formErrorLabel').html("This ID already exists!");
  }
  else if (!(Number.isInteger((parseInt(tmp_price))))) {
    $('#formErrorLabel').html("Please fill the price field just number!");
  }
  else {
    $('#formErrorLabel').html("");
    var simulator = {
      name: tmp_name,
      type_number: tmp_type_number,
      price: parseInt(tmp_price)
    };
    simulators.push(simulator);
    buildTable(simulators);
    $("div").children().eq(2).children('input').val('');
  }
});

/*---Error label set zero---*/
$("div").children('input').on("keypress", function () {
  $(".formErLabel").html('');
});

/*---Delete row from table---*/
$('table').on("click", 'button', function () {
  console.log($(this).index(".icon-button"));
  simulators.splice(($(this).index(".icon-button")), 1);
  buildTable(simulators);
});
