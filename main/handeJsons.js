var listt = {};
var jsonList = [];
var apiss = {apis: {}};
var verbs = ["GET", "POST", "DELETE", "PUT"];
var js;
var importedJsonConfig;

function importJson(liItem) {
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
        var obj = js.paths;

        let allCheckbox = document.createElement("input");
        allCheckbox.type = "checkbox";
        allCheckbox.setAttribute("class", buttonElement.id.split("/")[1]);
        allCheckbox.setAttribute("onchange", "addAllToList(this)");
        allCheckbox.value = "Select all";


        let url = document.createElement("input");
        url.setAttribute("type", "text");
        url.value = "";
        url.setAttribute("id", "url=" + buttonElement.id.split("/")[1]);


        let version = document.createElement("input");
        version.setAttribute("type", "text");
        version.value = "";
        version.setAttribute("id", "vers=" + buttonElement.id.split("/")[1]);

        ul.appendChild(allCheckbox);
        ul.appendChild(document.createTextNode("\t\t Url = "));
        ul.appendChild(url);
        ul.appendChild(document.createTextNode("\t\t version = "));
        ul.appendChild(version);


        for (var path in obj) {
            var li = document.createElement("li");
            var checkbox = document.createElement('input');
            checkbox.type = "checkbox";
            var method = [];
            if (obj[path]["get"] != null) {
                method.push("GET");
            }
            if (obj[path]["post"] != null) {
                method.push("POST");
            }
            if (obj[path]["delete"] != null) {
                method.push("DELETE");
            }
            if (obj[path]["put"] != null) {
                method.push("PUT");
            }
            var iul = document.createElement("ul");

            for (var i in method) {

                var ili = document.createElement("li");
                var icheckbox = document.createElement('input');
                icheckbox.type = "checkbox";
                icheckbox.setAttribute("onchange", "addToList(this);");
                icheckbox.setAttribute("class", buttonElement.id.split("/")[1]);
                icheckbox.setAttribute("id", path + "," + method[i]);
                let id = path + "," + method[i];

                ili.appendChild(icheckbox);
                ili.appendChild(document.createTextNode(method[i]));
                iul.appendChild(ili);
            }

            checkbox.setAttribute("onchange", "addToList(this);");
            checkbox.setAttribute("class", buttonElement.id.split("/")[1]);
            checkbox.setAttribute("id", "parent" + "=" + path + "," + method);

            text = (js.basePath !== "/" && js.basePath != null) ? js.basePath + path : path;
            li.appendChild(checkbox);
            li.appendChild(document.createTextNode(text));
            li.appendChild(document.createTextNode("\t\t Endpoint = "));
            let endpointIn = document.createElement("input");
            endpointIn.setAttribute("type", "text");
            endpointIn.value = "";
            //endpointIn.setAttribute("onfocus", "this.style.width = ((this.value.length + 4) * 7) + 'px';")
            endpointIn.setAttribute("id", "end=" + path);
            li.appendChild(endpointIn);
            li.appendChild(iul);
            ul.appendChild(li);

            di.appendChild(ul);
            di.setAttribute("class", "JsonContent");
            di.setAttribute("id", "div=" + buttonElement.id.replace("bt=", ""));
            di.style.display = "initial";
            buttonElement.innerHTML = js.info.title;
            document.body.appendChild(di);
        }
        hideOtherTabs(buttonElement.id);
    }
}

function addButton(buttonId) {
    let div = document.getElementById("buttons");
    let newButton = document.createElement("button");
    newButton.setAttribute("class", "mybutton");
    newButton.setAttribute("onclick", "hideOtherTabs(this.id);");
    newButton.setAttribute("id", "bt=" + buttonId);
    newButton.innerHTML = js.info.title;

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