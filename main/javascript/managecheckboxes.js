function addToList(checkboxElem) {
    let parent = $(checkboxElem).parent();
    let parentCheckbox = $(parent).parent().siblings().get(0);
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
        pathDTO.trnsTypeId = ($(checkboxElem).data("trnstypeid") === undefined) ? "" : $(checkboxElem).data("trnstypeid");
        if ($(checkboxElem).data("tags") !== undefined) {
            let tags = $(checkboxElem).data("tags").trim();
            pathDTO.tags = tags.split(",");
        }
        pathDTO.id = $(checkboxElem).data("pathId");

        if (list[$(checkboxElem).data("service")] === undefined) {
            list[$(checkboxElem).data("service")] = [];
        }

        list[$(checkboxElem).data("service")].push(pathDTO);
        $(checkboxElem).data("checked", true);

        $(parentCheckbox).data("childCheckboxes", $(parentCheckbox).data("childCheckboxes") - 1);
        manageParentCheckboxes($(parent).parent().siblings().get(0));
    } else if ($(checkboxElem).data("checked") === true) {
        list[$(checkboxElem).data("service")] = list[$(checkboxElem).data("service")]
            .filter(function (item) {
                return item.id !== $(checkboxElem).data("pathId");
            });
        $(checkboxElem).data("checked", false);
        $(parentCheckbox).data("childCheckboxes", $(parentCheckbox).data("childCheckboxes") + 1);
        manageParentCheckboxes($(parent).parent().siblings().get(0));
    }
}

function addAllToList(allCheckBoxElement) {
    let parent = $(allCheckBoxElement).parent();
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
    parentCheckbox.checked = $(parentCheckbox).data("childCheckboxes") === 0;

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


function writeToButton(element) {
    let el = $(element);
    let parent = $(el.parent());
    let attributeName = parent.text().trim();
    let outercheckbox = parent.parent().siblings().get(0);

    if (el.is(":checkbox")) {
        $(outercheckbox).data(attributeName, element.checked);
    } else {
        $(outercheckbox).data(attributeName, el.val());
    }
    updatePath($(outercheckbox), attributeName);
}

function updatePath(outercheckbox, attributeName) {
    let serviceList = list[outercheckbox.data("service")];
    for (path of  serviceList) {
        if (path.path === outercheckbox.data("path")) {
            path[attributeName] = outercheckbox.data(attributeName);
        }
    }
}