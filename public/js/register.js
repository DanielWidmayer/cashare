// check first and last name
var checkFirstName = false;
var checkLastName = false;

$('#FirstName, #LastName').on('keyup', function () {
    var letters = /^[A-Za-z]+$/;
    console.log($("#FirstName").val());
    if (letters.test($("#FirstName").val())) {
        $("#FirstName").css("border-color", "green");
        $("#FirstName").css("box-shadow", "0 0 0 3px rgba(0, 100, 0, 0.5)");
        checkFirstName = true;
    }
    else {
        $("#FirstName").css("border-color", "red");
        $("#FirstName").css("box-shadow", "0 0 0 3px rgba(255, 0, 0, 0.5)");
        checkFirstName = false;
    }

    if (letters.test($("#LastName").val())) {
        $("#LastName").css("border-color", "green");
        $("#LastName").css("box-shadow", "0 0 0 3px rgba(0, 100, 0, 0.5)");
        checkLastName = true;
    }
    else {
        $("#LastName").css("border-color", "red");
        $("#LastName").css("box-shadow", "0 0 0 3px rgba(255, 0, 0, 0.5)");
        checkLastName = false;
    }
});


// check email    
var checkEmail = false;
var checkPassword = false;

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

$("#exampleInputEmail").on('keyup', function () {
    var email = $("#exampleInputEmail").val();
    if (validateEmail(email)) {
        $("#exampleInputEmail").css("border-color", "green");
        $("#exampleInputEmail").css("box-shadow", "0 0 0 3px rgba(0, 100, 0, 0.5)");
        checkEmail = true;
    } else {
        $("#exampleInputEmail").css("border-color", "red");
        $("#exampleInputEmail").css("box-shadow", "0 0 0 3px rgba(255, 0, 0, 0.5)");
        checkEmail = false;
    }
});

//check password
$('#password, #confirm_password').on('keyup', function () {
    if ($('#password').val() == $('#confirm_password').val() && $('#password').val() != 0 && $('#confirm_password').val() != null) {
        $("#password").css("box-shadow", "0 0 0 3px rgba(0, 100, 0, 0.5)");
        $("#confirm_password").css("box-shadow", "0 0 0 3px rgba(0, 100, 0, 0.5)");
        $('#password').css('border-color', 'green');
        $('#confirm_password').css('border-color', 'green');
        checkPassword = true;
    }
    else {
        $("#password").css("box-shadow", "0 0 0 3px rgba(255, 0, 0, 0.5)");
        $('#password').css('border-color', 'red');

        $("#confirm_password").css("box-shadow", "0 0 0 3px rgba(255, 0, 0, 0.5)");
        $('#confirm_password').css('border-color', 'red');
        checkPassword = false;
    }
});

//register account
$("#registerAccount").click(function () {
    if (!checkFirstName) {
        console.log("invalid First Name!");
        return;
    }

    if (!checkLastName) {
        console.log("invalid Last Name!");
        return;
    }

    if (!checkEmail) {
        console.log("invalid Email!");
        return;
    }

    if (!checkPassword) {
        console.log("invalid Passwords!");
        return;
    }
    var firstName = $("#FirstName").val();
    var lastName = $("#LastName").val();
    var eMail = $("#exampleInputEmail").val();
    var password = $("#password").val();

    console.log(firstName);
    console.log(lastName);
    console.log(eMail);
    console.log(password);

    var user = { 'firstName': firstName, 'lastName': lastName, 'eMail': eMail, 'password': password }

    $("#user_all").submit();
});