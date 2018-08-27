$(function () {
    $("#services").on("click", "a", function (e) {
        e.preventDefault();

        $(this).tab('show');
        registerCloseEvent();
        $currentTab = $(this);
        //$previousTab = setPreviousTab(this);

    });
});

function registerCloseEvent() {

    $(".closeTab").click(function () {

        //there are multiple elements which has .closeTab icon so close the tab whose close icon is clicked
        var tabContentId = $(this).parent().attr("href");
        $(this).parent().parent().remove(); //remove li of tab
        $('#swaggers a:last').tab('show'); // Select first tab
        $(tabContentId).remove(); //remove respective tab content
        listt[tabContentId.split("div")[1]] = [];

        let resetoutputarea = true;
        for (i in listt) {
            resetoutputarea = resetoutputarea & (listt[i].length === 0);
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

$(document).ready(function () {
    $("#m").click(function () {
        getItemsFromDbAndDraw();
    });
});

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
    for (let s in services) {

        let tr = document.createElement("tr");

        let tdServ = document.createElement("td");
        tdServ.innerText = services[s].service;

        let tdCont = document.createElement("td");
        tdCont.innerText = "";

        let tdVer = document.createElement("td");
        tdVer.innerText = services[s].version;

        tr.appendChild(tdServ);
        tr.appendChild(tdCont);
        tr.appendChild(tdVer);
        addCrudButtons(tr);

        tbody.appendChild(tr);
    }

    return tbody;
}

function addCrudButtons(trElement) {
    let del = document.createElement("button");
    del.setAttribute("class", "btn btn-danger");
    del.innerText = "Delete";

    let info = document.createElement("button");
    info.setAttribute("class", "btn btn-info");
    info.innerText = "Info";
    info.setAttribute("data-toggle", "modal");
    info.setAttribute("data-target", "#swaggerInfo");
    info.setAttribute("onclick", "generateModal(this);");

    let upd = document.createElement("button");
    upd.setAttribute("class", "btn btn-primary");
    upd.innerText = "Update";

    trElement.appendChild(del);
    trElement.appendChild(info);
    trElement.appendChild(upd);
}

function generateModal(infoButton) {
    let swaggerid = $('#' + $(infoButton).parent().children()[0].innerText).data("id");
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
    $(footerButton).click(function(){
        $('#swaggerInfo').remove();
        $('.modal-backdrop').remove();
    });
    modalFooter.appendChild(footerButton);
    modalContent.appendChild(modalFooter);

    let modalContainer = document.getElementById("modals");
    modalContainer.appendChild(modalDiv);
}
