var listt = {};
var list = [];
var apiss = {apis: []};
var verbs = ["GET", "POST", "DELETE", "PUT"];
var js;

function importJson(liItem) {

    js = readJson(liItem.id + "swagger.json");
    var buttonElement = addButton(liItem.id);

    if (document.getElementById("div=" + buttonElement.id) == null) {
        let ul = document.createElement("ul");
        let di = document.createElement("div");
        let s = document.createElement("input");
        s.setAttribute("id", "inp=" + js.info.title.toString());
        s.setAttribute("type", "hidden");
        s.value = buttonElement.id.split("/")[1];
        di.appendChild(s);
        var obj = js.paths;

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
                icheckbox.setAttribute("class", buttonElement.id.split("/")[1]);

                ili.appendChild(icheckbox);
                ili.appendChild(document.createTextNode(method[i]));
                iul.appendChild(ili);
            }

            checkbox.setAttribute("onchange", "addToList(this);");
            checkbox.setAttribute("id", "parent" + "=" + path + "," + method);
            checkbox.setAttribute("class", buttonElement.id.split("/")[1]);

            text = path;
            li.appendChild(checkbox);
            li.appendChild(document.createTextNode(text));
            li.appendChild(document.createTextNode("\t\t Endpoint = "));
            let endpointIn = document.createElement("input");
            endpointIn.setAttribute("type","text");
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
            let name = p.toString();
            eval("api" + " = " + "{" + name + ":{url: \"\", version: \"\", paths: []}}" + ";");

            //let api = {api: {url: "", version: "", paths: []}};
            this.api[name].url = "http://";
            this.api[name].version = "v1.0";

            for (let i in listt[p]) {
                let path = {path: "", endpoint: "", method: "", tags: []};
                let res = listt[p][i].split(",");

                path.path = res[0];
                path.endpoint = document.getElementById("end=" + res[0]).value;
                path.method = res[1];

                eval("path.tags" + " = " + "js.paths[\"" + res[0] + "\"]." + res[1].toLocaleLowerCase() + ".tags;");
                this.api[name].paths.push(path);
            }
            list = [];

            apiss.apis.push(api);
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
        jsonOutput.innerHTML = JSON.stringify(apiss, null, 2);
    }

    hideOtherTabs(generateButton.id);
    console.log(JSON.stringify(apiss, null, 2));
    apiss.apis = [];
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
            list.push(checkboxid + "," + res[i + 1]);
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
            list = removeA(list, checkboxid.replace("parent=", ""));
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