function generate() {
    for (let p in list) {
        if (list[p].length > 0) {
            let basePath;
            let apiName = p.replace(",", "/").split("/")[0];
            if (apiList.apis[apiName] == null) {
                if (document.getElementById("vers=" + p).value !== "") {
                    apiList.apis[apiName] = {url: "", version: "", paths: []};
                    apiList.apis[apiName].version = document.getElementById("vers=" + p).value;
                }
                else if (p.replace(",", "/").split("/").slice(1, 15).join("/").replace(",", "") === "") {
                    apiList.apis[apiName] = {url: "", paths: []};
                }

                apiList.apis[apiName].url = document.getElementById("url=" + apiName).value;
            }
            apiList.apis[apiName].paths = [];

            for (let i in list[p]) {
                let path = {
                    path: "",
                    endpoint: "",
                    method: "",
                    tags: [],
                    display: true,
                    authorize: false,
                    transactionLog : false
                };
                let res = list[p][i].split(",");

                basePath = (jsonList[apiName].basePath !== "/" && jsonList[apiName].basePath != null)
                    ? jsonList[apiName].basePath
                    : "";

                path.display = document.getElementById("disp" + list[p][i]).checked;
                path.authorize = document.getElementById("auth" + list[p][i]).checked;
                path.transactionLog = document.getElementById("log" + list[p][i]).checked;
                path.path = basePath + res[0];
                if (document.getElementById("end" + list[p][i]).checked === true) {
                    path.endpoint = document.getElementById("end=" + list[p][i]).value;
                } else {
                    path.endpoint = path.path;
                }
                eval("tempPath" + " = " + "jsonList[\"" + apiName + "\"].paths[\"" + res[0] + "\"]."
                    + res[1].toLocaleLowerCase() + ";");

                if (document.getElementById("tag" + list[p][i]).checked === true) {
                    path.tags.push(document.getElementById("tags=" + list[p][i]).value);
                } else {
                    if (tempPath.tags != null) {
                        path.tags = tempPath.tags;
                    }
                }
                path.method = res[1];

                apiList.apis[apiName].paths.push(path);
            }

        }
    }

    let jsonOutput = document.getElementById("jsonOutput");
    var yaml = json2yaml(apiList);
    jsonOutput.innerHTML = yaml;
    console.log(JSON.stringify(apiList, null, 2));
    apiList = {apis: {}};
    $('#generate').click(function(e){
        e.preventDefault();
        $('#outer a[href="#output"]').tab('show');
    });
}