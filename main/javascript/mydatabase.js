function readJson(liService) {
    let jsontext = null;
    let url = host + path + "/swaggers/" + liService;
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
        'url': host + path + "/swaggers",
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
        let ulmenu = document.getElementsByClassName("dropdown-menu");
        let menu = ulmenu[0];
        let services = getServices();

        let li = document.createElement("li");
        li.setAttribute("id", "internal");
        li.setAttribute("onclick", "importJson(this);");
        li.innerHTML = "<a role=\"menuitem\" tabindex=\"-1\" href=\"#\">" + "internal";
        menu.appendChild(li);

        services.forEach(function (value) {
                if (document.getElementById(value.service) === null && value.version === "") {
                    let simpleli = document.createElement("li");
                    let atag = document.createElement("a");
                    atag.innerHTML = "<input type = \"checkbox\" id =" + value.service + " onclick = \"importJson(this);\"" + "/>" + value.service;
                    simpleli.appendChild(atag);
                    menu.appendChild(simpleli);
                    let jelem = $("#" + value.service);
                    jelem.data("id", value.id);
                    jelem.data("service", value.service);
                    jelem.data("version","");
                } else if (document.getElementById(value.service) === null && value.version !== "") {
                    addSubmenu(value.service, value.version.replace(".","_"), menu, null, value.id);
                } else if (document.getElementById(value.service) != null) {
                    if (document.getElementById(value.service).tagName === "UL") {
                        value.version = (value.version === "") ? "default" : escape(value.version);
                        let ulmenu = document.getElementById(value.service);
                        let lichild = document.createElement("li");
                        let atag = document.createElement("a");
                        atag.innerText = value.service + "/" + value.version;
                        atag.innerHTML = "<input type = \"checkbox\" id =" + value.service + value.version.replace(".","_") + " onclick = \"importJson(this);\"" + "/>" + value.version;
                        lichild.appendChild(atag);
                        ulmenu.appendChild(lichild);
                        let jelem = $("#" + value.service + value.version.replace(".","_"));
                        jelem.data("id", value.id);
                        jelem.data("service", value.service);
                        jelem.data("version", "/" + value.version);
                    } else {
                        let previousitem = document.getElementById(value.service);
                        addSubmenu(value.service, value.version.replace(".","_"), menu, previousitem, value.id);
                    }
                }
            }
        );
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
    atag.innerHTML = "<input type = \"checkbox\" id =" + path + version + " onclick = \"importJson(this);\"" + "/>" + version;
    lichild.appendChild(atag);
    ulmenu.appendChild(lichild);
    if (previousitem != null) ulmenu.appendChild(previousitem);
    lisubmenu.appendChild(ulmenu);
    menu.appendChild(lisubmenu);
    console.log(version);
    let jelem =  $("#" + path + version.replace(".","_"));
    jelem.data("id", serviceId);
    jelem.data("service", path);
    jelem.data("version", "/" + version);
}