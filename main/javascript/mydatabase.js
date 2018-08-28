function readJson(liService) {
    let jsontext = null;
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
    $('.dropdown-menu a.test').on("click", function (e) {
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
            version = version.replace(".","_");
            if (document.getElementById(path) === null && version === "") {
                let simpleli = document.createElement("li");
                let atag = document.createElement("a");
                atag.innerHTML = "<input type = \"checkbox\" id =" + path + " onclick = \"importJson(this);\"" + "/>" + path;
                simpleli.appendChild(atag);
                menu.appendChild(simpleli);
                $($('#' + path)).data("id", services[i].id);
            }
            else if (document.getElementById(path) === null && version !== "") {
                addSubmenu(path, version, menu, null, services[i].id);
            } else if (document.getElementById(path) != null) {
                if (document.getElementById(path).tagName === "UL") {
                    version = (version === "") ? "default" : version;
                    let ulmenu = document.getElementById(path);
                    let lichild = document.createElement("li");
                    let divvv = document.createElement("div");
                    let atag = document.createElement("a");
                    atag.appendChild(createCheckBox("","",""));
                    atag.innerText = path + "_" + version;
                    //atag.innerHTML = "<input type = \"checkbox\" id =" + path + "_" + version + " onclick = \"importJson(this);\"" + "/>" + version;
                    divvv.appendChild(atag);
                    lichild.appendChild(divvv);
                    ulmenu.appendChild(lichild);
                    $($('#' + path + "_" + version)).data("id", services[i].id);
                } else {
                    let previousitem = document.getElementById(path);
                    addSubmenu(path, version, menu, previousitem, services[i].id);
                }
            }
        }
    });

function addSubmenu(path, version, menu, previousitem, serviceId) {
    let lisubmenu = document.createElement("li");
    lisubmenu.setAttribute("class", "dropdown-submenu");
    lisubmenu.innerHTML = "<a class=\"test\" tabindex=\"-1\" href=\"#\">" + path + "<span class=\"caret\"></span></a>";

    let ulmenu = document.createElement("ul");
    ulmenu.setAttribute("id", path);
    ulmenu.setAttribute("class", "dropdown-submenu");

    let lichild = document.createElement("li");
    let atag = document.createElement("a");
    atag.innerHTML = "<input type = \"checkbox\" id =" + path + "_" + version + " onclick = \"importJson(this);\"" + "/>" + version;
    lichild.appendChild(atag);
    ulmenu.appendChild(lichild);
    if (previousitem != null) ulmenu.appendChild(previousitem);
    lisubmenu.appendChild(ulmenu);
    menu.appendChild(lisubmenu);
    console.log(version);
    $($('#' + path + "_" + version)).data("id", serviceId);
}