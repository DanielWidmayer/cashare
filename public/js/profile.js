document.querySelector('.custom-file-input').addEventListener('change', function (e) {
    var fileName = document.getElementById("inputGroupFile01").files[0].name;
    var nextSibling = e.target.nextElementSibling;
    nextSibling.innerText = fileName;
  });

  function changepic() {
    if($('#inputGroupFile01').val() != "") $('#pic_form').submit();
    else {
      // TODO error-popup
      alert("Please provide a valid picture!");
    }
  }

  function checkpw_re(el_id) {
    let regexp = /^([a-zA-Z0-9@*#_+]{8,15}$)/;
    return regexp.test($(el_id).val());
  }

  function checkpw_conf() {
    return ($('#pw_new').val() == $('#pw_conf').val()) ? true : false ;
  }

  function pw_mark(el_id, flag) {
    if(!flag) {
      $(el_id).css("border-color", "red");
      $(el_id).css("box-shadow", "0 0 0 1px rgba(255, 0, 0, 0.3)");
    } else {
      $(el_id).css("border-color", "green");
      $(el_id).css("box-shadow", "0 0 0 1px rgba(0, 100, 0, 0.3)");
    }
  }


  $('#pw_new').on('keyup', function() {
    pw_mark('#pw_conf', checkpw_conf());
    pw_mark('#pw_new', checkpw_re('#pw_new'));
  })

  $('#pw_conf').on('keyup', function() {
    pw_mark('#pw_conf', checkpw_conf());
  })


  function changeData() {
    var flag = false;
    $('#data_form input[type=text]').each(function() {
      if($(this).val() == "" && !flag) {
        // TODO error-popup for invalid firstname, lastname, mail (mail-form still needs to be checked)
        flag = true;
      }
    })
    if (flag) return 0;
    if($('#pw_old').val() == "" && $('#pw_new').val() == "" && $('#pw_conf').val() == "") $('#data_form').submit();
    else {
      if($('#pw_old').val() == "") {
        // TODO error-popup for missing old password
        flag = true;
      }
      else if(!checkpw_re('#pw_new')) {
        // TODO error-popup for invalid new password
        flag = true;
      }
      else if(!checkpw_conf()) {
        // TODO error-popup for mismatched passwords
        flag = true;
      }
      if(!flag) $('#data_form').submit();
    }
  }