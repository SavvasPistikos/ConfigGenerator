function generateModal(infoButton) {
    let swaggerid = $(infoButton).data("id");
    let swaggerDTO = getSwagger(swaggerid);
    let modalDiv = document.createElement("div");
    modalDiv.setAttribute("class", "modal fade");
    modalDiv.id = "swaggerInfo";
    modalDiv.setAttribute("role", "dialog");

    let modalDialog = document.createElement("div");
    modalDialog.className = "modal-dialog";

    modalDiv.appendChild(modalDialog);


    let modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    modalDialog.appendChild(modalContent);

    let modalHeader = document.createElement("div");
    modalHeader.className = "modal-header";
    modalHeader.innerHTML = "<h4 class=\"modal-title\">" + swaggerDTO.service + "\t" + swaggerDTO.version + "</h4>";
    modalContent.appendChild(modalHeader);

    let modalBody = document.createElement("div");
    modalBody.className = "modal-body";
    modalBody.innerText = swaggerDTO.content;
    modalContent.appendChild(modalBody);

    let modalFooter = document.createElement("div");
    modalFooter.className = "modal-footer";
    let footerButton = document.createElement("button");
    footerButton.setAttribute("class", "btn btn-default");
    footerButton.setAttribute("data-dismiss", "modal");
    footerButton.innerText = "Close";
    $(footerButton).click(function () {
        $('#swaggerInfo').remove();
        $('.modal-backdrop').remove();
    });
    modalFooter.appendChild(footerButton);
    modalContent.appendChild(modalFooter);

    let modalContainer = document.getElementById("modals");
    modalContainer.appendChild(modalDiv);
}