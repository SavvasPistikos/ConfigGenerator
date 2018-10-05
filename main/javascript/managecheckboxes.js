function addToList(checkboxElem) {
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
        pathDTO.authorize = $(checkboxElem).data("authorize");
        pathDTO.display = ($(checkboxElem).data("display") === undefined) ? true : $(checkboxElem).data("display");
        pathDTO.endpoint = ($(checkboxElem).data("endpoint") === undefined) ? "" : $(checkboxElem).data("endpoint") === undefined;
        pathDTO.trnsTypeId = $(checkboxElem).data("trnstypeid");
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
    if(tagCheckBoxElement.checked === false){
        let parent = $(tagCheckBoxElement).parent();
        let allCheckBoxElement = $(parent).parent().children().get(0);
        allCheckBoxElement.checked = false;
    }
}

window.onbeforeunload = function (e) {
    document.body = localStorage.getItem("body");
    return 'Dialog text here.';
};
