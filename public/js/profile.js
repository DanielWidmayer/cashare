document.querySelector('.custom-file-input').addEventListener('change', function (e) {
    var fileName = document.getElementById("inputGroupFile01").files[0].name;
    var nextSibling = e.target.nextElementSibling;
    nextSibling.innerText = fileName;
});

function checkpw_re(el_id) {
    var regexp = /^([a-zA-Z0-9@*#_+]{8,15}$)/;
    return regexp.test($(el_id).val());
}

function checkpw_conf() {
    return ($('#pw_new').val() == $('#pw_conf').val()) ? true : false;
}

function changeData() {
    if ($('#firstname').val() != "" && $('#lastname').val() != "" && $('#mail').val() != "") {
        if (checkpw_conf()) {
            $('#data_form').submit();
        }
    }
}

$('#pw_new').on('keyup', function () {
    if (checkpw_re('#pw_new')) {
        $("#pw_new").css("border-color", "green");
        $("#pw_new").css("box-shadow", "0 0 0 1px rgba(0, 100, 0, 0.3)");
    } else {
        $("#pw_new").css("border-color", "red");
        $("#pw_new").css("box-shadow", "0 0 0 1px rgba(255, 0, 0, 0.3)");
    }
});

$('#pw_conf').on('keyup', function () {
    if (!checkpw_conf()) {
        $("#pw_conf").css("border-color", "red");
        $("#pw_conf").css("box-shadow", "0 0 0 1px rgba(255, 0, 0, 0.3)");
    } else {
        $("#pw_conf").css("border-color", "green");
        $("#pw_conf").css("box-shadow", "0 0 0 1px rgba(0, 100, 0, 0.3)");
    }
});