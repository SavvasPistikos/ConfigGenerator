function createInternalApisTab() {
    let servicesul = $("#services");
    let tabName = "internalApis";

    /*    let li = $('<li>');
        li.html("<a data-toggle=\"tab\" href=\"#divinternalApis" + "\">"
            + tabName + "</a>");
        servicesul.append(li);*/

    let internalApisTabContent = $("#swaggers");

    let tabpanediv = $('<div>');
    tabpanediv.attr("class", "tab-pane fade active in")
        .attr("id", "divinternalApis");
    tabpanediv.data("service", tabName);

    //let ul = $('<ul>');
    let ul = createTab("internalApis", "", "internal", true);
    ul.css("margin", "5px 0");

    let button = document.createElement("button");
    button.className = "btn btn-success pull-right";
    button.innerHTML = "<span class=\"glyphicon glyphicon-plus\"></span> Add";
    $(button).attr("data-toggle", "modal")
        .attr("data-target", "#addInternalPath")
        .attr("onclick", "generateInterApiPathModal();");

    let internalPathsList = $('<li>');
    internalPathsList.attr("id", "internalPathsList");
    internalPathsList.hide();

    ul.append($(button));
    //FAIL apending BR.. to incrase space....
    ul.append($('<br>').css('line-height', '38px'));
    ul.append(internalPathsList);
    tabpanediv.append(ul);
    internalApisTabContent.append(tabpanediv);
    $(servicesul.children().get(2)).tab('show');
}