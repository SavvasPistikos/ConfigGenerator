var listt = {};
var jsonList = {};
var apiss = {apis: {}};
var verbs = ["GET", "POST", "DELETE", "PUT"];
var js;
var importedJsonConfig;
var allGroupedByTags = {};
var outerdiv;

function importJson(liItem) {
    outerdiv = document.getElementById("JsonContentDiv");
    js = readJson(liItem.id + "swagger.json");
    var buttonElement = addButton(liItem.id);
    jsonList[buttonElement.id.split("/")[1]] = js;

    if (document.getElementById("div=" + buttonElement.id) == null) {
        let ul = document.createElement("ul");
        let di = document.createElement("div");
        let s = document.createElement("input");
        s.setAttribute("id", "inp=" + js.info.title.toString());
        s.setAttribute("type", "hidden");
        s.value = buttonElement.id.split("/")[1];
        di.appendChild(s);

        let groupedPaths = groupByTags();
        allGroupedByTags[buttonElement.id.split("/")[1]] = groupedPaths;

        let allCheckbox = createCheckBox("addAllToList(this);", buttonElement.id.split("/")[1], null);
        let url = createInputText(null, "url=" + buttonElement.id.split("/")[1]);
        let version = createInputText(null, "vers=" + buttonElement.id.split("/")[1]);

        ul.appendChild(allCheckbox);
        ul.appendChild(document.createTextNode("\t\t Url = "));
        ul.appendChild(url);
        ul.appendChild(document.createTextNode("\t\t version = "));
        ul.appendChild(version);

        groupByTagsDraw(groupedPaths, buttonElement, ul, di);

        hideOtherTabs(buttonElement.id);
    }
}

function addButton(buttonId) {
    let div = document.getElementById("buttons");
    let newButton = document.createElement("button");
    newButton.setAttribute("class", "mybutton");
    newButton.setAttribute("onclick", "hideOtherTabs(this.id);");
    newButton.setAttribute("id", "bt=" + buttonId);
    newButton.innerHTML = (js.info == null) ? buttonId.split("/"[1]) : js.info.title;

    let removeButton = document.createElement("button");
    removeButton.setAttribute("class", "remove");
    removeButton.setAttribute("onclick", "removeAssociatedItems(this.id);");
    removeButton.setAttribute("id", "remove=" + buttonId);

    let generate = document.getElementById("generate");
    div.removeChild(generate);
    div.appendChild(newButton);
    div.appendChild(removeButton);
    div.appendChild(generate);

    return newButton;
}

function removeAssociatedItems(buttonId) {
    let bId = buttonId.replace("remove=", "bt=");
    var button = document.getElementById(bId);
    button.parentNode.removeChild(button);

    let dId = buttonId.replace("remove=", "div=");
    var dIv = document.getElementById(dId);
    dIv.parentNode.removeChild(dIv);

    var rbutton = document.getElementById(buttonId);
    rbutton.parentNode.removeChild(rbutton);

    let apiName = bId.split("/")[1];
    listt[apiName] = [];

    if (document.getElementsByClassName("JsonContent").length === 1) {
        document.getElementById("jsonOutput").hidden = true;
        document.getElementById("jsonOutput").innerHTML = "";
    }

}

function hideOtherTabs(jsonName) {
    var i, tabcontent;
    tabcontent = document.getElementsByClassName("JsonContent");
    document.getElementById("div=" + jsonName.replace("bt=", "")).style.display = "initial";
    for (i = 0; i < tabcontent.length; i++) {
        if (tabcontent[i].id !== "div=" + jsonName.replace("bt=", "")) {
            tabcontent[i].style.display = "none";
        }
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

function importConfig(impJson) {
    for (a in impJson.apis) {
        apiss.apis[a] = impJson.apis[a];
        if (a === "internalApis") {
            continue;
        }
        let version = (impJson.apis[a].version != null) ? impJson.apis[a].version + "/" : "";
        importJson(document.getElementById("swagger/" + a + "/" + version));
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

function groupByTags() {
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

    return groupedPaths;
}

function groupByTagsDraw(groupedPaths, buttonElement, ul, di) {
    for (let tag in groupedPaths) {
        let tagli = document.createElement("li");
        let tagCheckbox = document.createElement("input");
        tagCheckbox.type = "checkbox";
        tagCheckbox.setAttribute("onchange", "addAllTagsToList(this);");
        tagCheckbox.setAttribute("class", tag);
        tagCheckbox.setAttribute("id", tag + "," + buttonElement.id.split("/")[1]);
        tagli.appendChild(tagCheckbox);
        tagli.appendChild(document.createTextNode(tag));

        var pathsul = document.createElement("ul");

        for (let path in groupedPaths[tag]) {
            var pathli = document.createElement("li");
            var internalpathul = document.createElement("ul");

            for (let i in groupedPaths[tag][path].methods) {
                var ili = document.createElement("li");

                let icheckbox = createCheckBox("addToList(this);",
                    buttonElement.id.split("/")[1]
                    , groupedPaths[tag][path].endpoint + "," + groupedPaths[tag][path].methods[i]);

                ili.appendChild(icheckbox);
                ili.appendChild(document.createTextNode(groupedPaths[tag][path].methods[i]));
                internalpathul.appendChild(ili);
            }

            let checkbox = createCheckBox("addToList(this);", buttonElement.id.split("/")[1]
                , "parent" + "=" + groupedPaths[tag][path].endpoint + "," + groupedPaths[tag][path].methods);

            text = (js.basePath !== "/" && js.basePath != null) ? js.basePath + groupedPaths[tag][path].endpoint : groupedPaths[tag][path].endpoint;
            pathli.appendChild(checkbox);
            pathli.appendChild(document.createTextNode(text));
            pathli.appendChild(document.createTextNode("\t\t Endpoint = "));

            let endpointIn = document.createElement("input");
            endpointIn.setAttribute("type", "text");
            endpointIn.value = "";
            //endpointIn.setAttribute("onfocus", "this.style.width = ((this.value.length + 4) * 7) + 'px';")
            endpointIn.setAttribute("id", "end=" + groupedPaths[tag][path].endpoint);
            pathli.appendChild(endpointIn);
            pathli.appendChild(internalpathul);
            pathsul.appendChild(pathli);
            tagli.appendChild(pathsul);

            ul.appendChild(tagli);
            di.appendChild(ul);
            di.setAttribute("class", "JsonContent");
            di.setAttribute("id", "div=" + buttonElement.id.replace("bt=", ""));
            di.style.display = "initial";
            buttonElement.innerHTML = js.info.title;
            outerdiv.appendChild(di);
            //document.body.appendChild(di);
        }
    }

}

function noTagsDraw(groupedPaths, buttonElement, ul, di) {
    for (var path in groupedPaths) {
        var li = document.createElement("li");
        var method = [];
        if (groupedPaths[path]["get"] != null) {
            method.push("GET");
        }
        if (groupedPaths[path]["post"] != null) {
            method.push("POST");
        }
        if (groupedPaths[path]["delete"] != null) {
            method.push("DELETE");
        }
        if (groupedPaths[path]["put"] != null) {
            method.push("PUT");
        }
        var iul = document.createElement("ul");

        for (var i in method) {

            var ili = document.createElement("li");
            let icheckbox = createCheckBox("addToList(this);",
                buttonElement.id.split("/")[1], path + "," + method[i]);
            ili.appendChild(icheckbox);
            ili.appendChild(document.createTextNode(method[i]));
            iul.appendChild(ili);
        }

        let checkbox = createCheckBox("addToList(this);", buttonElement.id.split("/")[1]
            , "parent" + "=" + path + "," + method);

        text = (js.basePath !== "/" && js.basePath != null) ? js.basePath + path : path;
        li.appendChild(checkbox);
        li.appendChild(document.createTextNode(text));
        li.appendChild(document.createTextNode("\t\t Endpoint = "));
        let endpointIn = document.createElement("input");
        endpointIn.setAttribute("type", "text");
        endpointIn.value = "";
        endpointIn.setAttribute("id", "end=" + path);
        li.appendChild(endpointIn);
        li.appendChild(iul);
        ul.appendChild(li);

        di.appendChild(ul);
        di.setAttribute("class", "JsonContent");
        di.setAttribute("id", "div=" + buttonElement.id.replace("bt=", ""));
        di.style.display = "initial";
        buttonElement.innerHTML = js.info.title;
        outerdiv.appendChild(di);
        //document.body.appendChild(di);
    }
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