// check first and last name
$('#firstname, #lastname').on('keyup', function () {
    if (validateName($("#firstname").val())) {
        pw_mark('#firstname', true);
    }
    else {
        pw_mark('#firstname', false);
    }

    if (validateName($("#lastname").val())) {
        pw_mark('#lastname', true);
    }
    else {
        pw_mark('#lastname', false);
    }
});


// check email    
$("#mail").on('keyup', function () {
    var email = $("#mail").val();
    if (validateEmail(email)) {
        pw_mark("#mail", true);
        // Todo: check if mail is available
    } else {
        pw_mark("#mail", false);
    }
});

//register account
$("#registerAccount").click(function () {
    var firstName = $("#firstname").val();
    var lastName = $("#lastname").val();
    var eMail = $("#mail").val();
    var password = $("#pw_new").val();
    var password_confirm = $("#pw_conf").val();

    console.log(firstName);
    console.log(lastName);
    console.log(eMail);
    console.log(password);

    if (!validateName(firstName)) {
        manualShowPopover('#firstname');
        return;
    }

    if (!validateName(lastName)) {
        manualShowPopover('#lastname');
        return;
    }

    if (!validateEmail(eMail)) {
        manualShowPopover('#mail');
        return;
    }

    if (!checkpw_re(password)) {
        manualShowPopover('#pw_new');
        return;
    }

    if (!checkpw_conf(password_confirm)) {
        manualShowPopover('#pw_conf');
        return;
    }

    var user = { 'firstName': firstName, 'lastName': lastName, 'eMail': eMail, 'password': password };

    $("#user_all").submit();
});
