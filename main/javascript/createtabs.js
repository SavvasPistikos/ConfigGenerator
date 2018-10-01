function importJson(liItem) {
    let jliItem = $('#' + liItem.id);
    let tabName = jliItem.data("service") + jliItem.data("version");
    buttonIdWithout = jliItem.data("service");
    js = JSON.parse(readJson(jliItem.data("id")).content);

    if (document.getElementById("div" + liItem.id) == null) {
        jsonList[buttonIdWithout] = js;
        let servicesul = $("#services");

        let li = $('<li>');
        li.html("<a data-toggle=\"tab\" href=\"#div" + liItem.id.replace(".", "_") + "\">"
            + "<button class=\"close closeTab\" type=\"button\" >×</button>"
            + tabName + "</a>");
        li.attr("id", "close" + liItem.id);

        servicesul.append(li);
        let ul = $('<ul>');
        let di = $('<div>')
            .attr("class","tab-pane fade active in")
            .attr("id","div" + liItem.id.replace(".", "_"));

        let groupedPaths = groupByTags(buttonIdWithout);
        allGroupedByTags[buttonIdWithout] = groupedPaths;

        let allCheckbox = createCheckBox("addAllToList(this);", buttonIdWithout, null);
        let url = createInputText(null, "url=" + buttonIdWithout);
        let version = createInputText(null, "vers=" + buttonIdWithout);

        ul.append(allCheckbox);
        ul.append(document.createTextNode("\t\t Url = "));
        ul.append(url);
        ul.append(document.createTextNode("\t\t version = "));
        ul.append(version);

        let dum = $("#swaggers");
        groupByTagsDraw(groupedPaths, ul, dum, liItem.id.replace(".", "_"));
        $("#" + di.id).data("service", jliItem.data("service"));
    } else {
        $('#close' + liItem.id).remove();
        $('#div' + liItem.id).remove();
    }
}

function handleCopyPaste() {
    let url = host + path + "/yaml";
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
        importJson(document.getElementById(a + version.replace(".", "_")));
        document.getElementById("url=" + a).value = impJson.apis[a].url;

        for (p in impJson.apis[a].paths) {
            let checkbox;
            if (impJson.apis[a].paths[p].path != null && impJson.apis[a].paths[p].endpoint != null) {
                checkbox = document.getElementById(impJson.apis[a].paths[p].path.replace(jsonList[a].basePath, "") + "," + impJson.apis[a].paths[p].method);
                if (checkbox == null) {
                    checkbox = document.getElementById(impJson.apis[a].paths[p].path + "," + impJson.apis[a].paths[p].method);
                }
            } else {
                if (impJson.apis[a].paths[p].path == null) {
                    checkbox = (jsonList[a].basePath !== null) ?
                        document.getElementById(impJson.apis[a].paths[p].endpoint.replace(jsonList[a].basePath, "") + "," + impJson.apis[a].paths[p].method)
                        : document.getElementById(impJson.apis[a].paths[p].endpoint + "," + impJson.apis[a].paths[p].method);
                } else {
                    checkbox = document.getElementById(impJson.apis[a].paths[p].path + "," + impJson.apis[a].paths[p].method);
                }
            }
            checkbox.checked = true;
            addToList(checkbox);
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

function groupByTagsDraw(groupedPaths, ul, di, tabid) {
    for (let tag in groupedPaths) {
        let elementsid = trimId(tag);

        let tagli = $('<li>');
        let tagCheckbox = $('<input>');
        tagCheckbox.attr("type","checkbox");
        tagCheckbox.attr("onchange", "addAllTagsToList(this);")
            .attr("class", tag)
            .attr("id", tag + "," + buttonIdWithout);
        tagli.append(tagCheckbox);

        let tagButton = $('<button>');
        tagButton.attr("id", "btr" + elementsid)
            .attr("data-toggle", "collapse")
            .attr("data-target", "#ul" + elementsid);
        tagButton.html(tag);
        tagli.append(tagButton);

        createAllOptionsCheckbox(tagli, tag);

        var pathsul =$('<ul>');
        pathsul.attr("class", "panel-collapse collapse")
            .attr("id", "ul" + elementsid);

        for (let path in groupedPaths[tag]) {
            var pathli = document.createElement("li");
            pathli.setAttribute("class", "list-group");
            var internalpathul = document.createElement("ul");


            for (let i in groupedPaths[tag][path].methods) {
                var ili = document.createElement("li");

                let icheckbox = createCheckBox("addToList(this);",
                    buttonIdWithout
                    , groupedPaths[tag][path].endpoint + "," + groupedPaths[tag][path].methods[i]);

                ili.appendChild(icheckbox);
                ili.appendChild(document.createTextNode(groupedPaths[tag][path].methods[i]));
                ili.appendChild(createOptionsUL(groupedPaths[tag][path].endpoint + "," + groupedPaths[tag][path].methods[i], tag));
                internalpathul.appendChild(ili);
            }

            let checkbox = createCheckBox("addToList(this);", buttonIdWithout
                , "parent" + "=" + groupedPaths[tag][path].endpoint + "," + groupedPaths[tag][path].methods);

            text = (js.basePath !== "/" && js.basePath != null) ? js.basePath + groupedPaths[tag][path].endpoint : groupedPaths[tag][path].endpoint;
            pathli.appendChild(checkbox);
            pathli.appendChild(document.createTextNode(text));

            pathli.appendChild(internalpathul);
            pathsul.append(pathli);
            tagli.append(pathsul);

            ul.append(tagli);
        }
    }
    let tabpanediv = document.createElement("div");
    tabpanediv.setAttribute("class", "tab-pane fade active in");
    tabpanediv.setAttribute("id", "div" + tabid);
    $(tabpanediv).append(ul);
    di.append(tabpanediv);
    hideOtherTabs(tabpanediv);
}

function createCheckBox(onChangeFunction, classString, idString) {
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    if (idString != null)
        checkbox.id = idString;
    if (classString !== "")
        checkbox.className = classString;
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

function createOptionsUL(classString, tag) {
    let optionsUl = document.createElement("ul");

    let authorizeLi = document.createElement("li");
    let authorizeCheckbox = createCheckBox(null, tag, "");
    authorizeCheckbox.className = tag;
    authorizeCheckbox.id = "auth" + classString;
    let authorizeTextNode = document.createTextNode("Authorize");
    authorizeLi.appendChild(authorizeCheckbox);
    authorizeLi.appendChild(authorizeTextNode);

    let displayLi = document.createElement("li");
    let displayCheckBox = createCheckBox(null, tag, "");
    displayCheckBox.className = tag;
    displayCheckBox.checked = true;
    displayCheckBox.id = "disp" + classString;
    let displayTextNode = document.createTextNode("Display");
    displayLi.appendChild(displayCheckBox);
    displayLi.appendChild(displayTextNode);

/*    let idepondentLi = document.createElement("li");
    let idepondentCheckBox = createCheckBox(null, tag, "");
    idepondentCheckBox .className = tag;
    idepondentCheckBox .id = "disp" + classString;
    let idepondentTextNode = document.createTextNode("Idepondent");
    idepondentLi.appendChild(idepondentCheckBox );
    idepondentLi.appendChild(idepondentTextNode);*/

    let endpointLi = document.createElement("li");
    let endpointCheckBox = createCheckBox("displayInputText(this);", classString, "end" + classString);
    endpointLi.appendChild(endpointCheckBox);
    endpointLi.appendChild(document.createTextNode("\t\t Endpoint"));
    let endpointIn = document.createElement("input");
    endpointIn.className = tag;
    endpointIn.id = "end=" + classString;
    endpointIn.setAttribute("type", "text");
    endpointIn.value = "";
    endpointIn.style.display = "none";
    endpointLi.appendChild(endpointIn);


    let tagsLi = document.createElement("li");
    let tagsCheckBox = createCheckBox("displayInputText(this);", classString, "tag" + classString);
    tagsLi.appendChild(tagsCheckBox);
    tagsLi.appendChild(document.createTextNode("\t\t Tags"));
    let tagsIn = document.createElement("input");
    tagsIn.className = tag;
    tagsIn.id = "tags=" + classString;
    tagsIn.setAttribute("type", "text");
    tagsIn.value = "";
    tagsIn.style.display = "none";
    tagsLi.appendChild(tagsIn);

    let trnsTypeIdLi = document.createElement("li");
    let trnsTypeIdCheckBox = createCheckBox("displayInputText(this);", classString, "trns" + classString);
    trnsTypeIdLi.appendChild(trnsTypeIdCheckBox);
    trnsTypeIdLi.appendChild(document.createTextNode("\t\t TransactionType Id"));
    let trnsTypeIdIn = document.createElement("input");
    trnsTypeIdIn.className = tag;
    trnsTypeIdIn.id = "trns=" + classString;
    trnsTypeIdIn.setAttribute("type", "text");
    trnsTypeIdIn.value = "";
    trnsTypeIdIn.style.display = "none";
    trnsTypeIdLi.appendChild(trnsTypeIdIn);

    optionsUl.appendChild(authorizeLi);
    optionsUl.appendChild(displayLi);
    //optionsUl.appendChild(idepondentLi);
    optionsUl.appendChild(trnsTypeIdLi);
    optionsUl.appendChild(endpointLi);
    optionsUl.appendChild(tagsLi);

    return optionsUl;
}

function displayInputText(endpointOptionsCheckbox) {
    let inputElement;

    if (endpointOptionsCheckbox.id.includes("end")) {
        inputElement = document.getElementById("end=" + endpointOptionsCheckbox.className);
    } else if (endpointOptionsCheckbox.id.includes("tags")) {
        inputElement = document.getElementById("tags=" + endpointOptionsCheckbox.className);
    } else if (endpointOptionsCheckbox.id.includes("trns")) {
        inputElement = document.getElementById("trns=" + endpointOptionsCheckbox.className);
    }

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
    authorizeCheckbox.className = tag;
    let authorizeTextNode = document.createTextNode("Authorize All");
    tagliElement.append(authorizeCheckbox);
    tagliElement.append(authorizeTextNode);

    let displayCheckbox = createCheckBox("DisplayAllSubTagEndpoints(this);", tag, "");
    displayCheckbox.className = tag;
    let displayTextNode = document.createTextNode("Display All");
    tagliElement.append(displayCheckbox);
    tagliElement.append(displayTextNode);

}


function LogAllSubTagEndpoints(logAllElement) {
    let logCheckboxes = document.getElementsByClassName(logAllElement.className);
    let arrayLogCheckboxes = Array.from(logCheckboxes).filter(getOnlyLogCheckboxes);

    for (ach in arrayLogCheckboxes) {
        arrayLogCheckboxes[ach].checked = logAllElement.checked;
    }
}

function getOnlyLogCheckboxes(logCheckboxElem) {
    if (logCheckboxElem instanceof HTMLInputElement
        && logCheckboxElem.getAttribute('type') === 'checkbox'
        && logCheckboxElem.id !== ""
        && logCheckboxElem.id.includes("log")
    ) {
        return logCheckboxElem;
    }
}


function AuthorizeAllSubTagEndpoints(authorizeAllElement) {
    let authCheckboxes = document.getElementsByClassName(authorizeAllElement.className);
    let arrayAuthCheckboxes = Array.from(authCheckboxes).filter(getOnlyAuthCheckboxes);

    for (ach in arrayAuthCheckboxes) {
        arrayAuthCheckboxes[ach].checked = authorizeAllElement.checked;
    }
}

function getOnlyAuthCheckboxes(authCheckboxElem) {
    if (authCheckboxElem instanceof HTMLInputElement
        && authCheckboxElem.getAttribute('type') === 'checkbox'
        && authCheckboxElem.id !== ""
        && authCheckboxElem.id.includes("auth")
    ) {
        return authCheckboxElem;
    }
}

function DisplayAllSubTagEndpoints(displayAllElement) {
    let dispCheckboxes = document.getElementsByClassName(displayAllElement.className);
    let arrayDispCheckboxes = Array.from(dispCheckboxes).filter(getOnlyDispCheckboxes);

    for (ach in arrayDispCheckboxes) {
        arrayDispCheckboxes[ach].checked = displayAllElement.checked;
    }
}

function getOnlyDispCheckboxes(dispCheckboxElem) {
    if (dispCheckboxElem instanceof HTMLInputElement
        && dispCheckboxElem.getAttribute('type') === 'checkbox'
        && dispCheckboxElem.id !== ""
        && dispCheckboxElem.id.includes("disp")
    ) {
        return dispCheckboxElem;
    }
}