function importJson(liItem) {
    let jliItem = $(liItem);
    let tabName = jliItem.data("service") + jliItem.data("version");
    js = JSON.parse(readJson(jliItem.data("id")).content);

    if (document.getElementById("div" + jliItem.data("service")) == null) {
        jsonList[jliItem.data("service")] = js;
        let servicesul = $("#services");

        let li = $('<li>');
        li.html("<a data-toggle=\"tab\" href=\"#div" + jliItem.data("service") + "\">"
            + "<button class=\"close closeTab\" type=\"button\" onclick=\"closeTab(this)\" >×</button>"
            + tabName + "</a>");
        li.attr("id", "close" + jliItem.data("service"));
        li.data("checkboxId", liItem.id);

        servicesul.append(li);
        let ul = $('<ul>');
        let di = $('<div>');
        di.attr("class", "tab-pane fade active in")
            .attr("id", jliItem.data("service"));

        let groupedPaths = groupByTags(buttonIdWithout);
        allGroupedByTags[buttonIdWithout] = groupedPaths;

        let allCheckbox = createCheckBox("addAllToList(this);");
        $(allCheckbox).data("childCheckboxes", 0);
        let url = createInputText(null, "url=" + jliItem.data("service"));
        let version = createInputText(null, "vers=" + jliItem.data("service"));

        ul.append(allCheckbox);
        ul.append(document.createTextNode("\t\t Url = "));
        ul.append(url);
        ul.append(document.createTextNode("\t\t version = "));
        ul.append(version);

        let dum = $("#swaggers");
        groupByTagsDraw(groupedPaths, ul, dum, jliItem.data("service"), allCheckbox);
        $(allCheckbox).data("maxChildren", $(allCheckbox).data("childCheckboxes"));
        $("#" + di.id).data("service", jliItem.data("service"));
        li.tab('show');
    } else {
        $('#close' + jliItem.data("service")).remove();
        $('#div' + jliItem.data("service")).remove();
    }
}

function handleCopyPaste() {
    let url = host + basePath + "/yaml";
    let config = $("#input-field").val();
    let impJson;
    $.ajax({
        'async': false,
        'global': false,
        'url': url,
        'type': 'POST',
        'contentType': 'application/json',
        'data': config,
        'success': function (data) {
            impJson = data;
        }
    });
    importConfig(impJson);
}

function importConfig(impJson) {
    for (a in impJson.apis) {
        apiList.apis[a] = impJson.apis[a];
        if (a === "internalApis") {
            continue;
        }
        let version = (impJson.apis[a].version != null) ? impJson.apis[a].version : "";
        importJson(document.getElementById(a + version));
        document.getElementById("url=" + a).value = impJson.apis[a].url;

        for (p in impJson.apis[a].paths) {
            let basePath = (jsonList[a].basePath === undefined) ? "" : jsonList[a].basePath;
            basePath = (basePath === "/") ? "" : basePath;
            let pathString = (impJson.apis[a].paths[p].path === undefined) ?
                impJson.apis[a].paths[p].method + "\t" + basePath + impJson.apis[a].paths[p].endpoint
                : impJson.apis[a].paths[p].method + "\t" + basePath + impJson.apis[a].paths[p].path;
            pathString = pathString.includes(basePath) ? pathString.replace(basePath, "") : pathString;
            let button = $('.btn:contains(' + pathString + ')');
            let checkbox = $(button).siblings().get(0);
            $(checkbox).trigger("click", checkbox);
        }
    }
    generate();
}

function groupByTags(jsonFileName) {
    let paths = js.paths;
    let groupedPaths = {};
    for (var p in paths) {
        let pathObject = {endpoint: "", methods: []};
        let tag;

        if (paths[p]["get"] != null) {
            pathObject.methods.push("GET");
            tag = paths[p]["get"].tags;
        }
        if (paths[p]["post"] != null) {
            pathObject.methods.push("POST");
            tag = paths[p]["post"].tags;
        }
        if (paths[p]["delete"] != null) {
            pathObject.methods.push("DELETE");
            tag = paths[p]["delete"].tags;
        }
        if (paths[p]["put"] != null) {
            pathObject.methods.push("PUT");
            tag = paths[p]["put"].tags;
        }
        pathObject.endpoint = p;

        if (tag == null) {
            tag = [];
            tag[0] = "default";
        }

        if (groupedPaths[tag[0]] == null) {
            groupedPaths[tag[0]] = [];
        }
        groupedPaths[tag[0]].push(pathObject);
    }

    for (let tag in groupedPaths) {
        if (tagList[jsonFileName] == null) {
            tagList[jsonFileName] = [];
        }
        tagList[jsonFileName].push(tag);
    }
    return groupedPaths;
}

function groupByTagsDraw(groupedPaths, ul, di, tabid, allCheckBoxElem) {
    for (let tag in groupedPaths) {
        let elementsid = trimId(tag);

        let tagli = $('<li>');
        let tagCheckbox = $('<input>');
        tagCheckbox.attr("type", "checkbox")
            .attr("onchange", "triggerAllTagsToList(this);");
        tagCheckbox.data("childCheckboxes", 0);
        tagli.append(tagCheckbox);

        let tagButton = $('<button>');
        tagButton.attr("id", "btr" + elementsid)
            .attr("data-toggle", "collapse")
            .attr("data-target", "#ul" + elementsid);
        tagButton.html(tag);
        tagli.append(tagButton);

        createAllOptionsCheckbox(tagli, tag);

        let pathsul = $('<ul>');
        pathsul.attr("class", "panel-collapse collapse")
            .attr("id", "ul" + elementsid);

        for (let path in groupedPaths[tag]) {
            for (let i in groupedPaths[tag][path].methods) {
                tagCheckbox.data("childCheckboxes", tagCheckbox.data("childCheckboxes") + 1);
                let pathsli = $('<li>');
                let checkbox = generateCheckbox(groupedPaths[tag][path], groupedPaths[tag][path].methods[i], tabid);
                pathsli.append(checkbox);
                let basePath = (jsonList[tabid].basePath === undefined) ? "" : jsonList[tabid].basePath;
                basePath = (basePath === "/") ? "" : basePath;
                let b = generateButton(groupedPaths[tag][path], groupedPaths[tag][path].methods[i], basePath);
                pathsli.append(b);
                pathsli.append(createOptionsUL(b.data("toggleId"), checkbox));
                pathsul.append(pathsli);
            }
            tagli.append(pathsul);
            ul.append(tagli);
        }
        $(tagCheckbox).data("maxChildren", tagCheckbox.data("childCheckboxes"));
        $(allCheckBoxElem).data("childCheckboxes", $(allCheckBoxElem).data("childCheckboxes") + 1);
    }
    let tabpanediv = document.createElement("div");
    tabpanediv.setAttribute("class", "tab-pane fade active in");
    tabpanediv.setAttribute("id", "div" + tabid);
    $(tabpanediv).data("service", tabid);
    $(tabpanediv).append(ul);
    di.append(tabpanediv);
    hideOtherTabs(tabpanediv);
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

    button.text(method + " " + basepath + path.endpoint);
    button.data("toggleId", togglelId);
    return button;
}

function generateCheckbox(path, method, service) {
    checkbox = $('<input>');
    checkbox.attr("type", "checkbox")
        .attr("onchange", "addToList(this)");
    checkbox.data("path", path.endpoint);
    checkbox.data("method", method);
    checkbox.data("pathId", ID());
    checkbox.data("checked", false);
    checkbox.data("service", service);

    return checkbox;
}

function createCheckBox(onChangeFunction) {
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    if (onChangeFunction != null)
        checkbox.setAttribute("onchange", onChangeFunction);
    return checkbox;
}

function createInputText(value, idString) {
    let inputext = document.createElement("input");
    inputext.type = "text";

    if (idString != null)
        inputext.id = idString;
    inputext.value = value;
    return inputext;
}

function writeToButton(element) {
    let el = $(element);
    let parent = $(el.parent());
    let attributeName = parent.text().trim().toLowerCase();
    let outercheckbox = parent.parent().siblings().get(0);

    if (el.is(":checkbox")) {
        $(outercheckbox).data(attributeName, element.checked);
    } else {
        $(outercheckbox).data(attributeName, el.val());
    }
    updatePath($(outercheckbox), attributeName);
}

function updatePath(outercheckbox, attributeName) {
    let serviceList = list[outercheckbox.data("service")];
    for (path of serviceList) {
        if (path.path === outercheckbox.data("path")) {
            path[attributeName] = outercheckbox.data(attributeName);
        }
    }
}

function displayInputText(endpointOptionsCheckbox) {
    let inputElement = $(endpointOptionsCheckbox).parent()
        .children().get(1);

    if (endpointOptionsCheckbox.checked === true) {
        inputElement.style.display = "inline";
    }
    else {
        inputElement.value = "";
        inputElement.style.display = "none";
    }
}

function createOptionsUL(id, checkbox) {

    let optionsUl = document.createElement("ul");
    optionsUl.id = id;
    let authorizeLi = document.createElement("li");
    let authorizeCheckbox = createCheckBox("writeToButton(this);", "", "");
    authorizeCheckbox.className = "";
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
    endpointLi.appendChild(endpointCheckBox);
    endpointLi.appendChild(document.createTextNode("\t\t Endpoint"));
    let endpointIn = document.createElement("input");
    endpointIn.className = "";
    endpointIn.id = "end=" + "";
    endpointIn.setAttribute("type", "text");
    endpointIn.setAttribute("onfocusout", "writeToButton(this)");
    endpointIn.value = "";
    endpointIn.style.display = "none";
    endpointLi.appendChild(endpointIn);


    let tagsLi = document.createElement("li");
    let tagsCheckBox = createCheckBox("displayInputText(this);");
    tagsLi.appendChild(tagsCheckBox);
    tagsLi.appendChild(document.createTextNode("\t\t Tags"));
    let tagsIn = document.createElement("input");
    tagsIn.className = "";
    tagsIn.id = "tags=" + "";
    tagsIn.setAttribute("type", "text");
    tagsIn.setAttribute("onfocusout", "writeToButton(this)");
    eval("tempPath" + " = " + "jsonList[\"" + checkbox.data("service") + "\"].paths[\"" + checkbox.data("path") + "\"]."
        + checkbox.data("method").toLocaleLowerCase() + ";");
    if (tempPath.tags !== undefined) {
        tagsIn.value = tempPath.tags.toString();
        checkbox.data("tags", tempPath.tags.toString());
    }
    tagsIn.style.display = "none";
    tagsLi.appendChild(tagsIn);

    let trnsTypeIdLi = document.createElement("li");
    let trnsTypeIdCheckBox = createCheckBox("displayInputText(this);");
    trnsTypeIdLi.appendChild(trnsTypeIdCheckBox);
    trnsTypeIdLi.appendChild(document.createTextNode("\t\t trnsTypeId"));
    let trnsTypeIdIn = document.createElement("input");
    trnsTypeIdIn.className = "";
    trnsTypeIdIn.id = "trns=" + "";
    trnsTypeIdIn.setAttribute("type", "text");
    trnsTypeIdIn.setAttribute("onfocusout", "writeToButton(this)");
    trnsTypeIdIn.value = "";
    trnsTypeIdIn.style.display = "none";
    trnsTypeIdLi.appendChild(trnsTypeIdIn);

    optionsUl.appendChild(authorizeLi);
    optionsUl.appendChild(displayLi);
    optionsUl.appendChild(trnsTypeIdLi);
    optionsUl.appendChild(endpointLi);
    optionsUl.appendChild(tagsLi);

    optionsUl.setAttribute("class", "panel-collapse collapse");

    return $(optionsUl);
}

function trimId(tag) {
    let elementId;
    elementId = tag.replace(/\s/g, '');
    elementId = elementId.replace(".", "_");
    elementId = elementId.replace(/["'()]/g, "");
    return elementId;
}

function createAllOptionsCheckbox(tagliElement, tag) {
    let authorizeCheckbox = createCheckBox("AuthorizeAllSubTagEndpoints(this);", tag, "");
    let authorizeTextNode = document.createTextNode("Authorize All");
    tagliElement.append(authorizeCheckbox);
    tagliElement.append(authorizeTextNode);

    let displayCheckbox = createCheckBox("DisplayAllSubTagEndpoints(this);", tag, "");
    let displayTextNode = document.createTextNode("Display All");
    tagliElement.append(displayCheckbox);
    tagliElement.append(displayTextNode);

}

function AuthorizeAllSubTagEndpoints(authorizeAllElement) {
    let authCheckboxes = document.getElementsByClassName(authorizeAllElement.className);
    let arrayAuthCheckboxes = Array.from(authCheckboxes).filter(getOnlyAuthCheckboxes);

    for (ach in arrayAuthCheckboxes) {
        arrayAuthCheckboxes[ach].checked = authorizeAllElement.checked;
    }
}

/**
 * @return {string}
 */
function ID() {
    return '_' + Math.random().toString(36).substr(2, 9);
}
