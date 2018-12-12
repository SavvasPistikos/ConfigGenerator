$(document).ready(function () {
    $("#myInput").on("keyup", function (event) {
        let value = $(this).val().trim();
        let swaggersEl = $("#swaggers");
        if (value === "") {
            let tagli = swaggersEl.children().children('ul').children('li');
            for (li of tagli) {
                resetTagLi(li);
            }
            return;
        }
        swaggersEl.filter(function () {
            let ul = $($(this).children()).children('ul');
            let innerUl = ul.children('li').children('ul');
            let buttons = innerUl.children('li').children(':button');

            buttons.each(function () {
                if ($(this).text().trim().includes(value)) {
                    $(this).parent().fadeIn(150);
                    let tagUl = $(this).parent().parent();
                    if (tagUl.is(':hidden')) {
                        tagUl.siblings(':button').trigger('click');
                    }
                } else {
                    $(this).parent().fadeOut(150);
                }
            });
        });
    });
});

function resetTagLi(tagliElement) {
    if ($(tagliElement).children('ul').is('.collapse:not(.show)')) {
        $(tagliElement).children('ul').collapse("hide");
    } else {
        $(tagliElement).children('ul').collapse("show");
    }
    let pathli = $(tagliElement).children('ul').children('li');
    pathli.each(function () {
        $(this).fadeIn(150);
    });

}