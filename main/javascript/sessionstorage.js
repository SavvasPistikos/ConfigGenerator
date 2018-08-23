function writetosessionStorage(checkboxElem) {
    checkboxesStatus[checkboxElem.id] = checkboxElem.checked;
    sessionStorage.setItem("checkboxesStatus", JSON.stringify(checkboxesStatus));
    sessionStorage.setItem("allGroupedByTags", JSON.stringify(allGroupedByTags));
    sessionStorage.setItem("jsonList", JSON.stringify(jsonList));
    sessionStorage.setItem("tagList",JSON.stringify(tagList));
}


$(document).ready(function () {
    $(document).on('change', '#JsonContentDiv', function () {
        sessionStorage.setItem("body", this.innerHTML);
        sessionStorage.setItem("buttons", document.getElementById("buttons").innerHTML);
    });
});

$(document).ready(function () {
    $(document).on('click', '.remove', function () {
        sessionStorage.setItem("body", document.getElementById("JsonContentDiv").innerHTML);
        sessionStorage.setItem("buttons", document.getElementById("buttons").innerHTML);
    });
});

//load
$(document).ready(function () {
    if (sessionStorage.getItem("body") != null && sessionStorage.getItem("buttons") != null && sessionStorage.getItem("checkboxesStatus") != null) {
        document.getElementById("JsonContentDiv").innerHTML = sessionStorage.getItem("body");
        document.getElementById("buttons").innerHTML = sessionStorage.getItem("buttons");
        allGroupedByTags = JSON.parse(sessionStorage.getItem("allGroupedByTags"));
        jsonList = JSON.parse(sessionStorage.getItem("jsonList"));
        tagList = JSON.parse(sessionStorage.getItem("tagList"));
        let checkboxses = JSON.parse(sessionStorage.getItem("checkboxesStatus"));

        for (ch in checkboxses) {
            let checkbox = document.getElementById(ch);
            if (checkbox != null) {
                checkbox.checked = (checkboxses[ch] == true) ? true : false;
                addToList(checkbox);
            }
        }

    }
});