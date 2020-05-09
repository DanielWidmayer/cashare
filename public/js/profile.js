// Upload File
document.querySelector('.custom-file-input').addEventListener('change', function (e) {
  var fileName = document.getElementById("inputGroupFile01").files[0].name;
  var nextSibling = e.target.nextElementSibling;
  nextSibling.innerText = fileName;
});

function changepic() {
  if ($('#inputGroupFile01').val() != "") $('#pic_form').submit();
  else {
    // error-popup
    $('#img_alert').toggle("slow");
  }
}

function changeData() {
  var flag = false;
  $('#data_form input[type=text]').each(function () {
    if (!validateName($(this).val())) {
      // error-popup for invalid firstname, lastname
      manualShowPopover('#' + this.id);
      flag = true;
    }
  });
  if (!validateEmail($('#mail').val())) {
    // mail (mail-form still needs to be checked)
    manualShowPopover('#mail');
    flag = true;
  }
  if (flag) return 0;
  if ($('#pw_new').val() == "" && $('#pw_conf').val() == "") {
    $('#pw_old').val("");
    $('#data_form').submit();
  }
  else {
    if ($('#pw_old').val() == "") {
      // error-popup for missing old password
      manualShowPopover('#pw_old');
      flag = true;
    }
    if (!checkpw_re('#pw_new')) {
      // error-popup for invalid new password
      manualShowPopover('#pw_new');
      flag = true;
    }
    if (!checkpw_conf()) {
      // error-popup for mismatched passwords
      manualShowPopover('#pw_conf');
      flag = true;
    }
    if (!flag) $('#data_form').submit();
  }
}
