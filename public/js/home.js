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
}
pollData();

$(document).ready(function(){
    $.ajax({
        url: '/expenses/user_goals',
        type: 'GET',
        success: function (data) {
            paymentGoals = data;
            console.log(data);
            var sum = 0, counter = 0;;
            for (const key in data) {
                $('#payment_goal_overview').append('<h4 class="small font-weight-bold">' + data[key]['title'] + '<span id="paymentGoalSpan' + key + '" class="float-right">' + 100*data[key]['current']/data[key]['value'] + '% - ' + data[key]['current'] + '/' + data[key]['value'] + '$</span></h4><div class="progress mb-4"><div class="progress-bar bg-primary" role="progressbar" style="width: ' + 100*data[key]['current']/data[key]['value'] + '%"></div></div>');
                counter++;
                sum += 100*data[key]['current']/data[key]['value'];
            }
    
            $('#payment_tasks_average').text(sum/counter);
            $('#payment_tasks_average_width').css('width', sum/counter + '%');
    
        },
        error: function (request, error) {
            console.log(error + 'Request:' + JSON.stringify(request));
        }
    });
});




