function addToList(checkboxElem) {
    let parent = $(checkboxElem).parent();
    let parentCheckbox;

    if ($(checkboxElem).data("service") === "internalApis") {
        parentCheckbox = parent.parent().parent().children().get(0);
    } else {
        parentCheckbox = $(parent).parent().siblings().get(0);
    }

    if ($(checkboxElem).data("checked") === false) {
        let pathDTO = {
            path: "",
            endpoint: "",
            method: "",
            tags: [],
            display: true,
            authorize: false,
            trnsTypeId: "",
            persist: {
                headers: [],
                queryParams: []
            },
            id: ""
        };

        pathDTO.path = $(checkboxElem).data("path");
        pathDTO.method = $(checkboxElem).data("method");
        pathDTO.authorize = ($(checkboxElem).data("authorize") === undefined) ? true : $(checkboxElem).data("authorize");
        pathDTO.display = ($(checkboxElem).data("display") === undefined) ? true : $(checkboxElem).data("display");
        pathDTO.endpoint = ($(checkboxElem).data("endpoint") === undefined) ? pathDTO.path : $(checkboxElem).data("endpoint");
        pathDTO.trnsTypeId = ($(checkboxElem).data("trnsTypeId") === undefined) ? "" : $(checkboxElem).data("trnsTypeId");

        if ($(checkboxElem).data("tags") !== undefined) {
            let tags = $(checkboxElem).data("tags").split(",");
            for (let i in tags) {
                pathDTO.tags.push(tags[i]);
            }
        }

        if ($(checkboxElem).data("headers") !== undefined) {
            let headers = $(checkboxElem).data("headers").split(",");
            for (let i in headers) {
                if (headers[i] !== "")
                    pathDTO.persist.headers.push(headers[i]);
            }
        }

        if ($(checkboxElem).data("queryParams") !== undefined) {
            let queryparams = $(checkboxElem).data("queryParams").split(",");
            for (let i in queryparams) {
                if (queryparams[i] !== "")
                    pathDTO.persist.queryParams.push(queryparams[i]);
            }
        }

        pathDTO.id = $(checkboxElem).data("pathId");

        if (list[$(checkboxElem).data("service")] === undefined) {
            list[$(checkboxElem).data("service")] = [];
        }

        list[$(checkboxElem).data("service")].push(pathDTO);
        $(checkboxElem).data("checked", true);

        $(parentCheckbox).data("childCheckboxes", $(parentCheckbox).data("childCheckboxes") - 1);
        manageParentCheckboxes(parentCheckbox);

        if ($(parentCheckbox).data("childCheckboxes") !== $(parentCheckbox).data("maxChildren") && $(checkboxElem).data("service") !== "internalApis") {
            $(parentCheckbox).next().css("background-color", "darksalmon");
        }

    } else if ($(checkboxElem).data("checked") === true) {
        list[$(checkboxElem).data("service")] = list[$(checkboxElem).data("service")]
            .filter(function (item) {
                return item.id !== $(checkboxElem).data("pathId");
            });
        $(checkboxElem).data("checked", false);
        $(parentCheckbox).data("childCheckboxes", $(parentCheckbox).data("childCheckboxes") + 1);
        manageParentCheckboxes(parentCheckbox);
        if ($(parentCheckbox).data("childCheckboxes") === $(parentCheckbox).data("maxChildren")) {
            $(parentCheckbox).next().css("background-color", "");
        }
    }
}

function addAllToList(allCheckBoxElement) {
    let parent;
    if ($(allCheckBoxElement).data("internal") === true) {
        parent = $(allCheckBoxElement).siblings('li');
    } else {
        parent = $(allCheckBoxElement).closest("ul");
    }
    jQuery.each($(parent).children("li"), function (i, child) {
        let fchild = $(child).children().get(0);
        if (fchild.checked === false || allCheckBoxElement.checked === false)
            $(fchild).trigger("click");
    });
}

function triggerAllTagsToList(tagCheckBoxElement) {
    let ul = $(tagCheckBoxElement).siblings().get(3);
    //TODO
    /*
    Set it to false because cannot think of some thing better for the manageParentCheckboxes
     */
    //tagCheckBoxElement.checked = false; //TODO further check. Seems to be working.
    jQuery.each($(ul).children(), function (i, child) {
        let fchild = $(child).children().get(0);
        if (fchild.checked === false || tagCheckBoxElement.checked === false)
            $(fchild).trigger("click");
    });
}

function manageParentCheckboxes(parentCheckbox) {
    let grandParentCheckBox = $(parentCheckbox).parent().siblings().get(0);
    let previousState = parentCheckbox.checked;
    if(grandParentCheckBox === undefined){
        $(parentCheckbox).children(":checkbox").attr("checked", $(parentCheckbox).data("childCheckboxes") === 0 && $(parentCheckbox).data("maxChildren") > 0);
    } else {
        parentCheckbox.checked = $(parentCheckbox).data("childCheckboxes") === 0 && $(parentCheckbox).data("maxChildren") > 0;
    }

    if (grandParentCheckBox !== undefined) {
        if (parentCheckbox.checked === true && $(parentCheckbox).data("childCheckboxes") === 0) {
            $(grandParentCheckBox).data("childCheckboxes", $(grandParentCheckBox).data("childCheckboxes") - 1);
        } else if (parentCheckbox.checked === false && ($(parentCheckbox).data("childCheckboxes") === $(parentCheckbox).data("maxChildren"))) {
            $(grandParentCheckBox).data("childCheckboxes", $(grandParentCheckBox).data("childCheckboxes") + 1);
        } else if (previousState && !parentCheckbox.checked && $(parentCheckbox).data("childCheckboxes") === 1) {
            $(grandParentCheckBox).data("childCheckboxes", $(grandParentCheckBox).data("childCheckboxes") + 1);
        } else if (!previousState && parentCheckbox.checked && ($(parentCheckbox).data("childCheckboxes") === $(parentCheckbox).data("maxChildren"))) {
            $(grandParentCheckBox).data("childCheckboxes", $(grandParentCheckBox).data("childCheckboxes") + -1);
        }
        manageParentCheckboxes(grandParentCheckBox);
    }
}

/*window.onbeforeunload = function (e) {
    document.body = localStorage.getItem("body");
    return 'Dialog text here.';
};*/


function writeToButton(element, attributeName, value) {
    let outercheckbox = findOuterCheckbox($(element));
    updateOuterCheckbox(outercheckbox, attributeName, value);

    if (outercheckbox.checked === true) {
        updatePath($(outercheckbox), attributeName, value);
    }
}

function updatePath(outercheckbox, attributeName, value) {
    let serviceList = list[outercheckbox.data("service")];
    if (serviceList !== undefined) {
        for (path of  serviceList) {
            if (path.path === outercheckbox.data("path") && path.method === outercheckbox.data("method")) {
                if (attributeName === "tags") {
                    let tags = outercheckbox.data(attributeName).split(",");
                    path[attributeName] = (tags.length === 1 && tags[0] === "") ? "" : tags;
                    return;
                } else if (attributeName === "headers" || attributeName === "queryParams") {
                    let attrs = outercheckbox.data(attributeName).split(",");
                    path.persist[attributeName] = (attrs.length === 1 && attrs[0] === "") ? "" : attrs;
                    return;
                }
                path[attributeName] = outercheckbox.data(attributeName);
            }
        }
    }
}

function findOuterCheckbox(element) {
    if ((element.attr("id") !== undefined) && element.attr("id").startsWith("_")) {
        return $(element.parent()).children().get(0);
    } else {
        return findOuterCheckbox($(element.parent()));
    }
}

function updateOuterCheckbox(outercheckbox, attributeName, value) {
    let name = attributeName.split(".")[1] !== undefined ? attributeName.split(".")[1] : attributeName;
    $(outercheckbox).data(name, value);
}