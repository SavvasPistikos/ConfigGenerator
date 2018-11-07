function closeTab(closeTabButton) {
    //there are multiple elements which has .closeTab icon so close the tab whose close icon is clicked
    var tabContentId = $(closeTabButton).parent().attr("href");
    document.getElementById($(closeTabButton).parent().parent().data("checkboxId")).checked = false;
    //$('#' + $(closeTabButton).parent().parent().data("checkboxId")).prop('checked', false);
    $(closeTabButton).parent().parent().remove(); //remove li of tab
    $(tabContentId).remove(); //remove respective tab content
    let first = $('#services a:first'); // Select first tab
    if (first !== undefined) {
        $(first).tab('show');
    }
    list[tabContentId.replace("#div","")] = [];
    generate();

    let resetOutputArea = true;
    for (i in list) {
        resetOutputArea = resetOutputArea & (list[i].length === 0);
    }
    if (resetOutputArea) {
        document.getElementById("jsonOutput").innerHTML = "";
    }
}

$(document).ready(function () {
    $("#databasemanager").click(function (e, arg1) {
        if ($('#manageswaggers').children().length === 0 || arg1 === true) {
            $('#manageswaggers').empty();
            getItemsFromDbAndDraw();
        }
    });
});

function hideOtherTabs(tabelement) {

    let swaggersElement = document.getElementById("swaggers");
    let children = Array.from(swaggersElement.children);

    for (c in children) {
        if (children[c].id !== tabelement.id)
            children[c].setAttribute("class", "tab-pane fade");
    }
}

function setPreviousTab(a) {
    let children = $('#services').children();
    let index;

    children.each(function () {
    });
    for (c in children) {
        if (children[c].id !== "generate")
            if (children[c].attribute["href"].split("#")[1] === a.attribute["href"]) {
                index = c;
                return $(children[c - 1])
            }
    }
}

function updateService() {
    var service = {
        'id': $('#serviceId').val(),
        'service': $('#serviceName').val(),
        'content': $('#swaggerJson').val(),
        'swaggerurl': $('#serviceSwaggerUrl').val(),
        'version': $('#serviceVersion').val()
    };

    if (document.getElementById("urlUpdate").checked === true && service.swaggerurl !== '') {
        $.ajax({
            'async': false,
            'global': false,
            'type': 'GET',
            'url': service.swaggerurl,
            'dataType': "text",
            'success': function (data) {
                service.content = data;
            }
        });
    }
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
    document.getElementById("urlUpdate").checked = false;
}