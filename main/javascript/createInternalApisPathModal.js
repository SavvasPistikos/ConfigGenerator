function generateInterApiPathModal() {

    if (document.getElementById("addInternalPath") !== null) {
        let pathInput = document.getElementById("internalSwaggerPath");
        pathInput.value = "";
        let methodInput = document.getElementById("method");
        methodInput.value = "---";
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
    input.setAttribute("list", "internalP");
    input.setAttribute("type", "text");
    input.className = "form-control";
    input.id = "internalSwaggerPath";
    input.placeholder = "Internal Endpoint Path";

    $(input).on('input', function () {
        let p = this.value;
        let option = ($('#internalP option').filter(function () {
            return this.value === p ? $(this) : null;
        }));
        if(option.length !== 0) {
            let method = option.data("method");
            $("#method").val(method !== undefined ? method : "GET");
            $(this).data("id", option.data("id"));
        }
    });

    divFormGroup.appendChild(label);
    divFormGroup.appendChild(input);
    divFormGroup.appendChild(createDataList());

    let divFormGroupMethod = document.createElement("div");
    divFormGroupMethod.className = "form-group";

    let labelMethod = document.createElement("label");
    labelMethod.setAttribute("for", "method");
    //labelMethod.innerText = "Method";

    let select = document.createElement("select");
    select.className = "form-control";
    select.id = "method";

    let defaultOption = document.createElement("option");
    defaultOption.innerText = "---";
    let getOption = document.createElement("option");
    getOption.innerText = "GET";
    let postOption = document.createElement("option");
    postOption.innerText = "POST";
    let putOption = document.createElement("option");
    putOption.innerText = "PUT";
    let deleteOption = document.createElement("option");
    deleteOption.innerText = "DELETE";

    select.appendChild(defaultOption);
    select.appendChild(getOption);
    select.appendChild(postOption);
    select.appendChild(putOption);
    select.appendChild(deleteOption);

    divFormGroupMethod.appendChild(labelMethod);
    divFormGroupMethod.appendChild(select);

    div.appendChild(divFormGroup);
    div.appendChild(divFormGroupMethod);

    return div;
}

function createDataList() {
    let datalist = document.createElement("datalist");
    datalist.id = "internalP";
    let internalPaths = getInternalPaths();

    for (let i in internalPaths) {
        let option = document.createElement("option");
        option.value = internalPaths[i].method + " " + internalPaths[i].endpoint;
        $(option).data("method", internalPaths[i].method);
        $(option).data("id", internalPaths[i].id);
        datalist.appendChild(option);
    }

    return datalist;
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
    addButton.innerText = "Save";

    div.appendChild(addButton);
    div.appendChild(closeButton);

    return div;
}

function addInternalPath() {

    let currentPath = $('#internalSwaggerPath');
    let id = currentPath.data("id");
    let method = document.getElementById("method").value;
    if(method !== "---") {
        let internalEndpoint = currentPath.val().replace(method + " ", "");
        document.getElementById("method").value = "GET";
        let internalPathsList = $("#internalPathsList");

        let pathEntry = getPathEntry(internalEndpoint, method, "internalApis", true);

        let removeButton = document.createElement("button");
        removeButton.className = "btn btn-danger btn-sm pull-right";
        removeButton.innerHTML = "<span class=\"glyphicon glyphicon-remove\"></span>";
        removeButton.setAttribute("onclick", "removeInternalPath(this);");
        $(removeButton).insertBefore(pathEntry.children('ul'));

        internalPathsList.append($(pathEntry));
        internalPathsList.show();

        let outerCheckbox = $(internalPathsList.parent().children(':checkbox'));
        outerCheckbox.data("maxChildren", outerCheckbox.data("maxChildren") + 1);
        outerCheckbox.data("childCheckboxes", outerCheckbox.data("childCheckboxes") + 1);

        $('#addInternalPath').modal('toggle');
        addEventListeners();

        if (id === undefined) {
            let internalPath = {endpoint: "", method: ""};
            internalPath.endpoint = internalEndpoint;
            internalPath.method = method;
            saveInternalPath(internalPath);
        } else {
            let pathFromDb = getInternalPath(id);
            setOptionsUl($(pathEntry).children('ul'), pathFromDb);
        }
    }
}

function removeInternalPath(removeButton) {
    let internalPathsList = $("#internalPathsList");
    let checkbox = $(removeButton).siblings().get(0);
    let liParent = $(removeButton).parent();
    let outerCheckbox = $(internalPathsList.parent().children(':checkbox'));
    outerCheckbox.data("maxChildren", outerCheckbox.data("maxChildren") - 1);
    outerCheckbox.data("childCheckboxes", outerCheckbox.data("childCheckboxes") - 1);
    if (checkbox.checked === true) {
        $(checkbox).trigger("click");
    }
    $(liParent).remove();
    if (internalPathsList.children().length === 0) {
        internalPathsList.hide();
    }
}

function importInternalPaths(internalEndpoints) {
    let internalPathsList = $("#internalPathsList");
    for (endpoint in internalEndpoints) {
        let pathEntry = getPathEntry(internalEndpoints[endpoint].endpoint, internalEndpoints[endpoint].method, "internalApis", true);
        let removeButton = document.createElement("button");
        removeButton.className = "btn btn-danger btn-sm pull-right";
        removeButton.innerHTML = "<span class=\"glyphicon glyphicon-remove\"></span>";
        removeButton.setAttribute("onclick", "removeInternalPath(this);");
        $(removeButton).insertBefore(pathEntry.children('ul'));
        internalPathsList.append($(pathEntry));
        setOptionsUl($(pathEntry).children('ul'), internalEndpoints[endpoint]);
        saveInternalPath(internalEndpoints[endpoint]);
    }
    let outerCheckbox = internalPathsList.parent().children(':checkbox');
    $(outerCheckbox).data("maxChildren", internalPathsList.children().length);
    $(outerCheckbox).data("childCheckboxes", internalPathsList.children().length);
    internalPathsList.children().each(function () {
        let checkbox = $(this).children().get(0);
        $(checkbox).trigger("click");
    });
    internalPathsList.show();

}
