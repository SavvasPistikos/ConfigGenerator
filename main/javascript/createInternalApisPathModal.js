function generateInterApiPathModal() {

    if (document.getElementById("addInternalPath") !== null) {
        let pathInput = document.getElementById("internalSwaggerPath");
        pathInput.value = "";
        let methodInput = document.getElementById("internalSwaggerPathMethod");
        methodInput.value = "";
        return;
    }

    let divModalFade = document.createElement("div");
    divModalFade.className = "modal fade";
    divModalFade.id = "addInternalPath";
    divModalFade.setAttribute("role", "dialog");
    divModalFade.setAttribute("tabindex", "-1");

    let divModalDialog = document.createElement("div");
    divModalDialog.className = "modal-dialog";

    let divModalContent = document.createElement("div");
    divModalContent.className = "modal-content";

    divModalContent.appendChild(createHeader());
    divModalContent.appendChild(createBody());
    divModalContent.appendChild(createFooter());

    divModalDialog.appendChild(divModalContent);

    divModalFade.appendChild(divModalDialog);

    let modalContainer = document.getElementById("modals");
    modalContainer.appendChild(divModalFade);
}

function createHeader() {

    let div = document.createElement("div");
    div.className = "modal-header";

    let closeButton = document.createElement("button");
    closeButton.className = "close";
    closeButton.setAttribute("data-dismiss", "modal");
    closeButton.innerHTML = "<span aria-hidden=\"true\">&times;</span>\n" +
        "<span class=\"sr-only\">Close</span>";

    let h4 = document.createElement("h4");
    h4.className = "modal-title";

    div.appendChild(closeButton);
    div.appendChild(h4);

    return div;
}

function createBody() {

    let div = document.createElement("div");
    div.className = "modal-body";

    let divFormGroup = document.createElement("div");
    divFormGroup.className = "form-group";

    let label = document.createElement("label");
    label.setAttribute("for", "endpoint");
    label.innerText = "Endpoint";

    let input = document.createElement("input");
    input.setAttribute("type", "text");
    input.className = "form-control";
    input.id = "internalSwaggerPath";
    input.placeholder = "Internal Endpoint Path";

    divFormGroup.appendChild(label);
    divFormGroup.appendChild(input);


    let divFormGroupMethod = document.createElement("div");
    divFormGroupMethod.className = "form-group";

    let labelMethod = document.createElement("label");
    labelMethod.setAttribute("for", "method");
    labelMethod.innerText = "Method";

    let inputMethod = document.createElement("input");
    inputMethod.setAttribute("type", "text");
    inputMethod.className = "form-control";
    inputMethod.id = "internalSwaggerPathMethod";
    inputMethod.placeholder = "Method";

    divFormGroupMethod.appendChild(labelMethod);
    divFormGroupMethod.appendChild(inputMethod);

    div.appendChild(divFormGroup);
    div.appendChild(divFormGroupMethod);

    return div;
}

function createFooter() {

    let div = document.createElement("div");
    div.className = "modal-footer";

    let closeButton = document.createElement("button");
    closeButton.className = "btn btn-default";
    closeButton.setAttribute("data-dismiss", "modal");
    closeButton.innerText = "Close";

    let addButton = document.createElement("button");
    addButton.className = "btn btn-primary";
    addButton.setAttribute("onclick", "addInternalPath();");
    addButton.innerText = "Add Path";

    div.appendChild(addButton);
    div.appendChild(closeButton);

    return div;
}

function addInternalPath() {

    let internalEndpoint = document.getElementById("internalSwaggerPath").value;
    let method = document.getElementById("internalSwaggerPathMethod").value;
    let internalPathsList = $("#internalPathsList");

    let pathEntry = getPathEntry(internalEndpoint, method, "internalApis", true);

    internalPathsList.append($(pathEntry));
    internalPathsList.show();

    $('#addInternalPath').modal('toggle');

}

function importInternalPaths(internalEndpoints) {
    let internalPathsList = $("#internalPathsList");
    for (endpoint in internalEndpoints) {
        let pathEntry = getPathEntry(internalEndpoints[endpoint].endpoint, internalEndpoints[endpoint].method, "internalApis", true);
        internalPathsList.append($(pathEntry));
/*        let checkbox = $(pathEntry).children().get(0);
        $(checkbox).trigger("click");*/
    }
    internalPathsList.show();
    let outerCheckbox = internalPathsList.parent().children(':checkbox');
    $(outerCheckbox).data("maxChildren", internalPathsList.children().length);
    $(outerCheckbox).data("childCheckboxes", internalPathsList.children().length);
    internalPathsList.children().each(function () {
        let checkbox = $(this).children().get(0);
        $(checkbox).trigger("click");
    });
}