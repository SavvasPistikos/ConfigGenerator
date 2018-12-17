function saveConfiguration() {
    let jsonOutput = document.getElementById("jsonOutput");
    let apis = jsonOutput.innerHTML;
    $.ajax({
        'async': false,
        'global': false,
        'url': host + basePath + "/configuration",
        'type': 'POST',
        'contentType': 'application/json',
        'data': apis
    });
}

function getConfiguration(id) {
    let configuration = null;

    $.ajax({
        'async': false,
        'global': false,
        'url': host + basePath + "/configuration/" + id,
        'type': "GET",
        'dataType': "json",
        'success': function (data) {
            configuration = data;
        }
    });
    return configuration;
}