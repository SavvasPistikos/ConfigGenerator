function addToList(checkboxElem) {
/*
    writetosessionStorage(checkboxElem);
*/
    let celem = $(checkboxElem);
/*    checkIfAllTagsCheckboxShouldBeChecked(checkboxElem);
    checkIfAllCheckboxShouldBeChecked(checkboxElem);*/
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
        let checkboxid = tagList[allCheckBoxElement.className][tag].replace(/\s/g, '');
        checkboxid = checkboxid.replace(".", "_");
        checkboxid = checkboxid.replace(/["'()]/g, "");
        $("#btr" + checkboxid).click();
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
    let checkboxid = tagCheckBoxElement.className.replace(/\s/g, '');
    checkboxid = checkboxid.replace(".", "_");
    checkboxid = checkboxid.replace(/["'()]/g, "");
    $("#btr" + checkboxid).click();
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
