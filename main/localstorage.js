var checkboxesStatus = {};

function writetoLocalStorage(checkboxElem) {
    checkboxesStatus[checkboxElem.id] = checkboxElem.checked;
    localStorage.setItem("checkboxesStatus", JSON.stringify(checkboxesStatus));
    localStorage.setItem("allGroupedByTags", JSON.stringify(allGroupedByTags));
    localStorage.setItem("jsonList", JSON.stringify(jsonList));
}


$(document).ready(function () {
    $(document).on('change', '#JsonContentDiv', function () {
        localStorage.setItem("body", this.innerHTML);
        localStorage.setItem("buttons", document.getElementById("buttons").innerHTML);
    });
});

$(document).ready(function () {
    $(document).on('click', '.remove', function () {
        localStorage.setItem("body", document.getElementById("JsonContentDiv").innerHTML);
        localStorage.setItem("buttons", document.getElementById("buttons").innerHTML);
    });
});

//load
$(document).ready(function () {
    if (localStorage.getItem("body") != null && localStorage.getItem("buttons") != null && localStorage.getItem("checkboxesStatus") != null) {
        document.getElementById("JsonContentDiv").innerHTML = localStorage.getItem("body");
        document.getElementById("buttons").innerHTML = localStorage.getItem("buttons");
        allGroupedByTags = JSON.parse(localStorage.getItem("allGroupedByTags"));
        jsonList = JSON.parse(localStorage.getItem("jsonList"));
        let checkboxses = JSON.parse(localStorage.getItem("checkboxesStatus"));

        for (ch in checkboxses) {
            let checkbox = document.getElementById(ch);
            checkbox.checked = (checkboxses[ch] == true) ? true : false;
            addToList(checkbox);
        }

    }
});