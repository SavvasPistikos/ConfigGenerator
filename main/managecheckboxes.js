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
    //checkIfAllCheckboxShouldBeChecked(ch);
}

function checkIfparentshouldbeChecked(children) {
    var set = true;
    for (let i = 0; i < children.length; i++) {
        set = set & children[i].checked;
    }
    return set;
}

function checkIfAllCheckboxShouldBeChecked(ch) {
    let counter = 0;
    let allcheck = document.getElementsByClassName(ch.className);
    var arrallch = Array.from(allcheck);

    for (x in arrallch) {
        if (arrallch[x].checked === false) {
            counter++;
        }
    }
    arrallch[0].checked = (counter === 1);
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
    let checkboxes = document.getElementsByClassName(allCheckBoxElement.className);
    let arr = (allCheckBoxElement.checked === true) ? Array.from(checkboxes).filter(getOnlyChildCheckboxes)
        : Array.from(checkboxes).filter(getOnlyChildCheckboxesToBeremoved);

    for (ch in arr) {
        arr[ch].checked = allCheckBoxElement.checked;
        addToList(arr[ch]);
    }
}

function addAllTagsToList(tagCheckBoxElement) {
    let id = tagCheckBoxElement.id.split(",")[1];
    let tag = tagCheckBoxElement.id.split(",")[0];

    for (let p in allGroupedByTags[id][tag]) {
        let checkboxId = "parent" + "=" + allGroupedByTags[id][tag][p].endpoint + "," + allGroupedByTags[id][tag][p].methods;
        let parentCheckbox = document.getElementById(checkboxId);
        parentCheckbox.checked = tagCheckBoxElement.checked;
        addToList(parentCheckbox);
    }
}

function checkIfAllTagsCheckboxShouldBeChecked(ch) {
    let foundTag;
    let endpoint = (ch.id.split("parent=")[1] !== null) ? ch.id.split("parent=")[1]
        : ch.id.split("parent=")[0];

    for (let tag in allGroupedByTags[ch.className]) {
        for (let p in allGroupedByTags[ch.className][tag]) {
            foundTag = (allGroupedByTags[ch.className][tag][p].endpoint === endpoint) ? tag : "";
        }
    }

    for (let p in allGroupedByTags[ch.className][foundTag]) {
        let checkbox = document.getElementById()
    }

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

