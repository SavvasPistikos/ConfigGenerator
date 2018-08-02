var listt = {};
var jsonList = [];
var apiss = {};
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
        allCheckbox.setAttribute("class", buttonElement.id.split("/").slice(1, 15));
        allCheckbox.setAttribute("onchange", "addAllToList(this)");
        allCheckbox.value = "Select all";
        ul.appendChild(allCheckbox);


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
                icheckbox.setAttribute("id", path + "," + method[i]);
                icheckbox.setAttribute("class", buttonElement.id.split("/").slice(1, 15));
                let id = path + "," + method[i];

                ili.appendChild(icheckbox);
                ili.appendChild(document.createTextNode(method[i]));
                iul.appendChild(ili);
            }

            checkbox.setAttribute("onchange", "addToList(this);");
            checkbox.setAttribute("id", "parent" + "=" + path + "," + method);
            checkbox.setAttribute("class", buttonElement.id.split("/").slice(1, 15));

            text = (js.basePath !== "/") ? js.basePath + path : path;
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

    let apiName = bId.split("/").slice(1, 15);
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


function generate(generateButton) {
    for (let p in listt) {
        if (listt[p].length > 0) {
            let apiName = p.replace(",", "/").split("/")[0];

            //eval("api" + " = " + "{" + apiName + ":{url: \"\", version: \"\", paths: []}}" + ";");
            apiss[apiName] = {url:"",version: "", paths:[]};

            //let api = {api: {url: "", version: "", paths: []}};
            apiss[apiName].url = "http://";
            apiss[apiName].version = p.replace(",", "/").split("/").slice(1, 15).join("/").replace(",", "");

            for (let i in listt[p]) {
                let path = {path: "", endpoint: "", method: "", tags: [], internal: false, display: true};
                let res = listt[p][i].split(",");

                let basePath = (jsonList[apiName].basePath !== "/") ? jsonList[apiName].basePath : "";
                path.path = basePath + res[0];
                path.endpoint = (document.getElementById("end=" + res[0]).value === "") ? path.path
                    : basePath + document.getElementById("end=" + res[0]).value;
                path.method = res[1];

                eval("path.tags" + " = " + "jsonList[\"" + apiName + "\"].paths[\"" + res[0] + "\"]."
                    + res[1].toLocaleLowerCase() + ".tags;");
                apiss[apiName].paths.push(path);
            }

            //apiss.apis.push(api);
        }
    }

    let alreadyGenerated = document.getElementById("div=" + generateButton.id);
    if (alreadyGenerated == null) {
        let generatediv = document.createElement("div");
        generatediv.setAttribute("id", "div=" + generateButton.id);
        generatediv.setAttribute("class", "JsonContent");
        let jsonOutput = document.createElement("textarea");
        jsonOutput.setAttribute("rows", "30");
        jsonOutput.setAttribute("cols", "50");
        jsonOutput.setAttribute("id", "jsonOutput");
        jsonOutput.innerHTML = JSON.stringify(apiss, null, 2);
        generatediv.appendChild(jsonOutput);
        document.body.appendChild(generatediv);
    } else {
        jsonOutput.hidden = false;
        jsonOutput.innerHTML = JSON.stringify(apiss, null, 2);
    }

    hideOtherTabs(generateButton.id);
    console.log(JSON.stringify(apiss, null, 2));
    apiss= {};
}

function addToList(checkboxElem) {
    if (listt[checkboxElem.className] == null) {
        listt[checkboxElem.className] = [];
    }
    let checkboxid;
    const res = checkboxElem.id.split(",");
    let pathi = res[0];
    let parentpath = "parent=" + pathi;
    if (checkboxElem.checked) {
        let chs = [];
        let parent = pathi.includes("parent=");
        if (parent === true) {
            pathi = pathi.replace("parent=", "");
            checkboxid = pathi;
        } else {
            checkboxid = pathi;
            pathi = "parent=" + checkboxid;

            for (let i = 0; i < verbs.length; i++) {
                if (document.getElementById(checkboxid + "," + verbs[i]) != null) {
                    parentpath += "," + verbs[i];
                    chs.push(document.getElementById(checkboxid + "," + verbs[i]))
                }
            }
        }

        for (let i = 0; i < res.length - 1; i++) {
            listt[checkboxElem.className].push(checkboxid + "," + res[i + 1]);
            checkboxElem.checked = true;
            var ch = document.getElementById(pathi + "," + res[i + 1]);
            if (ch != null) {
                ch.checked = true;
            }

        }
        if (checkIfparentshouldbeChecked(chs) && parent === false) {
            ch = document.getElementById(parentpath);
            ch.checked = true;
        }

    } else {
        let chs = [];
        let parent = pathi.includes("parent=");
        if (parent === true) {
            pathi = pathi.replace("parent=", "");
            checkboxid = pathi;
        } else {
            checkboxid = pathi;
            pathi = "parent=" + checkboxid;

            for (let i = 0; i < verbs.length; i++) {
                if (document.getElementById(checkboxid + "," + verbs[i]) != null) {
                    parentpath += "," + verbs[i];
                    chs.push(document.getElementById(checkboxid + "," + verbs[i]))
                }
            }
        }
        for (let j = 0; j < res.length - 1; j++) {
            checkboxid = pathi + "," + res[j + 1];
            listt[checkboxElem.className] = removeA(
                listt[checkboxElem.className], checkboxid.replace("parent=", "")
            );
            ch = document.getElementById(checkboxid);
            if (ch != null) {
                ch.checked = false;
            }
        }
        if (!checkIfparentshouldbeUnChecked(chs) && parent === false) {
            ch = document.getElementById(parentpath);
            ch.checked = false;
        }
    }
}

function checkIfparentshouldbeChecked(children) {
    var set = true;
    for (let i = 0; i < children.length; i++) {
        set = set & children[i].checked;
    }
    return set;
}

function checkIfparentshouldbeUnChecked(children) {
    var set = false;
    for (let i = 0; i < children.length; i++) {
        set = set || children[i].checked;
    }
    return set;
}

function removeA(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax = arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
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
        let version = (impJson.apis[a].version != null) ? impJson.apis[a].version + "/" : "";
        importJson(document.getElementById("swagger/" + a + "/" + version));
        for (s in impJson.apis[a]) {
            for (p in impJson.apis[a].paths) {
                let checkbox;
                if (impJson.apis[a].paths[p].path != null && impJson.apis[a].paths[p].endpoint != null) {
                    checkbox = document.getElementById(impJson.apis[a].paths[p].path.replace(jsonList[a].basePath, "") + "," + impJson.apis[a].paths[p].method);
                    if(checkbox == null){
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

}

function addAllToList(allCheckBoxElement) {

    let checkboxes = document.getElementsByClassName(allCheckBoxElement.className);
    let arr = Array.from(checkboxes).filter(getOnlyChildCheckboxes);
    for (ch in arr) {
        arr[ch].checked = allCheckBoxElement.checked;
        addToList(arr[ch]);

    }
}

function getOnlyChildCheckboxes(checkboxElem) {
    if (checkboxElem instanceof HTMLInputElement
        && checkboxElem.getAttribute('type') === 'checkbox'
        && checkboxElem.id !== ""
        && !checkboxElem.id.includes("parent")) {

        return checkboxElem;
    }
}