$(function () {
    $("#services").on("click", "a", function (e) {
        e.preventDefault();
        $(this).tab('show');
        registerCloseEvent();
        $currentTab = $(this);
        //$previousTab = setPreviousTab(this);

    });
});

$(document).ready(function () {
    $("#databasemanager").click(function (e, arg1) {
        if ($('#manageswaggers').children().length === 0 || arg1 === true) {
            $('#manageswaggers').empty();
            getItemsFromDbAndDraw();
        }
    });
});

function registerCloseEvent() {
    $(".closeTab").click(function () {
        //there are multiple elements which has .closeTab icon so close the tab whose close icon is clicked
        var tabContentId = $(this).parent().attr("href");
        $('#' + $(this).parent().parent().data("checkboxId")).prop('checked', false);
        $(this).parent().parent().remove(); //remove li of tab
        $('#swaggers a:last').tab('show'); // Select first tab
        list[$(tabContentId).data("service")] = [];
        generate();
        $(tabContentId).remove(); //remove respective tab content

        let resetoutputarea = true;
        for (i in list) {
            resetoutputarea = resetoutputarea & (list[i].length === 0);
        }
        if (resetoutputarea) {
            document.getElementById("jsonOutput").innerHTML = "";
        }

    });
}

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

function getItemsFromDbAndDraw() {
    let container = document.createElement("div");
    container.setAttribute("class", "container");
    let respTable = document.createElement("div");
    respTable.setAttribute("class", "table-responsive");
    let table = document.createElement("table");
    table.setAttribute("class", "table");
    respTable.appendChild(table);
    container.appendChild(respTable);

    table.appendChild(setCols());
    table.appendChild(setDbResults(getServices()));
    let div = document.getElementById("manageswaggers");
    div.appendChild(container);
}

function setCols() {
    let thr = document.createElement("thead");
    let tr = document.createElement("tr");

    let thCheck = document.createElement("th");
    thCheck.innerText = "Add To Configuration";
    tr.appendChild(thCheck);
    let thSer = document.createElement("th");
    thSer.innerText = "Service";
    tr.appendChild(thSer);
    let thCon = document.createElement("th");
    thCon.innerText = "Content";
    tr.appendChild(thCon);
    let thVer = document.createElement("th");
    thVer.innerText = "Version";
    tr.appendChild(thVer);
    thr.appendChild(tr);
    return tr;
}

function setDbResults(services) {
    let tbody = document.createElement("tbody");
    tbody.appendChild(createInsertRow());
    for (let s in services) {

        let tr = document.createElement("tr");

        let tdCheckbox = document.createElement("td");
        let importCheckbox = document.createElement("input");
        importCheckbox.setAttribute("onchange", "importJson(this)");
        importCheckbox.setAttribute("type", "checkbox");
        importCheckbox.id = services[s].service + services[s].version;

        $(importCheckbox).data("id", services[s].id);
        $(importCheckbox).data("service", services[s].service);
        $(importCheckbox).data("version", services[s].version);
        tdCheckbox.appendChild(importCheckbox);

        let tdServ = document.createElement("td");
        tdServ.innerText = services[s].service;

        let tdCont = document.createElement("td");
        tdCont.innerText = "";

        let tdVer = document.createElement("td");
        tdVer.innerText = services[s].version;

        tr.appendChild(tdCheckbox);
        tr.appendChild(tdServ);
        tr.appendChild(tdCont);
        tr.appendChild(tdVer);
        addCrudButtons(tr, services[s].id);

        tbody.appendChild(tr);
    }
    return tbody;
}

function addCrudButtons(trElement, serviceId) {
    let del = document.createElement("button");
    del.setAttribute("class", "btn btn-danger");
    del.innerText = "Delete";

    $(del).click(function () {
        let url = host + basePath + "/swaggers/" + serviceId;
        $.ajax({
            'async': false,
            'global': false,
            'url': url,
            'type': 'DELETE',
            'success': function () {
                $(this).parent().remove();
                $("#databasemanager").trigger('click', [true]);
            }
        });
    });

    let info = document.createElement("button");
    $(info).data("id", serviceId);
    info.setAttribute("class", "btn btn-info");
    info.innerText = "Info";
    info.setAttribute("data-toggle", "modal");
    info.setAttribute("data-target", "#swaggerInfo");
    info.setAttribute("onclick", "generateModal(this);");

    let upd = document.createElement("button");
    $(upd).data("id", serviceId);
    upd.setAttribute("class", "btn btn-primary");
    upd.innerText = "Update";
    upd.setAttribute("data-toggle", "modal");
    upd.setAttribute("data-target", "#InsertOrUpdateForm");
    upd.setAttribute("onclick", "fillupModal(this);");

    trElement.appendChild(del);
    trElement.appendChild(info);
    trElement.appendChild(upd);
}

function generateModal(infoButton) {
    let swaggerid = $(infoButton).data("id");
    let swaggerDTO = readJson(swaggerid);
    let modalDiv = document.createElement("div");
    modalDiv.setAttribute("class", "modal fade");
    modalDiv.id = "swaggerInfo";
    modalDiv.setAttribute("role", "dialog");

    let modalDialog = document.createElement("div");
    modalDialog.className = "modal-dialog";

    modalDiv.appendChild(modalDialog);


    let modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    modalDialog.appendChild(modalContent);

    let modalHeader = document.createElement("div");
    modalHeader.className = "modal-header";
    modalHeader.innerHTML = "<h4 class=\"modal-title\">" + swaggerDTO.service + "\t" + swaggerDTO.version + "</h4>";
    modalContent.appendChild(modalHeader);

    let modalBody = document.createElement("div");
    modalBody.className = "modal-body";
    modalBody.innerText = swaggerDTO.content;
    modalContent.appendChild(modalBody);

    let modalFooter = document.createElement("div");
    modalFooter.className = "modal-footer";
    let footerButton = document.createElement("button");
    footerButton.setAttribute("class", "btn btn-default");
    footerButton.setAttribute("data-dismiss", "modal");
    footerButton.innerText = "Close";
    $(footerButton).click(function () {
        $('#swaggerInfo').remove();
        $('.modal-backdrop').remove();
    });
    modalFooter.appendChild(footerButton);
    modalContent.appendChild(modalFooter);

    let modalContainer = document.getElementById("modals");
    modalContainer.appendChild(modalDiv);
}

function fillupModal(updateButtonElement) {
    let id = $(updateButtonElement).data("id");
    let service = readJson(id);

    $('#serviceId').val(id);
    $('#serviceName').val(service.service);
    $('#swaggerJson').val(service.content);
    $('#serviceVersion').val(service.version);
}

function updateService() {

    var service = {
        'id': $('#serviceId').val(),
        'service': $('#serviceName').val(),
        'content': $('#swaggerJson').val(),
        'version': $('#serviceVersion').val()
    };

    $.ajax({
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

function createInsertRow() {
    let tr = document.createElement("tr");
    let checkTd = document.createElement("td");
    let srvTd = document.createElement("td");
    let conTd = document.createElement("td");
    let verTd = document.createElement("td");

    srvTd.appendChild(createInputText("", "srvTd"));
    conTd.appendChild(createInputText("", "conTd"));
    verTd.appendChild(createInputText("", "verTd"));

    let add = document.createElement("button");
    add.setAttribute("class", "btn btn-default");
    add.innerText = "Add";

    $(add).click(function () {

        var service = {
            'service': $('#srvTd').val(),
            'content': $('#conTd').val(),
            'version': $('#verTd').val()
        };

        $.ajax({
            'type': 'POST',
            'url': host + basePath + "/swaggers",
            'data': JSON.stringify(service),
            'contentType': 'application/json',
            'success': function () {
                $("#databasemanager").trigger('click', [true]);
            }
        });

    });

    tr.appendChild(checkTd);
    tr.appendChild(srvTd);
    tr.appendChild(conTd);
    tr.appendChild(verTd);
    tr.appendChild(add);

    return tr;
}