function getSwaggerJsonFromDatabase(liService) {
    let jsontext = null;
    let url = host + basePath + "/swaggers/" + liService;
    /*    if (service === "internal") {
            url = "http://localhost:8080/api/v1.0/api-swagger/internal";
        }*/
    $.ajax({
        'async': false,
        'global': false,
        'url': url,
        'dataType': "json",
        'success': function (data) {
            jsontext = data;
        }
    });
    return jsontext;
}

function getAllServicesFromDatabase() {
    var services = null;

    $.ajax({
        'async': false,
        'global': false,
        'url': host + basePath + "/swaggers",
        'dataType': "json",
        'success': function (data) {
            services = data;
        }
    });
    return services;
}

$(document).ready(function () {
    createInternalApisTab();
    $('.dropdown-menu a.test').on("click", function (e) {
        $(this).next('ul').toggle();
        e.stopPropagation();
        e.preventDefault();
    });

    $("#databasemanager").tab('show');
    $('#manageswaggers').attr("class", "tab-pane fade in active");

    if ($('#manageswaggers').children().length === 0 || arg1 === true) {
        $('#manageswaggers').empty();
        getItemsFromDbAndDraw();
    }

});

function writeToDatabase(internalPath) {
    $.ajax({
        'async': false,
        'global': false,
        'url': "http://localhost:8080/api/v1.0/internal",
        'type': 'POST',
        'contentType': 'application/json',
        'data': JSON.stringify(internalPath, null, 2)
    });
}

function getInternalPaths() {
    let internalPaths = null;

    $.ajax({
        'async': false,
        'global': false,
        'url': "http://localhost:8080/api/v1.0/internal",
        'dataType': "json",
        'success': function (data) {
            internalPaths = data;
        }
    });
    return internalPaths;
}

function getInternalPath(id) {
    let internalPath = null;

    $.ajax({
        'async': false,
        'global': false,
        'url': "http://localhost:8080/api/v1.0/internal/" + id,
        'type': "GET",
        'dataType': "json",
        'success': function (data) {
            internalPath = data;
        }
    });
    return internalPath;
}