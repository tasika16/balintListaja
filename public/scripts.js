hideErrMessage();

function ajaxReq(setType, setUrl, data = "") {
  if (setType === 'POST') { data = JSON.stringify(data); }
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
      buildTable(res);
    })
    .fail(function (jqXHR, status, err) {
      if (jqXHR.readyState == 0) {
        $('.connection-error').show();
      }
    })
}

function buildTable(build_array) {
  hideErrMessage();
  var tr = "<tr>";
  var trc = "</tr>";
  var td = "<td>";
  var tdc = "</td>";
  var th = "<th>";
  var thc = "</th>";
  var delete_btn = '';
  var table_data = "<tr>";
  for (var i = 0; i < build_array.length; i++) {
    delete_btn = '<button type="button" id="deleteBtn"' +
      'class="icon-button delete-button"' +
      'data-simulator_id="' + build_array[i].id +
      '"><i class="fa fa-trash fa-lg" aria-hidden="true"></i></button>';

    table_data += td + build_array[i].name + tdc + td +
      build_array[i].type_number + tdc + td +
      formatCurrency(build_array[i].price) + tdc + td + delete_btn + tdc + trc;
  }

  var aggregateRow = build_array.length.toString() + ' simulators' + ' '
    + formatCurrency(sumprice(build_array)) + ' total';

  var table_header = tr + th + "Name" + thc + th
    + "Type number" + thc + th + "Price"
    + thc + th + "" + thc + trc;

  $('#aggregateRow').html(aggregateRow);
  $('#dataTableHead').html(table_header);
  $('#dataTableBody').html(table_data);
}

/*---SearchTable---*/
$("#searchTxt").on("keyup", function () {
  var searched = 'search=' + $('#searchTxt').val();
  ajaxReq('GET', '/api/simulators', searched)
    .done(function (res) {
      buildTable(res);
    })
});

/*---Reset the table after search---*/
$('#searchTxt').on("keyup", function () {
  if (!this.value) {
    ajaxRexGet()
  }
});

/*Add simulator to table*/
$("#addDataToArray").on("click", function (event) {
  var tmp_name = htmlEncode($('#nameInpt').val());
  var tmp_type_number = htmlEncode($('#type_numberInpt').val());
  var tmp_price = htmlEncode($('#priceInpt').val());

  if (tmp_name.trim() === '' || tmp_type_number.trim() === '' || tmp_price.trim() === '') {
    writeError('Please fill every field!');
  }
  else if (!(Number.isInteger((parseInt(tmp_price))))) {
    writeError('Please fill the price field just number!');
  }
  else {
    $('.custom-error').hide();
    var simulator = {
      name: tmp_name,
      type_number: tmp_type_number,
      price: parseInt(tmp_price)
    };
    ajaxReq('POST', '/api/simulators', simulator)
      .done(function (res) {
        $('.addToTableClass').val('');
        ajaxRexGet();
      })
      .fail(function (jqXHR, status, err) {
        if (jqXHR.readyState == 0) {
          hideConnErrMessage();
        }
        writeError(jqXHR.responseJSON.error);
      })
  }
});

function writeError(msg) {
  $('.custom-error').show().children().html(msg);
}

function hideErrMessage() {
  $('.custom-error').hide();
  $('.connection-error').hide();
}

/*---Error label set zero---*/
$("div").children('input').on("keypress", function () {
  $(".custom-error").hide('');
});

/*---Delete row from table---*/
$('table').on("click", 'button', function () {
  ajaxReq('DELETE', '/api/simulators/' + $(this).data('simulator_id'))
    .done(function (res) {
      $('.custom-error').hide('');
      ajaxRexGet();
    })
    .fail(function (jqXHR, status, err) {
      if (jqXHR.readyState == 0) {
        hideConnErrMessage();
      }
    })
});

$('.close-button').on('click', 'i', function(){
  $('.connection-error').hide('');
});

function hideConnErrMessage() {
  $('.connection-error').show();
  setTimeout(function(){
    if ($('.connection-errror').show()) {
      $('.connection-error').hide('');
    }
  }, 20000);
}

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

function htmlEncode(str) {
  str = str.toString();
  return str.replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
