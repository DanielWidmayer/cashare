function checkpw_re(el_id) {
    let regexp = /^([a-zA-Z0-9@*#_+]{8,15}$)/;
    return regexp.test($(el_id).val());
}

function checkpw_conf() {
    return ($('#pw_new').val() == $('#pw_conf').val()) ? true : false;
}

function pw_mark(el_id, flag) {
    if (!flag) {
        $(el_id).css("border-color", "red");
        $(el_id).css("box-shadow", "0 0 0 1px rgba(255, 0, 0, 0.3)");
    } else {
        $(el_id).css("border-color", "green");
        $(el_id).css("box-shadow", "0 0 0 1px rgba(0, 100, 0, 0.3)");
    }
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function validateName(name) {
    var re = /^([^\$%\^*£#+<>|?§=~@\d]+){2,30}( ([^\$%\^\.*£#+<>|?§=~@\d]+){2,30})*$/;
    return re.test(name);
}

function manualShowPopover(el_id) {
    $(el_id).popover('show');
    $(el_id).on('keyup', function () {
        $(el_id).popover('hide');
    });
}

$('#pw_new').on('keyup', function () {
    pw_mark('#pw_conf', checkpw_conf() && checkpw_re('#pw_conf'));
    pw_mark('#pw_new', checkpw_re('#pw_new'));
});

$('#pw_conf').on('keyup', function () {
    pw_mark('#pw_conf', checkpw_conf() && checkpw_re('#pw_conf'));
});

$(document).ready(function () {
    $(function () {
        // create popovers
        $('#pw_new').popover({ trigger: 'focus', placement: 'bottom', title: 'Enter a new Password', content: "Enter a Password with a lenght of 8-15 letters and or numbers." });
        $('#pw_old').popover({ trigger: 'manual', placement: 'bottom', title: 'Enter your Password', content: "If you want to change your password you need to provide your old password.." });
        $('#pw_conf').popover({ trigger: 'manual', placement: 'bottom', title: 'Confirm the new Password', content: "Passwords do not match. Please try again." });
        $('#firstname').popover({ trigger: 'manual', placement: 'bottom', title: 'Enter your Firstname', content: "Firstname is invalid. Please make sure to enter your Firstname without special Characters." });
        $('#lastname').popover({ trigger: 'manual', placement: 'bottom', title: 'Enter your Lastname', content: "Lastname is invalid. Please make sure to enter your Lastname without special Characters." });
        $('#mail').popover({ trigger: 'manual', placement: 'bottom', title: 'Enter the new Mail-Adress', content: "This Mail Adress is invalid. Please try again." });
    });
});