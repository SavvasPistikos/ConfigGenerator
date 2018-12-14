$(document).ready(function () {
    createInternalApisTab();
    $('.dropdown-menu a.test').on("click", function (e) {
        $(this).next('ul').toggle();
        e.stopPropagation();
        e.preventDefault();
    });

    $("#databasemanager").tab('show');
    $('#manageswaggers').attr("class", "tab-pane fade in active");

    if ($('#manageswaggers').children().length === 0 || arg1 === true) {
        $('#manageswaggers').empty();
        getItemsFromDbAndDraw();
    }
});
