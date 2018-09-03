function importJson(liItem) {
    buttonIdWithout = liItem.id.split("/")[0];
    js = (buttonIdWithout === "internal") ? readJson($('#' + liItem.id).data("id")) : JSON.parse(readJson($('#' + liItem.id).data("id")).content);

    if (document.getElementById("div" + liItem.id) == null) {
        jsonList[buttonIdWithout] = js;
        let servicesul = document.getElementById("services");

        let li = document.createElement("li");
        li.innerHTML = "<a data-toggle=\"tab\" href=\"#div" + liItem.id.replace(".", "_") + "\">"
            + "<button class=\"close closeTab\" type=\"button\" >×</button>"
            + liItem.id + "</a>";
        li.id = "close" + liItem.id;

        servicesul.appendChild(li);
        let ul = document.createElement("ul");
        let di = document.createElement("div");
        di.setAttribute("class", "tab-pane fade active in");
        di.setAttribute("id", "div" + liItem.id.replace(".", "_"));

        let groupedPaths = groupByTags(buttonIdWithout);
        allGroupedByTags[buttonIdWithout] = groupedPaths;

        let allCheckbox = createCheckBox("addAllToList(this);", buttonIdWithout, null);
        let url = createInputText(null, "url=" + buttonIdWithout);
        let version = createInputText(null, "vers=" + buttonIdWithout);

        ul.appendChild(allCheckbox);
        ul.appendChild(document.createTextNode("\t\t Url = "));
        ul.appendChild(url);
        ul.appendChild(document.createTextNode("\t\t version = "));
        ul.appendChild(version);

        let dum = document.getElementById("swaggers");
        groupByTagsDraw(groupedPaths, ul, dum, liItem.id.replace(".", "_"));
    } else {
        $('#close' + liItem.id).remove();
        $('#div' + liItem.id).remove();
    }
}

function handleFileSelect(evt) {
    //Retrieve the first (and only!) File from the FileList object
    var f = evt.target.files[0];

    if (f) {
        var r = new FileReader();
        r.onload = function (e) {
            importedJsonConfig = e.target.result;
            var impJson = JSON.parse(importedJsonConfig);
            importConfig(impJson);
            document.getElementById("upload").value = "";
        };
        r.readAsText(f);
    } else {
        alert("Failed to load file");
    }
}

function handleCopyPaste() {
    let config = $("#input-field").val();
    let impJson = JSON.parse(config);
    importConfig(impJson);
}

function importConfig(impJson) {
    for (a in impJson.apis) {
        apiss.apis[a] = impJson.apis[a];
        if (a === "internalApis") {
            continue;
        }
        let version = (impJson.apis[a].version != null) ? "/" + impJson.apis[a].version : "";
        importJson(document.getElementById(a + version.replace(".","_")));
        document.getElementById("url=" + a).value = impJson.apis[a].url;

        for (p in impJson.apis[a].paths) {
            let checkbox;
            if (impJson.apis[a].paths[p].path != null && impJson.apis[a].paths[p].endpoint != null) {
                checkbox = document.getElementById(impJson.apis[a].paths[p].path.replace(jsonList[a].basePath, "") + "," + impJson.apis[a].paths[p].method);
                if (checkbox == null) {
                    checkbox = document.getElementById(impJson.apis[a].paths[p].path + "," + impJson.apis[a].paths[p].method);
                }
            } else {
                checkbox = (impJson.apis[a].paths[p].path == null) ?
                    document.getElementById(impJson.apis[a].paths[p].endpoint.replace(jsonList[a].basePath, "") + "," + impJson.apis[a].paths[p].method)
                    : document.getElementById(impJson.apis[a].paths[p].path + "," + impJson.apis[a].paths[p].method)
                ;
            }
            checkbox.checked = true;
            addToList(checkbox);
        }
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

function groupByTagsDraw(groupedPaths, ul, di, tabid) {
    for (let tag in groupedPaths) {
        let elementsid = trimId(tag);

        let tagli = document.createElement("li");
        let tagCheckbox = document.createElement("input");
        tagCheckbox.type = "checkbox";
        tagCheckbox.setAttribute("onchange", "addAllTagsToList(this);");
        tagCheckbox.setAttribute("class", tag);
        tagCheckbox.setAttribute("id", tag + "," + buttonIdWithout);
        tagli.appendChild(tagCheckbox);

        let tagButton = document.createElement("button");
        tagButton.setAttribute("id", "btr" + elementsid);
        tagButton.setAttribute("data-toggle", "collapse");
        tagButton.setAttribute("data-target", "#ul" + elementsid);
        tagButton.innerHTML = tag;
        tagli.appendChild(tagButton);

        createAllOptionsCheckbox(tagli, tag);

        var pathsul = document.createElement("ul");
        pathsul.setAttribute("class", "panel-collapse collapse");
        pathsul.setAttribute("id", "ul" + elementsid);

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
            pathsul.appendChild(pathli);
            tagli.appendChild(pathsul);

            ul.appendChild(tagli);
        }
    }
    let tabpanediv = document.createElement("div");
    tabpanediv.setAttribute("class", "tab-pane fade active in");
    tabpanediv.setAttribute("id", "div" + tabid);
    tabpanediv.appendChild(ul);
    di.appendChild(tabpanediv);
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
    displayCheckBox.id = "disp" + classString;
    let displayTextNode = document.createTextNode("Display");
    displayLi.appendChild(displayCheckBox);
    displayLi.appendChild(displayTextNode);

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


    optionsUl.appendChild(authorizeLi);
    optionsUl.appendChild(displayLi);
    optionsUl.appendChild(endpointLi);
    optionsUl.appendChild(tagsLi);

    return optionsUl;
}

function displayInputText(endpointOptionsCheckbox) {
    let inputElement;
    let endpointInput = endpointOptionsCheckbox.id.includes("end");

    if (endpointInput === true) {
        inputElement = document.getElementById("end=" + endpointOptionsCheckbox.className);
    } else {
        inputElement = document.getElementById("tags=" + endpointOptionsCheckbox.className);
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
    tagliElement.appendChild(authorizeCheckbox);
    tagliElement.appendChild(authorizeTextNode);

    let displayCheckbox = createCheckBox("DisplayAllSubTagEndpoints(this);", tag, "");
    displayCheckbox.className = tag;
    let displayTextNode = document.createTextNode("Display All");
    tagliElement.appendChild(displayCheckbox);
    tagliElement.appendChild(displayTextNode);

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