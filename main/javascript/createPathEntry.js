function getPathEntry(path, method, service, internal) {

    let pathsli = $('<li>');
    let checkbox = generateCheckbox(path, method, service);
    let basePath = "";

    if (internal === false) {
        basePath = (jsonList[service].basePath === undefined) ? "" : jsonList[service].basePath;
        basePath = (basePath === "/") ? "" : basePath;
    }

    let b = generateButton(path, method, basePath);

    pathsli.append(checkbox);
    pathsli.append(b);
    pathsli.append(createOptionsUL(b.data("toggleId"), checkbox, internal));
    pathsli.css("margin", "5px 0");
    return pathsli;
}

function generateButton(path, method, basepath) {
    let button = $('<button>');
    let togglelId = ID();
    button.data("created", false);
    button.attr("data-toggle", "collapse")
        .attr("data-target", "#" + togglelId);

    if (method === "POST") {
        button.attr("class", "btn btn-success");
    } else if (method === "DELETE") {
        button.attr("class", "btn btn-danger");
    } else if (method === "GET") {
        button.attr("class", "btn btn-primary")
    } else if (method === "PUT") {
        button.attr("class", "btn btn-warning")
    }

    button.text(method + " " + basepath + path);
    button.data("toggleId", togglelId);
    return button;
}

function generateCheckbox(path, method, service) {
    let checkbox = $('<input>');
    checkbox.attr("type", "checkbox")
        .attr("onchange", "addToList(this)");
    checkbox.data("authorize", true);
    checkbox.data("display", true);
    checkbox.data("path", path);
    checkbox.data("method", method);
    checkbox.data("pathId", ID());
    checkbox.data("checked", false);
    checkbox.data("service", service);

    return checkbox;
}

function createOptionsUL(id, checkbox, internal) {

    let optionsUl = document.createElement("ul");
    optionsUl.id = id;
    let authorizeLi = document.createElement("li");
    let authorizeCheckbox = createCheckBox("writeToButton(this);", "", "");
    authorizeCheckbox.className = "";
    authorizeCheckbox.checked = true;
    authorizeCheckbox.id = "auth" + "";
    let authorizeTextNode = document.createTextNode("Authorize");
    authorizeLi.appendChild(authorizeCheckbox);
    authorizeLi.appendChild(authorizeTextNode);

    let displayLi = document.createElement("li");
    let displayCheckBox = createCheckBox("writeToButton(this);", "", "");
    displayCheckBox.className = "";
    displayCheckBox.checked = true;
    displayCheckBox.id = "disp" + "";
    let displayTextNode = document.createTextNode("Display");
    displayLi.appendChild(displayCheckBox);
    displayLi.appendChild(displayTextNode);

    let endpointLi = document.createElement("li");
    let endpointCheckBox = createCheckBox("displayInputText(this);");
    endpointCheckBox.className = "configInputCheckbox";
    endpointLi.appendChild(endpointCheckBox);
    endpointLi.appendChild(document.createTextNode("\t\t Endpoint"));
    let endpointIn = document.createElement("input");
    endpointIn.className = "configInputText";
    endpointIn.id = "end=" + "";
    endpointIn.setAttribute("type", "text");
    endpointIn.value = "";
    endpointIn.style.display = "none";
    endpointLi.appendChild(endpointIn);

    let tagsLi = document.createElement("li");
    let tagsCheckBox = createCheckBox("displayInputText(this);");
    tagsCheckBox.className = "configInputCheckbox";
    tagsLi.appendChild(tagsCheckBox);
    tagsLi.appendChild(document.createTextNode("\t\t Tags"));
    let tagsIn = document.createElement("input");
    tagsIn.className = "configInputText";
    tagsIn.id = "tags=" + "";
    tagsIn.setAttribute("type", "text");
    tagsIn.setAttribute("onfocusout", "writeToButton(this)");

    if (internal === false) {
        eval("tempPath" + " = " + "jsonList[\"" + checkbox.data("service") + "\"].paths[\"" + checkbox.data("path") + "\"]."
            + checkbox.data("method").toLocaleLowerCase() + ";");
        if (tempPath.tags !== undefined) {
            tagsIn.value = tempPath.tags.toString();
            checkbox.data("tags", tempPath.tags.toString());
        }
    }
    tagsIn.style.display = "none";
    tagsLi.appendChild(tagsIn);

    let trnsTypeIdLi = document.createElement("li");
    let trnsTypeIdCheckBox = createCheckBox("displayInputText(this);");
    trnsTypeIdCheckBox.className = "configInputCheckbox";
    trnsTypeIdLi.appendChild(trnsTypeIdCheckBox);
    trnsTypeIdLi.appendChild(document.createTextNode("\t\t trnsTypeId"));
    let trnsTypeIdIn = document.createElement("input");
    trnsTypeIdIn.className = "configInputText";
    trnsTypeIdIn.id = "trns=" + "";
    trnsTypeIdIn.setAttribute("type", "text");
    trnsTypeIdIn.setAttribute("onfocusout", "writeToButton(this)");
    trnsTypeIdIn.value = "";
    trnsTypeIdIn.style.display = "none";
    trnsTypeIdLi.appendChild(trnsTypeIdIn);

    optionsUl.appendChild(authorizeLi);
    optionsUl.appendChild(displayLi);
    optionsUl.appendChild(endpointLi);
    optionsUl.appendChild(trnsTypeIdLi);
    optionsUl.appendChild(tagsLi);

    optionsUl.setAttribute("class", "panel-collapse collapse");

    return $(optionsUl);
}