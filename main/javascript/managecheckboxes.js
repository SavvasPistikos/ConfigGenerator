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
            trnstypeid: "",
            persist: {
                headers: [],
                queryparams: []
            },
            id: ""
        };

        pathDTO.path = $(checkboxElem).data("path");
        pathDTO.method = $(checkboxElem).data("method");
        pathDTO.authorize = ($(checkboxElem).data("authorize") === undefined) ? true : $(checkboxElem).data("authorize");
        pathDTO.display = ($(checkboxElem).data("display") === undefined) ? true : $(checkboxElem).data("display");
        pathDTO.endpoint = ($(checkboxElem).data("endpoint") === undefined) ? pathDTO.path : $(checkboxElem).data("endpoint");
        pathDTO.trnstypeid = ($(checkboxElem).data("trnstypeid") === undefined) ? "" : $(checkboxElem).data("trnstypeid");

        if ($(checkboxElem).data("tags") !== undefined) {
            let tags = $(checkboxElem).data("tags").split(",");
            for (let i in tags) {
                pathDTO.tags.push(tags[i]);
            }
        }

        if ($(checkboxElem).data("headers") !== undefined) {
            let headers = $(checkboxElem).data("headers").split(",");
            for (let i in headers) {
                pathDTO.persist.headers.push(headers[i]);
            }
        }

        if ($(checkboxElem).data("queryparams") !== undefined) {
            let queryparams = $(checkboxElem).data("queryparams").split(",");
            for (let i in queryparams) {
                pathDTO.persist.queryparams.push(queryparams[i]);
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
        parent = $(allCheckBoxElement).parent();
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
    tagCheckBoxElement.checked = false;
    jQuery.each($(ul).children(), function (i, child) {
        let fchild = $(child).children().get(0);
        if (fchild.checked === false || tagCheckBoxElement.checked === false)
            $(fchild).trigger("click");
    });
}

function manageParentCheckboxes(parentCheckbox) {
    let grandParentCheckBox = $(parentCheckbox).parent().siblings().get(0);
    let previousState = parentCheckbox.checked;
    parentCheckbox.checked = $(parentCheckbox).data("childCheckboxes") === 0 && $(parentCheckbox).data("maxChildren") > 0;

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


function writeToButton(element, value) {
    let el = $(element);
    let parent = $(el.parent());
    let attributeName = parent.text().trim();
    let outercheckbox = findOuterCheckbox(el);
    //let outercheckbox = parent.parent().siblings().get(0);

/*    if (el.is(":checkbox")) {
        $(outercheckbox).data(attributeName.toLowerCase(), element.checked);
    } else {
        $(outercheckbox).data(attributeName.toLowerCase(), el.val());
    }*/
    $(outercheckbox).data(attributeName.toLowerCase(), value);
    updatePath($(outercheckbox), attributeName.toLowerCase());
}

function updatePath(outercheckbox, attributeName) {
    let serviceList = list[outercheckbox.data("service")];
    if (serviceList !== undefined) {
        for (path of  serviceList) {
            if (path.path === outercheckbox.data("path") && path.method === outercheckbox.data("method")) {
                if (attributeName === "tags") {
                    let tags = outercheckbox.data(attributeName).split(",");
                    path[attributeName] = (tags.length === 1 && tags[0] === "") ? "" : tags;
                    return;
                }
                path[attributeName] = outercheckbox.data(attributeName);
            }
        }
    }
}

function findOuterCheckbox(element){

    if((element.attr("id") !== undefined) && element.attr("id").startsWith("_")){
        return $(element.parent()).children().get(0);
    } else {
        return findOuterCheckbox($(element.parent()));
    }
}