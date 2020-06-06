var thisMonth = new Date().getMonth()+1;
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "Dezember"];

function pollData() 
{
    $.ajax({
        url: '/jsondata/overview',
        dataType: 'json',
        type: 'get',
        success: function(data)
        {
            /*console.log(data); //tmp*/
            /*console.log("my_balance: " + data.balance.personal_balance); */ 
            if (data.balance.personal_balance == null){
                    $("#personalBalance").text("$0");
                } else {
                 $('#personalBalance').text("$" + data.balance.personal_balance);
            }
            
            ChartArea_home.data.labels = [];
            for(let index = 0; index < thisMonth; index++)
            {
                console.log("push");
                ChartArea_home.data.labels.push(months[index]);
                ChartArea_home.data.datasets[0].data.push((data.income.income_eachMonth[thisMonth-index-1]));
                ChartArea_home.options.scales.yAxes[0].ticks.maxTicksLimit = checkMaxValueExceeded(data.income.income_eachMonth[thisMonth-index-1], ChartArea_home.options.scales.yAxes[0].ticks.maxTicksLimit);
                
                ChartArea_home.data.datasets[1].data.push(Math.abs(data.expense.expenses_eachMonth[thisMonth-index-1]));
                ChartArea_home.options.scales.yAxes[0].ticks.maxTicksLimit = checkMaxValueExceeded(Math.abs(data.expense.expenses_eachMonth[thisMonth-index-1]), ChartArea_home.options.scales.yAxes[0].ticks.maxTicksLimit);
            }

            ChartArea_home.update();

        },
        error: function(){
            alert(data.toString);
        }
    });
    // setInterval(function(){
    //     poll();
    // }, 1000);
}

pollData();



