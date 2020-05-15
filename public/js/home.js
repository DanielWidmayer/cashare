function pollData() 
{
    var poll = function()
    {
      console.log("Hello");  
      $.ajax({
            url: '/jsondata-overview',
            dataType: 'json',
            type: 'get',
            success: function(data)
            {
              console.log("my_balance: " + data.personal_balance);  
              if (data.personal_balance == null){
                    $("#personalBalance").text("$0");
                } else {
                    $('#personalBalance').text("$" + data.personal_balance);
                }
            },
            error: function(){
                alert(data.toString);
            }
        })
    };
    poll();
    setInterval(function(){
        poll();
    }, 1000);
}

pollData();
