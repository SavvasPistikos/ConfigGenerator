function addToList(checkboxElem) {
    let parent  = $(checkboxElem).parent();
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

        $(parentCheckbox).data("childCheckboxes",$(parentCheckbox).data("childCheckboxes") - 1);
        manageParentCheckboxes($(parent).parent().siblings().get(0));


        pathDTO.path = $(checkboxElem).data("path");
        pathDTO.method = $(checkboxElem).data("method");
        pathDTO.authorize = ($(checkboxElem).data("authorize") === undefined) ? true : $(checkboxElem).data("authorize");
        pathDTO.display = ($(checkboxElem).data("display") === undefined) ? true : $(checkboxElem).data("display");
        pathDTO.endpoint = ($(checkboxElem).data("endpoint") === undefined) ? "" : $(checkboxElem).data("endpoint") === undefined;
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
    } else if ($(checkboxElem).data("checked") === true) {
        $(parentCheckbox).data("childCheckboxes",$(parentCheckbox).data("childCheckboxes") + 1);
        manageParentCheckboxes($(parent).parent().siblings().get(0));

        list[$(checkboxElem).data("service")] = list[$(checkboxElem).data("service")]
            .filter(function (item) {
                return item.id !== $(checkboxElem).data("pathId");
            });
        $(checkboxElem).data("checked", false);
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
    jQuery.each($(ul).children(), function (i, child) {
        let fchild = $(child).children().get(0);
        if (fchild.checked === false || tagCheckBoxElement.checked === false)
            $(fchild).trigger("click");
    });
}

function manageParentCheckboxes(parentCheckbox){
    let grandParentCheckBox = $(parentCheckbox).parent().siblings().get(0);
    let previousState = parentCheckbox.checked;
    parentCheckbox.checked = $(parentCheckbox).data("childCheckboxes") === 0;

    if(grandParentCheckBox !== undefined){
        if (parentCheckbox.checked === true &&   $(parentCheckbox).data("childCheckboxes") === 0) {
            $(grandParentCheckBox).data("childCheckboxes", $(grandParentCheckBox).data("childCheckboxes") - 1);
            $(parentCheckbox).data("updatedParent",false);
            manageParentCheckboxes(grandParentCheckBox);
        }else if(parentCheckbox.checked === false &&   ($(parentCheckbox).data("childCheckboxes") === $(parentCheckbox).data("maxChildren"))){
            $(grandParentCheckBox).data("childCheckboxes", $(grandParentCheckBox).data("childCheckboxes") + 1);
            manageParentCheckboxes(grandParentCheckBox);
        }else if((previousState && !parentCheckbox.checked)
            && ($(parentCheckbox).data("childCheckboxes") <= $(parentCheckbox).data("maxChildren"))
        && $(parentCheckbox).data("updatedParent") === false){
            $(parentCheckbox).data("updatedParent",true);
            $(grandParentCheckBox).data("childCheckboxes", $(grandParentCheckBox).data("childCheckboxes") + 1);
            manageParentCheckboxes(grandParentCheckBox);
        }
    }
}


window.onbeforeunload = function (e) {
    document.body = localStorage.getItem("body");
    return 'Dialog text here.';
};
