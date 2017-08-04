var simulators = [
    { name: "Heavy Minigun Guy", identity: "T6000", cost: 20000 },
    { name: "Boba Fet", identity: "T5220", cost: 15000 }
];

var tr = "<tr>";
var trc = "</tr>";
var td = "<td>";
var tdc = "</td>";
var deleteBtn = '';
var tableData = "<tr>";
var tableBody = document.getElementById('dataTableBody');

buildTable();

function sumCost() {
    var sum = 0;
    for (var i = 0; i < simulators.length; i++) {
        sum += simulators[i].cost;
    }
    return sum;
}

function buildTable() {
    customSort();
    removeTable();
    for (var i = 0; i < simulators.length; i++) {
        deleteBtn = '<button type="button" class="icon-button" onclick="deleteRowFunction(' + i +
            ' )"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button>';
        tableData += td + simulators[i].name + tdc + td + simulators[i].identity + tdc + td + "$" +
            simulators[i].cost.toString() + tdc + td + deleteBtn + tdc + trc;
    }

    var tableHeader = tr + td + " " + tdc + td + simulators.length.toString() + " simulators" + tdc + td + "$" +
        sumCost().toString() + " total" + tdc + trc;

    dataTableHead.innerHTML += tableHeader;
    tableBody.innerHTML += tableData;
}

function sumCostSearchTable(searchResult) {
    var sum = 0;
    for (var i = 0; i < searchResult.length; i++) {
        sum += searchResult[i].cost;
    }
    return sum;
}

function filteredSimulators(query) {
    return simulators.filter(function (s) {
        return s.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
    })
}

function filteredSimulatorsByID(query) {
    return simulators.filter(function (s) {
        return s.identity.toLowerCase().indexOf(query.toLowerCase()) > -1;
    })
}

function buildSearchTable() {
    var searched = document.getElementById("searchTxt").value.toString();
    if (searched.trim() == "") {
        document.getElementById("searchErrorLabel").innerHTML = "Please fill the search field!";
    }
    else {
        document.getElementById("searchErrorLabel").innerHTML = "";
        var searchResult = filteredSimulators(searched);
        console.log(searchResult);
        console.log(filteredSimulators(searched));
        if (0 == searchResult.length) {
            console.log("Most pedig lefutatom a másikat")
            searchResult = filteredSimulatorsByID(searched);
        }

        customSearchSort(searchResult);
        removeTable();

        for (var i = 0; i < searchResult.length; i++) {
            deleteBtn = '<button type="button" class="icon-button"  onclick="deleteRowFunction(' + i +
                ' )"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button>';
            tableData += td + searchResult[i].name + tdc + td + searchResult[i].identity + tdc + td + "$" +
                searchResult[i].cost.toString() + tdc + td + deleteBtn + tdc + trc;
        }

        var tableHeader = tr + td + " " + tdc + td + searchResult.length.toString() + " simulators" + tdc + td + "$" +
            sumCostSearchTable(searchResult).toString() + " total" + tdc + trc;
        var table = tableHeader + tableData;
        tableBody.innerHTML += table;
    }

}

function removeTable() {
    tableBody.innerHTML = "";
    dataTableHead.innerHTML = "";
    tableData = "";
}

function customSort() {
    simulators.sort(function (a, b) {
        var nameA = a.name.toUpperCase();
        var nameB = b.name.toUpperCase();
        if (nameA < nameB) {
            return -1;
        }
        else if (nameA > nameB) {
            return 1;
        }
        return 0;
    })
}

function customSearchSort(searchResult) {
    searchResult.sort(function (a, b) {
        var nameA = a.name.toUpperCase();
        var nameB = b.name.toUpperCase();
        if (nameA < nameB) {
            return -1;
        }
        else if (nameA > nameB) {
            return 1;
        }
        return 0;
    });
}

function checkedID(tmpIdentity) {
    var isID = false;
    for (var i = 0; i < simulators.length; i++) {
        if (simulators[i].identity === tmpIdentity.trim()) {
            isID = true;
        }
    }
    return isID;
}

function addDataArray() {

    var tmpName = document.getElementById("nameInpt").value;
    var tmpIdentity = document.getElementById("identifyInpt").value;
    var tmpCost = document.getElementById("costInpt").value;


    if (tmpName.trim() === '' || tmpIdentity.trim() === '' || tmpCost.trim() === '') {
        document.getElementById("formErrorLabel").innerHTML = "Please fill every field!";
    }
    else if (checkedID(tmpIdentity))
    { document.getElementById("formErrorLabel").innerHTML = "This Identity is already exists!"; }
    else if ((Number.isInteger((parseInt(tmpCost)))) == false) {
        document.getElementById("formErrorLabel").innerHTML = "Please fill the cost field just number!";
    }
    else {
        document.getElementById("formErrorLabel").innerHTML = "";
        var simulator = {
            name: tmpName,
            identity: tmpIdentity,
            cost: parseInt(tmpCost)
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