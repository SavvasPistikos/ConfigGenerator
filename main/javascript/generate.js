function generate() {
    for (let p in list) {
        if (list[p].length > 0) {
            let basePath;
            let apiName = p.replace(",", "/").split("/")[0];
            if (apiList.apis[apiName] == null) {
                if (document.getElementById("vers=" + p) !== null && document.getElementById("vers=" + p).value !== "") {
                    apiList.apis[apiName] = {url: "", version: "", paths: []};
                    apiList.apis[apiName].version = document.getElementById("vers=" + p).value;
                }
                else if (p.replace(",", "/").split("/").slice(1, 15).join("/").replace(",", "") === "") {
                    apiList.apis[apiName] = {url: "", paths: []};
                }

                if (document.getElementById("url=" + apiName) !== null) {
                    apiList.apis[apiName].url = document.getElementById("url=" + apiName).value;
                }
            }
            apiList.apis[apiName].paths = [];

            for (let i in list[p]) {
                let path = {
                    endpoint: "",
                    method: "",
                    authorize: false,
                    trnsTypeId: ""
                };

                basePath = (jsonList[apiName] !== undefined && jsonList[apiName].basePath !== "/" && jsonList[apiName].basePath != null)
                    ? jsonList[apiName].basePath
                    : "/api";

                if (list[p][i].path !== list[p][i].endpoint) {
                    path.path = (list[p][i].path.startsWith(basePath)) ? list[p][i].path : basePath + list[p][i].path;
                    path.endpoint = (list[p][i].endpoint === "") ? path.path :
                        (list[p][i].endpoint.startsWith(basePath)) ? list[p][i].endpoint : basePath + list[p][i].endpoint;
                } else {
                    path.endpoint = basePath + list[p][i].endpoint;
                }
                if (list[p][i].tags !== "" && list[p][i].tags.length > 0) {
                    path.tags = list[p][i].tags;
                }
                path.method = list[p][i].method;
                if (list[p][i].display === false) {
                    path.display = list[p][i].display;
                }
                path.authorize = list[p][i].authorize;
                path.trnsTypeId = list[p][i].trnstypeid;

                apiList.apis[apiName].paths.push(path);
            }
        }
    }

    let jsonOutput = document.getElementById("jsonOutput");
    var yaml = json2yaml(apiList);
    jsonOutput.innerHTML = yaml;
    console.log(JSON.stringify(apiList, null, 2));
    apiList = {apis: {}};
    $('#generate').click(function (e) {
        e.preventDefault();
        $('#outer a[href="#output"]').tab('show');
    });
}