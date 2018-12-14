function saveInternalPath(internalPath) {
    $.ajax({
        'async': false,
        'global': false,
        'url': host + basePath + "/internal",
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
        'url': host + basePath + "/internal",
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
        'url': host + basePath + "/internal/" + id,
        'type': "GET",
        'dataType': "json",
        'success': function (data) {
            internalPath = data;
        }
    });
    return internalPath;
}