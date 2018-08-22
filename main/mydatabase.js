function readJson(liService) {
    let service = liService.split("/")[0];
    let version = (liService.split("/")[1] != null) ? liService.split("/")[1] : "";
    var jsontext = null;

    if (service === "internal") {
        service = "http://localhost:8080/api/v1.0/api-swagger/internal";
    }
    let url = (version === "") ? "http://localhost:8080/api/v1.0/swagger/" + service
        : "http://localhost:8080/api/v1.0/swagger/" + service + "/" + version;
    $.ajax({
        'async': false,
        'global': false,
        'url': url,
        'dataType': "json",
        'success': function (data) {
            jsontext = data;
        }
    });
    return jsontext;
}

function getServices() {
    var services = null;

    $.ajax({
        'async': false,
        'global': false,
        'url': "http://localhost:8080/api/v1.0/swagger/services",
        'dataType': "json",
        'success': function (data) {
            services = data;
        }
    });
    return services;
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
        document.getElementById('upload').addEventListener('change', handleFileSelect, false);
        var ulmenu = document.getElementsByClassName("dropdown-menu");
        var menu = ulmenu[0];
        let services = getServices();

        let li = document.createElement("li");
        li.setAttribute("id", "internal");
        li.setAttribute("role", "presentation");
        li.setAttribute("onclick", "importJson(this);");
        li.innerHTML = "<a role=\"menuitem\" tabindex=\"-1\" href=\"#\">" + "internal";
        menu.appendChild(li);

        for (let i = 0; i < services.length; i++) {
            let path = services[i].service;
            let version = services[i].version;

            if (document.getElementById(path) === null && version === "") {
                let li = document.createElement("li");
                li.setAttribute("id", path);
                li.setAttribute("role", "presentation");
                li.setAttribute("onclick", "importJson(this);");
                li.innerHTML = "<a role=\"menuitem\" tabindex=\"-1\" href=\"#\">" + path;
                menu.appendChild(li);
            }
            else if (document.getElementById(path) === null && version !== "") {
                let parentli = document.createElement("li");
                parentli.setAttribute("class", "dropdown-submenu");
                parentli.innerHTML = "<a class=\"test\" tabindex=\"-1\" href=\"#\">" + path + " <span class=\"caret\"></span></a>";

                let parentul = document.createElement("ul");
                parentul.setAttribute("id", path);
                parentul.setAttribute("class", "dropdown-submenu");

                let childli = document.createElement("li");
                childli.setAttribute("id", path + "/" + version);
                childli.setAttribute("onclick", "importJson(this);");
                childli.innerHTML = "<a tabindex=\"-1\" href=\"#\">" + version + "</a>";

                parentli.appendChild(parentul);
                parentul.appendChild(childli);
                menu.appendChild(parentli);
            } else if (document.getElementById(path) != null && version !== "") {
                let parentli = document.getElementById(path);

                let parentul = document.createElement("ul");
                parentul.setAttribute("class", "dropdown-submenu");


                let childli = document.createElement("li");
                childli.setAttribute("id", path + "/" + version);
                childli.setAttribute("onclick", "importJson(this);");
                childli.innerHTML = "<a tabindex=\"-1\" href=\"#\">" + version + "</a>";

                parentul.appendChild(childli);
                parentli.appendChild(parentul);
                menu.appendChild(parentli);
            }
        }
    });