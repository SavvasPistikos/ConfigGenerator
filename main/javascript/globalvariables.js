var host = "http://localhost:8080";
var path = "/api/v1.0";
var list = {};
var jsonList = {};
var tagList = {};
var apiList = {apis: {}};
var verbs = ["GET", "POST", "DELETE", "PUT"];
var js;
var importedJsonConfig;
var allGroupedByTags = {};
var checkboxesStatus = {};
var buttonIdWithout;
