function readJson(liService) {
    var jsontext = null;
    let url = "http://localhost:8080/api/v1.0/swaggers/" + liService;

    /*    if (service === "internal") {
            url = "http://localhost:8080/api/v1.0/api-swagger/internal";
        }*/

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
        'url': "http://localhost:8080/api/v1.0/swaggers",
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
        //document.getElementById('upload').addEventListener('change', handleFileSelect, false);
        var ulmenu = document.getElementsByClassName("dropdown-menu");
        var menu = ulmenu[0];
        let services = getServices();

        let li = document.createElement("li");
        li.setAttribute("id", "internal");
        li.setAttribute("onclick", "importJson(this);");
        li.innerHTML = "<a role=\"menuitem\" tabindex=\"-1\" href=\"#\">" + "internal";
        menu.appendChild(li);

        for (let i = 0; i < services.length; i++) {
            let path = services[i].service;
            let version = services[i].version;

            if (document.getElementById(path) === null && version === "") {
                let simpleli = document.createElement("li");
                simpleli.setAttribute("id", path);
                simpleli.innerHTML = "<a tabindex=\"-1\" href=\"#\">" + path + "</a>";
                simpleli.setAttribute("onclick", "importJson(this);");
                $(simpleli).data("id", services[i].id);
                menu.appendChild(simpleli);
            }
            else if (document.getElementById(path) === null && version !== "") {
                addSubmenu(path, version, menu, null,services[i].id);
            } else if (document.getElementById(path) != null) {
                if (document.getElementById(path).tagName === "UL") {
                    version = (version === "") ? "default" : version;
                    let ulmenu = document.getElementById(path);
                    let lichild = document.createElement("li");
                    lichild.setAttribute("id", path + "_" + version);
                    lichild.innerHTML = "<a tabindex=\"-1\" href=\"#\">" + version + "</a>";
                    lichild.setAttribute("onclick", "importJson(this);");
                    $(lichild).data("id", services[i].id);
                    ulmenu.appendChild(lichild);
                } else {
                    let previousitem = document.getElementById(path);
                    addSubmenu(path, version, menu, previousitem,services[i].id);
                }
            }
        }
    });

function addSubmenu(path, version, menu, previousitem,serviceId) {

    let lisubmenu = document.createElement("li");
    lisubmenu.setAttribute("class", "dropdown-submenu");
    lisubmenu.innerHTML = "<a class=\"test\" tabindex=\"-1\" href=\"#\">" + path + "<span class=\"caret\"></span></a>";

    let ulmenu = document.createElement("ul");
    ulmenu.setAttribute("id", path);
    ulmenu.setAttribute("class", "dropdown-submenu");

    let lichild = document.createElement("li");
    lichild.setAttribute("id", path + "_" + version);
    lichild.innerHTML = "<a tabindex=\"-1\" href=\"#\">" + version + "</a>";
    lichild.setAttribute("onclick", "importJson(this);");
    $(lichild).data("id", serviceId);

    ulmenu.appendChild(lichild);
    if (previousitem != null) ulmenu.appendChild(previousitem);
    lisubmenu.appendChild(ulmenu);
    menu.appendChild(lisubmenu);
}