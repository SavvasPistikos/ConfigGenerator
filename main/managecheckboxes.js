function addToList(checkboxElem) {
    writetosessionStorage(checkboxElem);
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
        if (checkIfparentshouldbeUnChecked(chs) && parent === false) {
            ch = document.getElementById(parentpath);
            ch.checked = false;
        }
    }
    checkIfAllTagsCheckboxShouldBeChecked(checkboxElem);
    checkIfAllCheckboxShouldBeChecked(checkboxElem);
}

function checkIfparentshouldbeChecked(children) {
    var set = true;
    for (let i = 0; i < children.length; i++) {
        set = set & children[i].checked;
    }
    return set;
}

function checkIfAllCheckboxShouldBeChecked(checkboxElem) {
    let checked = true;
    let allcheck = document.getElementsByClassName(checkboxElem.className);
    var arrallch = Array.from(allcheck);

    for (x in arrallch) {
        if (arrallch[x].id !== "") {
            checked = checked & arrallch[x].checked;
        }
    }
    arrallch[0].checked = checked;
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

function addAllToList(allCheckBoxElement) {
    const checked = allCheckBoxElement.checked;
    let checkboxes = document.getElementsByClassName(allCheckBoxElement.className);
    let arr = (allCheckBoxElement.checked === true) ? Array.from(checkboxes).filter(getOnlyChildCheckboxes)
        : Array.from(checkboxes).filter(getOnlyChildCheckboxesToBeremoved);

    for (ch in arr) {
        arr[ch].checked = checked;
        addToList(arr[ch]);
    }
    allCheckBoxElement.checked = checked;

    for (let tag in tagList[allCheckBoxElement.className]) {
        $("#btr" + tagList[allCheckBoxElement.className][tag].replace(/\s/g, '')).click();
    }

}

function addAllTagsToList(tagCheckBoxElement) {
    const initialCheck = tagCheckBoxElement.checked;

    let id = tagCheckBoxElement.id.split(",")[1];
    let tag = tagCheckBoxElement.id.split(",")[0];

    for (let p in allGroupedByTags[id][tag]) {
        let checkboxId = "parent" + "=" + allGroupedByTags[id][tag][p].endpoint + "," + allGroupedByTags[id][tag][p].methods;
        let parentCheckbox = document.getElementById(checkboxId);
        parentCheckbox.checked = initialCheck;
        addToList(parentCheckbox);
    }
    tagCheckBoxElement.checked = initialCheck;
    $("#btr" + tagCheckBoxElement.className.replace(/\s/g, '')).click();
}

function checkIfAllTagsCheckboxShouldBeChecked(tagChb) {
    let foundTag;
    let checked = true;
    let endpoint = (tagChb.id.split("parent=")[1] != null) ? tagChb.id.split("parent=")[1].split(",")[0]
        : tagChb.id.split("parent=")[0].split(",")[0];

    for (let tag in allGroupedByTags[tagChb.className]) {
        for (let p in allGroupedByTags[tagChb.className][tag]) {
            if (allGroupedByTags[tagChb.className][tag][p].endpoint === endpoint) {
                foundTag = tag;
            }
        }
    }

    for (let p in allGroupedByTags[tagChb.className][foundTag]) {
        let checkbox = document.getElementById("parent=" +
            allGroupedByTags[tagChb.className][foundTag][p].endpoint
            + "," + allGroupedByTags[tagChb.className][foundTag][p].methods);
        checked = checked & checkbox.checked;
    }

    document.getElementById(foundTag + "," + tagChb.className).checked = checked;

}

function getOnlyChildCheckboxes(checkboxElem) {
    if (checkboxElem instanceof HTMLInputElement
        && checkboxElem.getAttribute('type') === 'checkbox'
        && checkboxElem.id !== ""
        && !checkboxElem.id.includes("parent")
        && checkboxElem.checked === false
    ) {
        return checkboxElem;
    }
}

function getOnlyChildCheckboxesToBeremoved(checkboxElem) {
    if (checkboxElem instanceof HTMLInputElement
        && checkboxElem.getAttribute('type') === 'checkbox'
        && checkboxElem.id !== ""
        && !checkboxElem.id.includes("parent")
        && checkboxElem.checked === true
    ) {
        return checkboxElem;
    }
}

window.onbeforeunload = function (e) {
    document.body = localStorage.getItem("body");
    return 'Dialog text here.';
};
