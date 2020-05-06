   // scroll to bottom of messages
   var messageBody = document.querySelector('#messageBody');
   messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;

   $(".chat_list").click(function () {  //use a class, since your ID gets mangled
       $('button.active_chat').removeClass('active_chat');
       $(this).addClass("active_chat");      //add the class to the clicked element
   });