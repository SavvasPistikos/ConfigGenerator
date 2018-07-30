var paths = [
    "swagger/auth/illinois/swagger.json",
    "swagger/auth/v1.0/swagger.json",
    "swagger/auth/swagger.json",
    "swagger/bifeed/swagger.json",
    "swagger/bos-adaptorj/swagger.json",
    "swagger/camelotadaptor/swagger.json",
    "swagger/claims/swagger.json",
    "swagger/consumables/swagger.json",
    "swagger/gamemanagement/swagger.json",
    "swagger/infostore/illinois/swagger.json",
    "swagger/infostore/opap/swagger.json",
    "swagger/infostore/v1.0/swagger.json",
    "swagger/promoteengine/swagger.json",
    "swagger/pulse/swagger.json",
    "swagger/validations/swagger.json"
];


json = readJson("swagger/infostore/illinois/swagger.json");
json2 = readJson("swagger/bifeed/swagger.json");


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


$(document).ready(
    function generateDropDown() {
        var ulmenu = document.getElementsByClassName("dropdown-menu");
        var menu = ulmenu[0];

        let li = document.createElement("li");
        li.setAttribute("id", "swagger");
        li.innerHTML = "<a class=\"test\" tabindex=\"-1\" href=\"#\">Swagger <span class=\"caret\"></span></a>";
        li.setAttribute("class", "dropdown-submenu");
        menu.appendChild(li);


        for (let i = 0; i < paths.length; i++) {
            let path = paths[i].split("/");

            for (let y = 1; y < path.length; y++) {
                if (document.getElementById(path[y]) === null && y !== path.length - 1) {
                    let parentli = document.getElementById(path[y - 1]);
                    let ul = document.createElement("ul");
                    ul.setAttribute("class", "dropdown-menu");
                    let li = document.createElement("li");
                    li.setAttribute("id", path[y]);
                    li.innerHTML = innerHTML = "<a class=\"test\" tabindex=\"-1\" href=\"#\">" + path[y] + "<span class=\"caret\"></span></a>";
                    li.setAttribute("class", "dropdown-submenu");
                    ul.appendChild(li);
                    parentli.appendChild(ul);

                }
                else if (document.getElementById(path[y]) === null && y === path.length - 1) {
                    let parentli = document.getElementById(path[y - 1]);
                    let li = document.createElement("li");
                    li.setAttribute("id", path[y]);
                    li.innerHTML = "<a tabindex=\"-1\" href=\"#\">" + path[y] + "</a>";
                    parentli.appendChild(li);
                }
            }


        }

    });