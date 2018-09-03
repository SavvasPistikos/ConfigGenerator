var host = "http://localhost:8080";
var path = "/api/v1.0";
var list = {};
var jsonList = {};
var tagList = {};
var apiss = {apis: {}};
var verbs = ["GET", "POST", "DELETE", "PUT"];
var js;
var importedJsonConfig;
var allGroupedByTags = {};
var checkboxesStatus = {};
var buttonIdWithout;

$.fn.exists = function () {
    return this.length !== 0;
};

/*
$('.all').click(function () {

});*/
