function getSwagger(liService) {
    let jsontext = null;
    let url = host + basePath + "/swaggers/" + liService;
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

function saveSwagger(service) {
    $.ajax({
        'async': false,
        'global': false,
        'type': 'POST',
        'url': host + basePath + "/swaggers",
        'data': JSON.stringify(service),
        'contentType': 'application/json',
        'success': function (data) {
            $("#databasemanager").trigger('click', [true]);
        }
    });
}

function deleteSwagger(serviceId) {
    $.ajax({
        'async': false,
        'global': false,
        'url': host + basePath + "/swaggers/" + serviceId,
        'type': 'DELETE',
        'success': function () {
            $(this).parent().remove();
            $("#databasemanager").trigger('click', [true]);
        }
    });
}

function updateSwagger(service){
    $.ajax({
        'async': false,
        'global': false,
        'type': 'PUT',
        'url': host + basePath + "/swaggers",
        'data': JSON.stringify(service),
        'contentType': 'application/json',
        'success': function () {
            $('#InsertOrUpdateForm').modal('toggle');
            $("#databasemanager").trigger('click', [true]);
        }
    });
}

function getServices() {
    let services = null;

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

function getSwaggerFromUrl(serviceName,url) {
    let service = {service: serviceName};

    $.ajax({
        'async': false,
        'global': false,
        'type': 'GET',
        'url': url,
        'dataType': "text",
        'success': function (data) {
            let swagger = JSON.parse(data);
            service.swaggerurl = url;
            service.content = data;
            service.version = swagger.info.version;
        }
    });
    return service;
}

function getYaml(){
    let config = $("#input-field").val();
    let impJson = "";
    $.ajax({
        'async': false,
        'global': false,
        'url': host + basePath + "/yaml",
        'type': 'POST',
        'contentType': 'application/json',
        'data': config,
        'success': function (data) {
            impJson = data;
        }
    });
    return impJson;
}