function generate(generateButton) {
    for (let p in listt) {
        if (listt[p].length > 0) {
            let basePath;
            let apiName = p.replace(",", "/").split("/")[0];

            if (apiss.apis[apiName] == null) {
                if (document.getElementById("vers=" + p).value !== "") {
                    apiss.apis[apiName] = {url: "", version: "", paths: []};
                    apiss.apis[apiName].version = document.getElementById("vers=" + p).value;
                }
                else if (p.replace(",", "/").split("/").slice(1, 15).join("/").replace(",", "") === "") {
                    apiss.apis[apiName] = {url: "", paths: []};
                }

                apiss.apis[apiName].url = document.getElementById("url=" + apiName).value;
            }
            apiss.apis[apiName].paths = [];

            for (let i in listt[p]) {
                let path = {
                    path: "",
                    endpoint: "",
                    method: "",
                    tags: [],
                    display: true,
                    authorize: false
                };
                let res = listt[p][i].split(",");

                basePath = (jsonList[apiName].basePath !== "/" && jsonList[apiName].basePath != null)
                    ? jsonList[apiName].basePath
                    : "";

                path.display = document.getElementById("disp" + listt[p][i]).checked;
                path.authorize = document.getElementById("auth" + listt[p][i]).checked;
                path.path = basePath + res[0];
                if (document.getElementById("end" + listt[p][i]).checked === true) {
                    path.endpoint = document.getElementById("end=" + listt[p][i]).value;
                } else {
                    path.endpoint = path.path;
                }
                eval("tempPath" + " = " + "jsonList[\"" + apiName + "\"].paths[\"" + res[0] + "\"]."
                    + res[1].toLocaleLowerCase() + ";");

                if (document.getElementById("tag" + listt[p][i]).checked === true) {
                    path.tags.push(document.getElementById("tags=" + listt[p][i]).value);
                } else {
                    if (tempPath.tags != null) {
                        path.tags = tempPath.tags;
                    }
                }
                path.method = res[1];


                /*eval("path.tags" + " = " + "jsonList[\"" + apiName + "\"].paths[\"" + res[0] + "\"]."
                    + res[1].toLocaleLowerCase() + ".tags;");*/
                apiss.apis[apiName].paths.push(path);
            }

        }
    }

    let jsonOutput = document.getElementById("jsonOutput");
    var yaml = json2yaml(apiss);
    jsonOutput.innerHTML = yaml;
    console.log(JSON.stringify(apiss, null, 2));
    apiss = {apis: {}};
}