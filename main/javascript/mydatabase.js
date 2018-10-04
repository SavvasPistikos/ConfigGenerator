function readJson(liService) {
    let jsontext = null;
    let url = host + basePath + "/swaggers/" + liService;
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
        'url': host + basePath + "/swaggers",
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
        let ulmenu = $('.dropdown-menu');
        let menu = $(ulmenu[0]);
        let services = getServices();

        services.forEach(function (value) {
                if (document.getElementById(value.service) === null && value.version === "") {
                    let simpleli = document.createElement("li");
                    let atag = document.createElement("a");
                    atag.innerHTML = "<input type = \"checkbox\" id =" + value.service + " onclick = \"importJson(this);\"" + "/>" + value.service;
                    simpleli.appendChild(atag);
                    menu.append(simpleli);
                    setJelem(value.service, value.id, value.service, "");
                } else if (document.getElementById(value.service) === null && value.version !== "") {
                    addSubmenu(value.service, value.version.replace(".","_"), menu, null, value.id);
                } else if (document.getElementById(value.service) != null) {
                    if (document.getElementById(value.service).tagName === "UL") {
                        value.version = (value.version === "") ? "default" : escape(value.version);
                        let ulmenu = $('#'+ value.service);
                        let lichild = $('<li>');
                        let atag = $('<a>');
                        atag.text(value.service + "/" + value.version)
                            .html("<input type = \"checkbox\" id =" + value.service + value.version.replace(".","_") + " onclick = \"importJson(this);\"" + "/>" + value.version);
                        lichild.append(atag);
                        ulmenu.append(lichild);
                        setJelem(value.service + value.version.replace(".","_"), value.id, value.service, value.version);
                    } else {
                        let previousitem = document.getElementById(value.service);
                        addSubmenu(value.service, value.version.replace(".","_"), menu, previousitem, value.id);
                    }
                }
            }
        );
    });

function addSubmenu(path, version, menu, previousitem, serviceId) {
    let lisubmenu = $('<li>');
    lisubmenu.attr("class", "dropdown-submenu")
        .html("<a class=\"test\" tabindex=\"-1\" href=\"#\">" + path + "<span class=\"caret\"></span></a>");

    let ulmenu = $('<ul>');
    ulmenu.attr("id", path).attr("class","dropdown-submenu");

    let lichild = $('<li>');
    let atag = $('<a>');
    atag.html("<input type = \"checkbox\" id =" + path + version + " onclick = \"importJson(this);\"" + "/>" + version);
    lichild.append(atag);

    ulmenu.append(lichild);
    if (previousitem != null) ulmenu.append(previousitem);
    lisubmenu.append(ulmenu);
    menu.append(lisubmenu);
    console.log(version);
    setJelem(path + version.replace(".","_"), serviceId, path, version);
}

function setJelem(compId, serviceId, path, version){
    let jelem = $('#' + compId);
    jelem.data("id",serviceId);
    jelem.data("service", path);
    if(version !== "") {
        jelem.data("version", "/" + version);
    }else{
        jelem.data("version", version);
    }
}