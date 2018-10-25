 function importJson(liItem) {
    let jliItem = $(liItem);
    js = JSON.parse(getSwaggerJsonFromDatabase(jliItem.data("id")).content);

    if (document.getElementById("div" + jliItem.data("service")) == null) {
        jsonList[jliItem.data("service")] = js;
        let di = $('<div>');
        di.attr("class", "tab-pane fade active in")
            .attr("id", jliItem.data("service"));

        let ul = createTab(jliItem);
        let allCheckbox = $(ul).children().get(0);
        let groupedPaths = groupByTags(buttonIdWithout);
        allGroupedByTags[buttonIdWithout] = groupedPaths;

        groupByTagsDraw(groupedPaths, ul, $("#swaggers"), jliItem.data("service"), allCheckbox);
        $(allCheckbox).data("maxChildren", $(allCheckbox).data("childCheckboxes"));
        $("#" + di.id).data("service", jliItem.data("service"));
        $($("#services").children().get(2)).tab('show');
    } else {
        $('#close' + jliItem.data("service")).remove();
        $('#div' + jliItem.data("service")).remove();
    }
}

function createTab(jliItem){
    let servicesul = $("#services");
    let tabName = jliItem.data("service") + jliItem.data("version");

    let li = $('<li>');
    li.html("<a data-toggle=\"tab\" href=\"#div" + jliItem.data("service") + "\">"
        + "<button class=\"close closeTab\" type=\"button\" onclick=\"closeTab(this)\" >×</button>"
        + tabName + "</a>");
    li.attr("id", "close" + jliItem.data("service"));
    li.data("checkboxId", jliItem.attr("id"));

    servicesul.append(li);
    let ul = $('<ul>');

    let allCheckbox = createCheckBox("addAllToList(this);");
    $(allCheckbox).data("childCheckboxes", 0);
    let url = createInputText(null, "url=" + jliItem.data("service"));
    let version = createInputText(null, "vers=" + jliItem.data("service"));

    ul.append(allCheckbox);
    ul.append(document.createTextNode("\t\t Url = "));
    ul.append(url);
    ul.append(document.createTextNode("\t\t version = "));
    ul.append(version);
    return ul;
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
                impJson.apis[a].paths[p].method + " " + basePath + impJson.apis[a].paths[p].endpoint
                : impJson.apis[a].paths[p].method + " " + basePath + impJson.apis[a].paths[p].path;
            pathString = pathString.includes(basePath) ? pathString.replace(basePath, "") : pathString;
            let button = $('.btn:contains(' + pathString +')');
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

function groupByTagsDraw(groupedPaths, ul, di, service, allCheckBoxElem) {
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
                let pathsli = getPathEntry(groupedPaths[tag][path], groupedPaths[tag][path].methods[i], service);
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
    tabpanediv.setAttribute("id", "div" + service);
    $(tabpanediv).data("service", service);
    $(tabpanediv).append(ul);
    di.append(tabpanediv);
    hideOtherTabs(tabpanediv);
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
