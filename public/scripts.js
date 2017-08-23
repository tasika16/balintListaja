function ajaxReq(setType, setUrl, data = "") {
  return $.ajax({
    type: setType,
    url: setUrl,
    contentType: 'application/json',
    dataType: 'json',
    data: data,
    processData: false
  })
}

ajaxRexGet();

function ajaxRexGet() {
  ajaxReq('GET', '/api/simulators')
    .done(function (res) {
      buildTable(res.content);
    });
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
  for (var i = 0; i < build_array.length; i++) {
    delete_btn = '<button type="button" id="deleteBtn" class="icon-button" data-simulator_id="' + build_array[i].id +
      '"><i class="fa fa-trash" aria-hidden="true"></i></button>';
    table_data += td + build_array[i].name + tdc + td +
      build_array[i].type_number + tdc + td +
      formatCurrency(build_array[i].price) + tdc + td + delete_btn + tdc + trc;
  }

  var table_header = tr + th + "Name" + thc + th
    + "Type number" + thc + th + "Price"
    + thc + th + "" + thc + trc;

  var table_footer = tr + td + " " + tdc + td
    + build_array.length.toString() + " simulators" + tdc + td +
    formatCurrency(sumprice(build_array)) + " total" + tdc + td + tdc + trc;

  $('#dataTableHead').html(table_header);
  $('#dataTableBody').html(table_data);
  $('#dataTableFooter').html(table_footer);
}

/*---SearchTable---*/
$("#searchTxt").on("keyup", function () {
  var searched = $('#searchTxt').val();
  ajaxReq('GET', '/api/simulators?search=' + searched)
    .done(function (res) {
      buildTable(res.content);
    })
});

/*---Reset the table after search---*/
$('#searchTxt').on("keyup", function () {
  if (!this.value) {
    ajaxRexGet()
  }
});

$("#addDataToArray").on("click", function (event) {

  var tmp_name = htmlEncode($('#nameInpt').val());
  var tmp_type_number = htmlEncode($('#type_numberInpt').val());
  var tmp_price = htmlEncode($('#priceInpt').val());

  if (tmp_name.trim() === '' || tmp_type_number.trim() === '' || tmp_price.trim() === '') {
    $('#formErrorLabel').html("Please fill every field!");
  }
  else if (checkedID(tmp_type_number)) {
    $('#formErrorLabel').html("This Type number already exists!");
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
    ajaxReq('POST', '/api/simulators', JSON.stringify(simulator))
      .done(function (res) {
        $('.addToTableClass').val('');
        ajaxRexGet();
      })
  }
});

/*---Error label set zero---*/
$("div").children('input').on("keypress", function () {
  $(".formErLabel").html('');
});

/*---Delete row from table---*/
$('table').on("click", 'button', function () {
  ajaxReq('DELETE', '/api/simulators/' + $(this).data('simulator_id'))
    .done(function (res) {
      ajaxRexGet();
    })
});

function sumprice(build_array) {
  var sum = 0;
  for (var i = 0; i < build_array.length; i++) {
    sum += build_array[i].price;
  }
  return sum;
}

function formatCurrency(fprice) {
  return '$' + fprice.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
}

function checkedID(tmp_type_number) {
  var is_ID;
  var i = 0;
  ajaxReq('GET', '/api/simulators')
    .done(function (data) {
      while (i < data.length && data[i].type_number !== tmp_type_number.trim()) {
        i++;
      }
      if (i < data.length) {
        return true;
      }
      else {
        return false;
      }
      return is_ID;
    });
}

function htmlEncode(str) {
  str = str.toString();
  return str.replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
