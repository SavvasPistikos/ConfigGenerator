var paths = [
    "swagger/auth/illinois",
    "swagger/auth/v1.0",
    "swagger/auth",
    "swagger/bifeed",
    "swagger/bos_adaptorj",
    "swagger/camelotadaptor",
    "swagger/claims",
    "swagger/consumables",
    "swagger/gamemanagement",
    "swagger/infostore/illinois",
    "swagger/infostore/opap",
    "swagger/infostore/v1.0",
    "swagger/promotionengine",
    "swagger/pulse",
    "swagger/validations"
];

function readJson(jsonPath) {
    var jsontext = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': jsonPath,
        'dataType': "json",
        'success': function (data) {
            jsontext = data;
        }
    });
    return jsontext;
}

$(document).ready(function () {
    $('.dropdown-submenu a.test').on("click", function (e) {
        $(this).next('ul').toggle();
        e.stopPropagation();
        e.preventDefault();
    });
});

$(document).ready(
    function generateDropDown() {
        var ulmenu = document.getElementsByClassName("dropdown-menu");
        var menu = ulmenu[0];

        for (let i = 0; i < paths.length; i++) {
            let path = paths[i].split("/");
            var absolutePath = path[0] + "/";
            for (let y = 1; y < path.length; y++) {
                absolutePath += path[y] + "/";
                if (document.getElementById(absolutePath) === null && y !== path.length - 1) {
                    let parentul = document.getElementById(absolutePath.replace(path[y] + "/", ""));
                    let li = document.createElement("li");
                    li.setAttribute("class", "dropdown-submenu");
                    li.innerHTML = "<a class=\"test\" tabindex=\"-1\" href=\"#\">" + path[y] + "<span class=\"caret\"></span></a>";

                    let ul = document.createElement("ul");
                    ul.setAttribute("class", "dorpdown-menu");
                    ul.setAttribute("id", absolutePath);
                    li.appendChild(ul);
                    if (y === 1) {
                        menu.appendChild(li);
                    }
                    else {
                        parentul.appendChild(li);
                    }
                }
                else if (document.getElementById(absolutePath) === null && y === path.length - 1) {
                    let parentul = document.getElementById(absolutePath.replace(path[y] + "/", ""));
                    if (parentul == null) {
                        parentul = menu;
                    }
                    let li = document.createElement("li");

                    if (document.getElementById(absolutePath) === null) {
                        li.setAttribute("id", absolutePath);
                        li.setAttribute("onclick", "importJson(this);")
                        li.innerHTML = "<a tabindex=\"-1\" href=\"#\">" + path[y] + "</a>";
                        parentul.appendChild(li);
                    }
                }
            }
            absolutePath = "";
        }
    });


