var simulators = '';
ajaxReq('GET', '/api/simulators');

function ajaxReq(setType, setUrl, getOutput = false) {
  $.ajax({
    type: setType,
    url: setUrl,
    contentType: 'application/json',
    dataType: 'json',
    //data: JSON.stringify(simulator),
    //processData: false,
    success: function (data) {
      if (getOutput === true) {
        handleData(data);
      }
      if (setType === 'GET' && getOutput === false) {
        buildTable(data.content);
      }
      else if (setType === 'DELETE' && getOutput === false) {
        ajaxReq('GET', '/api/simulators');
      }
    }
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
  ajaxReq('GET', '/api/simulators?search=' + searched);
});

/*---Reset the table after search---*/
$('#searchTxt').on("keyup", function () {
  if (!this.value) {
    ajaxReq('GET', '/api/simulators');
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
    // ezzel itt kéne valamit kezdeni csak nem tudom mit :( )
    $.ajax({
      url: '/api/simulators',
      type: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify(simulator),
      processData: false,
      success: function (data) {
        $("div").children().eq(2).children('input').val('');
        ajaxReq('GET', '/api/simulators');
      }
    });
  }
});

/*---Error label set zero---*/
$("div").children('input').on("keypress", function () {
  $(".formErLabel").html('');
});

/*---Delete row from table---*/
$('table').on("click", 'button', function () {
  ajaxReq('DELETE', '/api/simulators/' + $(this).data('simulator_id'));
});

function sumprice(build_array) {
  var sum = 0;
  for (var i = 0; i < build_array.length; i++) {
    sum += build_array[i].price;
  }
  return sum;
}

function formatCurrency(format_price) {
  format_price = format_price.toString();
  var counter = 0;
  format_price = format_price.split("").reverse();
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
  return format_price;
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

function checkedID(tmp_type_number) {
  var is_ID;
  var i = 0;
  ajaxReq('GET', '/api/simulators', true, function (data) {
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
