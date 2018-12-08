function importJson(liItem) {
    liItem.innerHTML = "<span class=\"glyphicon glyphicon-ok\"></span>";
    liItem.className = "btn btn-success btn-sm";
    let jliItem = $(liItem);
    js = JSON.parse(getSwaggerJsonFromDatabase(jliItem.data("id")).content);
    let version = jliItem.data("version").replace(".","S");
    if (document.getElementById("div" + jliItem.data("service") + version) == null) {
        jsonList[jliItem.data("service")] = js;
        let di = $('<div>');
        di.attr("class", "tab-pane fade active in")
            .attr("id", jliItem.data("service") + version);

        let ul = createTab(jliItem.data("service"), jliItem.data("version"), jliItem.attr("id"), false);
        let allCheckbox = $(ul).children().get(0);
        let groupedPaths = groupByTags(buttonIdWithout);
        allGroupedByTags[buttonIdWithout] = groupedPaths;

        groupByTagsDraw(groupedPaths, ul, $("#swaggers"), jliItem.data("service"), version, allCheckbox);
        $(allCheckbox).data("maxChildren", $(allCheckbox).data("childCheckboxes"));
        $("#" + di.id).data("service", jliItem.data("service") + version);
        $($("#services").children().get(3)).tab('show');
    } else {
        liItem.innerHTML = "<span class=\"glyphicon glyphicon-plus\"></span>";
        liItem.className = "btn btn-secondary btn-sm";
        resetOutput(jliItem.data("service"));
        let div = document.getElementById("div" + jliItem.data("service") + version);
        let close = document.getElementById("close" + jliItem.data("service") + version);

        $(div).remove();
        $(close).remove();
    }
    addEventListeners();
}

function createTab(service, version, id, internal) {
    let servicesul = $("#services");
    let tabName = service + version;
    let li;
    //TODO do something smarter naaab,
    let initialVersion = version;
    version = version.replace(".","S");

    if (internal === false) {
        li = $('<li>');
        li.html("<a data-toggle=\"tab\" href=\"#div" + service + version + "\">"
            + "<button class=\"close closeTab\" type=\"button\" onclick=\"closeTab(this)\" >×</button>"
            + tabName + "</a>");
        li.attr("id", "close" + service + version);
        li.data("checkboxId", id);
    } else {
        li = $('<li>');
        li.html("<a data-toggle=\"tab\" href=\"#divinternalApis" + "\">"
            + tabName + "</a>");
    }
    li.css("margin", "5px 0 0 0");
    servicesul.append(li);
    let ul = $('<ul>');

    let allCheckbox = createCheckBox("addAllToList(this);");
    $(allCheckbox).data("childCheckboxes", 0);
    $(allCheckbox).data("maxChildren", 0);
    $(allCheckbox).data("internal", internal);

    if (internal === false) {
        let url = createInputForm("Url", "url=" + service, );
        let versionInput = createInputForm("Version", "vers=" + service, initialVersion);

        let formDiv = document.createElement("form");
        formDiv.className = "form-inline";

        formDiv.appendChild(allCheckbox);
        formDiv.appendChild(url);
        formDiv.appendChild(versionInput);

        ul.append($(formDiv));
    }

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
            importInternalPaths(impJson.apis[a].paths);
            continue;
        }
        let version = (impJson.apis[a].version != null) ? impJson.apis[a].version : "";
        let serviceCheckbox = document.getElementById(a + version);
        $(serviceCheckbox).trigger("click");
        document.getElementById("url=" + a).value = impJson.apis[a].url;
        document.getElementById("vers=" + a).value = impJson.apis[a].version !== undefined ? impJson.apis[a].version : "";

        for (p in impJson.apis[a].paths) {
            let basePath = (jsonList[a].basePath === undefined) ? "" : jsonList[a].basePath;
            basePath = (basePath === "/") ? "" : basePath;
            let pathString = (impJson.apis[a].paths[p].path === undefined) ?
                impJson.apis[a].paths[p].method + " " + basePath + impJson.apis[a].paths[p].endpoint
                : impJson.apis[a].paths[p].method + " " + basePath + impJson.apis[a].paths[p].path;
            pathString = pathString.includes(basePath) ? pathString.replace(basePath, "") : pathString;
            pathString.replace("/api", "");
            let button = $('.btn:contains(' + pathString + ')');
            let checkbox = $(button).siblings().get(0);
            setOptionsUl($(button).siblings().get(1), impJson.apis[a].paths[p]);
            $(checkbox).trigger("click", checkbox);
        }
    }
    generate();
}

function setOptionsUl(optionsUL, path){
    $(optionsUL).children().each(function () {
        let pathAttributes = Object.keys(path);
        let liChildren  = $(this).children();
        let attributeName = $(this).text().trim();
        let value = path[attributeName];

        if(pathAttributes.includes(attributeName)){
            handleOption(attributeName, liChildren, value);
        }
    });
}

function handleOption(attributeName, children, value){
    let firstChild = children.get(0);
    if($(firstChild).is(':checkbox') && $(children).length === 1) {
        if(value === false && $(firstChild).prop('checked') === true){
            $(firstChild).trigger("click");
        }
    }
    else if($(firstChild).is(':checkbox') && $(children).length === 2){
        let inputText = children.get(1);
        $(inputText).val(value);
        $(firstChild).trigger("click");
    }
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

function groupByTagsDraw(groupedPaths, ul, di, service, version, allCheckBoxElem) {
    for (let tag in groupedPaths) {
        let elementsid = trimId(tag);
        elementsid = (elementsid === "default") ? service + elementsid : elementsid;

        let tagli = $('<li>');
        tagli.css("margin", "5px 0");
        let tagCheckbox = $('<input>');
        tagCheckbox.attr("type", "checkbox")
            .attr("onchange", "triggerAllTagsToList(this);");
        tagCheckbox.data("childCheckboxes", 0);
        tagli.append(tagCheckbox);

        let tagButton = $('<button>');
        tagButton.attr("id", "btr" + elementsid)
            .attr("data-toggle", "collapse")
            .attr("data-target", "#ul" + elementsid)
            .attr("class", "btn btn-info");
        tagButton.html(tag);
        tagli.append(tagButton);

        createAllOptionsCheckbox(tagli, tag);

        let pathsul = $('<ul>');
        pathsul.attr("class", "panel-collapse collapse")
            .attr("id", "ul" + elementsid);

        for (let path in groupedPaths[tag]) {
            for (let i in groupedPaths[tag][path].methods) {
                tagCheckbox.data("childCheckboxes", tagCheckbox.data("childCheckboxes") + 1);
                let pathsli = getPathEntry(groupedPaths[tag][path].endpoint, groupedPaths[tag][path].methods[i], service, false);
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
    tabpanediv.setAttribute("id", "div" + service + version);
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

function createInputForm(value, idString, initialValue) {
    let formDiv = document.createElement("div");
    formDiv.className = "form-group mx-sm-3 mb-2";
    let formInput = document.createElement("input");
    formInput.setAttribute("type", "text");
    if(initialValue !== undefined)
    formInput.value = initialValue;
    formInput.id = idString;
    formInput.className = "form-control";
    formInput.setAttribute("placeholder", value);
    formDiv.appendChild(formInput);

    return formDiv;
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
    authorizeCheckbox.checked = true;
    let authorizeTextNode = document.createTextNode("Authorize All");
    tagliElement.append(authorizeCheckbox);
    tagliElement.append(authorizeTextNode);

    let displayCheckbox = createCheckBox("DisplayAllSubTagEndpoints(this);", tag, "");
    displayCheckbox.checked = true;
    let displayTextNode = document.createTextNode("Display All");
    tagliElement.append(displayCheckbox);
    tagliElement.append(displayTextNode);

}

//TODO same function the next 2 with little difference so i need to think a way to make them 1.

function AuthorizeAllSubTagEndpoints(authorizeAllElement) {
    let tagCollapse = $(authorizeAllElement).prev();
    let dataTarget = $(tagCollapse).attr("data-target");
    let targetUl = $(dataTarget);

    $(targetUl).children('li').each(function () {
        let ul = $(this).children('ul');
        let li = $(ul).children().get(0);
        let checkbox = $(li).children().get(0);
        checkbox.checked = authorizeAllElement.checked;
    });
}

function DisplayAllSubTagEndpoints(displayAllElement) {
    let tagCollapse = $(displayAllElement).siblings().get(1);
    let dataTarget = $(tagCollapse).attr("data-target");
    let targetUl = $(dataTarget);

    $(targetUl).children('li').each(function () {
        let ul = $(this).children('ul');
        let li = $(ul).children().get(1);
        let checkbox = $(li).children().get(0);
        checkbox.checked = displayAllElement.checked;
    });
}

/**
 * @return {string}
 */
function ID() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

function addEventListeners() {
    $(".configInputText").on("focusout", function () {
        let parentOfInput = $(this).parent();

        if (parentOfInput.text() /*!== undefined && parentOfInput.text().trim() === "queryParams" || parentOfInput.text().trim() === "headers"*/) {
            let attributeName = parentOfInput.text().trim();
            let value = $(this).val();
            writeToButton(this, attributeName, value);
        }
    });

    $(".configInputCheckbox").on("click", function () {
        if (this.checked === false) {
            let attributeName = $(this).parent().text().trim();
            if (attributeName.toLowerCase() === "tags") {
                let pathCheckbox = findOuterCheckbox($(this));
                $(this).next().val($(pathCheckbox).data("tags"));
                writeToButton($(this).next(), "");
            } else if (attributeName.includes("headers") || attributeName.includes("queryparams")) {
                writeToButton(this, "headers", "");
                writeToButton(this, "queryparams", "");
            } else {
                writeToButton(this, attributeName, this.checked);
            }
        } else if (this.checked === true) {
            let parentOfInput = $(this).parent();
            let attributeName = parentOfInput.text().trim();
            let textInputChildren = parentOfInput.find('.configInputText');
            if (textInputChildren.length === 0) {
                let value = this.checked;
                writeToButton(this, attributeName, value);
            } else if (textInputChildren.length > 0) {
                for (let t=0 ; t < textInputChildren.length ; t++) {
                    let attributeNames = attributeName.split("\t\t");
                    let value = textInputChildren[t].value;
                    let attribute = attributeNames[t+1] !== undefined ? attributeNames[t+1] : attributeNames[t];
                    writeToButton(this, attribute.trim(), value);
                }
            }
        }
    });
}