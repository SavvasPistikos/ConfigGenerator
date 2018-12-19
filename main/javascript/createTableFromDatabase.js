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

function setDbResults(services) {
    let tbody = document.createElement("tbody");
    tbody.appendChild(createInsertRow());
    for (let s in services) {

        let tr = document.createElement("tr");

        let tdCheckbox = document.createElement("td");
        let importCheckbox = document.createElement("button");
        importCheckbox.className = "btn btn-secondary btn-sm";
        let div = document.createElement("div");
        let span = document.createElement("span");
        span.className = "glyphicon glyphicon-plus";
        importCheckbox.appendChild(span);
        //importCheckbox.innerHTML = "<span class=\"glyphicon glyphicon-stop\"></span>";
        importCheckbox.setAttribute("onclick", "importJson(this)");
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

function createInsertRow() {
    let tr = document.createElement("tr");
    let checkTd = document.createElement("td");
    let srvTd = document.createElement("td");
    let conTd = document.createElement("td");
    let verTd = document.createElement("td");

    srvTd.appendChild(createInputForm("Service", "srvTd"));
    conTd.appendChild(createInputForm("Content", "conTd"));
    verTd.appendChild(createInputForm("Version", "verTd"));

    let add = document.createElement("button");
    add.style.margin = "9px 0px 0px 0px";
    add.setAttribute("class", "btn btn-default");
    add.innerText = "Add";

    $(add).click(function () {
        var service = {
            'service': $('#srvTd').val(),
            'content': $('#conTd').val(),
            'swaggerurl': '',
            'version': $('#verTd').val()
        };
        if (service.content.startsWith("http")) {
            service = getSwaggerFromUrl(service.service, service.content);
        }
        saveSwagger(service);
    });

    tr.appendChild(checkTd);
    tr.appendChild(srvTd);
    tr.appendChild(conTd);
    tr.appendChild(verTd);
    tr.appendChild(add);

    return tr;
}

function addCrudButtons(trElement, serviceId) {
    let del = document.createElement("button");
    del.style.margin = "0 5px 0 0";
    del.setAttribute("class", "btn btn-danger");
    del.innerText = "Delete";

    $(del).click(function () {
        deleteSwagger(serviceId);
    });

    let info = document.createElement("button");
    info.style.margin = "0 5px 0 0";
    $(info).data("id", serviceId);
    info.setAttribute("class", "btn btn-info");
    info.innerText = "Info";
    info.setAttribute("data-toggle", "modal");
    info.setAttribute("data-target", "#swaggerInfo");
    info.setAttribute("onclick", "generateModal(this);");

    let upd = document.createElement("button");
    upd.style.margin = "0 5px 0 0";
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

function fillupModal(updateButtonElement) {
    let id = $(updateButtonElement).data("id");
    let service = getSwagger(id);

    $('#serviceId').val(id);
    $('#serviceName').val(service.service);
    $('#swaggerJson').val(service.content);
    $('#serviceSwaggerUrl').val(service.swaggerurl);
    $('#serviceVersion').val(service.version);
}