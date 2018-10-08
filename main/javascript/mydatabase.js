function readJson(liService) {
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

function getServices() {
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
    $('.dropdown-menu a.test').on("click", function (e) {
        $(this).next('ul').toggle();
        e.stopPropagation();
        e.preventDefault();
    });

    $("#databasemanager").tab('show');
    $('#manageswaggers').attr("class","tab-pane fade in active");

    if ($('#manageswaggers').children().length === 0 || arg1 === true) {
        $('#manageswaggers').empty();
        getItemsFromDbAndDraw();
    }

});