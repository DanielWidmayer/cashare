 /*$.getScript("chart-bar.js", function() {
     $(document).ready(function(){
         let sum = 0;
         let div_val = 0;

         // iterate through each expense entry in database and calculate the avg, annual and last_month expense
         for (let i = 1; i <= 12; i++)
         {
             if (getValue(i) != 0){
                 sum = sum + getValue(i);
                 div_val++;
             }
         }
         if (div_val == 0)
         {
             $("#average_expenses").text("no expenses");
         }
         else {
             $("#average_expenses").text('$' + Math.round(((sum / div_val) + Number.EPSILON) * 100) / 100);
         }
         // in the financial world, the numbers have to be right, hence they are rounded exactly
         $("#annual_expenses").text('$'+Math.round(((sum) + Number.EPSILON) * 100) / 100);
         $("#last_month_expenses").text('$'+Math.round(((getValue(new Date().getMonth()) + Number.EPSILON) * 100) / 100).toString());
     });
  });*/

  var thisMonth = new Date().getMonth()+1;
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "Dezember"];
  

function pollDataExpenses() 
{
    $.ajax({
        url: '/jsondata/expenses',
        dataType: 'json',
        type: 'get',
        success: function(data)
        {
            
            BarChart_Expenses.data.datasets[0].data = [];
            BarChart_Expenses.data.labels = [];
            for (let index = 0; index < thisMonth; index++)
            {
              BarChart_Expenses.data.labels.push(months[index]);  
              BarChart_Expenses.data.datasets[0].data.push(Math.abs(data.expenses_eachMonth[thisMonth-index-1]));
              BarChart_Expenses.options.scales.yAxes[0].ticks.max = checkMaxValueExceeded(Math.abs(data.expenses_eachMonth[thisMonth-index-1]), BarChart_Expenses.options.scales.yAxes[0].ticks.max);
            }
            BarChart_Expenses.update();

            if (data.average_expenses == null){
                $("#average_expenses").text("$0");
            } else {
                $('#average_expenses').text("$" + Math.abs(data.average_expenses));
            }
            if(data.annual_expenses == null){
                $('#annual_expenses').text("$0");
            } else {
                $('#annual_expenses').text("$" + Math.abs(data.annual_expenses));
            }
            if (data.lastMonth_expenses == null){
                $('#last_month_expenses').text("$0");
            } else {
                $('#last_month_expenses').text("$" + Math.abs(data.lastMonth_expenses));
            }
        },
        error: function(){
            //
        }
    });
}
  
pollDataExpenses();
  
function pollPieChartData()
{
    $.ajax({
        url: '/jsondata/piechart-expenses',
        dataType: 'json',
        type: 'get',
        success: function(data)
            {
                console.log(data);
                PieChart_Expenses.data.datasets[0].data = [];
                PieChart_Expenses.data.labels = [];
                for (let index = 0; index < data.categories.length; index++)
                {
                    PieChart_Expenses.data.labels.push(data.categories[index]);  
                    PieChart_Expenses.data.datasets[0].data.push(data.totalexpenses[index]);  
                }
                PieChart_Expenses.update();   
            },
        error: function(){
            //
        }
    });
};
/*setInterval(function(){
    poll();
}, 1000);*/

pollPieChartData();

$("#transactionValue").on("keypress keyup blur", function (event) {
    $(this).val($(this).val().replace(/[^0-9\.|\,]/g,''));
    if(event.which == 44)
    {
    return true;
    }
    if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57  )) {
    
      event.preventDefault();
    }
});

$("#transactionValueModal").on("keypress keyup blur", function (event) {
    $(this).val($(this).val().replace(/[^0-9\.|\,]/g,''));
    if(event.which == 44)
    {
    return true;
    }
    if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57  )) {
    
      event.preventDefault();
    }
});


$('#destination_account').change(function() {
    $('#destination_id').prop('disabled', false);

    $('#chooseCategory').prop('disabled', true);
    $('#new_category_button').prop('disabled', true);
    if ($(this).val() == "0" || $(this).val() == "1") {
      $('#destination_id').prop('disabled', true);

      $('#chooseCategory').prop('disabled', false);
      $('#new_category_button').prop('disabled', false);
    }
});

$('#destination_account_modal').change(function() {
    $('#destination_id_modal').prop('disabled', false);

    $('#chooseCategory_modal').prop('disabled', true);
    $('#new_category_button_modal').prop('disabled', true);
    if ($(this).val() == "0" || $(this).val() == "1") {
      $('#destination_id_modal').prop('disabled', true);

      $('#chooseCategory_modal').prop('disabled', false);
      $('#new_category_button_modal').prop('disabled', false);
    }
});



$("#filterByCategoryExpensesButton").click(function(){
    var categoryToFilter = $("#categoryToFilter").val();
    if (categoryToFilter == "Choose Category") {
        $("#categoryToFilter").css("box-shadow", "0 0 0 3px rgba(255, 0, 0, 0.5)");
        $('#categoryToFilter').css('border-color', 'red');
        $("#filterByCategoryExpensesButton").disabled = true;
    } else {
        $("#filterByCategoryExpensesButton").disabled = false;
        var categoryToFilterJSON = {'categoryToFilter':categoryToFilter};

        $.post( "/jsondata/filterByCategoryExpenses", categoryToFilterJSON).done(function(data) {
            BarChart_Expenses.data.datasets[0].data = [];
            BarChart_Expenses.data.labels = [];
            for (let index = 0; index < thisMonth; index++)
            {
                BarChart_Expenses.data.labels.push(months[index]);
                BarChart_Expenses.data.datasets[0].data.push(data.filtered_income_eachMonth[thisMonth-index-1]);
                BarChart_Expenses.options.scales.yAxes[0].ticks.max = checkMaxValueExceeded(data.filtered_income_eachMonth[thisMonth-index-1], BarChart_Expenses.options.scales.yAxes[0].ticks.max);
            }
            BarChart_Expenses.update();
            $("#filter_data").modal('hide');
        });
    }
});


$("#addExpense").click(function(){
    var transactionValue = ($("#transactionValue").val()).replace(',', '.');
    var timePeriod = $("#timePeriod").val();
    var chooseCategory = $("#chooseCategory").val();
    

    var repetitionValue = $("#repetition_value").val();
    var timeUnit = $("#timeUnit").val();
    var dateTimeID = $("#dateTimeID").val();

    var destinationAccount = $("#destination_account").val();
    var destinationID = $("#destination_id").val();



    // Fehlermanagment
    if(chooseCategory == "Choose Category" || timePeriod == "Choose Expense Type" 
    || (timePeriod == "2" && (timeUnit == "Choose Time unit" || repetitionValue == "")) 
    || transactionValue.charAt(0) == '.' || transactionValue == "" || destinationAccount =="Choose destination account")
    {
        if(transactionValue.charAt(0) == '.' || transactionValue == "")
        {
            $("#transactionValue").css("box-shadow", "0 0 0 3px rgba(255, 0, 0, 0.5)");
            $('#transactionValue').css('border-color', 'red');
        }
        if(chooseCategory == "Choose Category")
        {
            $("#chooseCategory").css("box-shadow", "0 0 0 3px rgba(255, 0, 0, 0.5)");
            $('#chooseCategory').css('border-color', 'red');
        }
        if(timePeriod == "Choose Expense Type")
        {
            $("#timePeriod").css("box-shadow", "0 0 0 3px rgba(255, 0, 0, 0.5)");
            $('#timePeriod').css('border-color', 'red');
        }
        if (timePeriod == "2" && timeUnit == "Choose Time unit")
        {
            $("#timeUnit").css("box-shadow", "0 0 0 3px rgba(255, 0, 0, 0.5)");
            $('#timeUnit').css('border-color', 'red');
        }
        if (timePeriod == "2" && repetitionValue == "")
        {
            $("#repetition_value").css("box-shadow", "0 0 0 3px rgba(255, 0, 0, 0.5)");
            $('#repetition_value').css('border-color', 'red');
        }
        return false;
    }
    

    var transaction = {'transactionValue':transactionValue, 'timePeriod':timePeriod,'chooseCategory':chooseCategory, 
        'repetitionValue':repetitionValue, 'timeUnit':timeUnit, 'dateTimeID':dateTimeID, 'destinationID':destinationID,
        'destinationAccount':destinationAccount};
    $.post( "/expenses", transaction ) 
    .done(function( data ) {

        if (data == "past_error") {
            $("#past_time_alert").modal('show');
        } else {
            if (data == "debts_alert") 
            {
                $("#expense_alert").modal('show');
            } 
            else
            {
                if (destinationAccount > 1) 
                {
                    if (data=="transaction_wrong_username") {
                        $("#transaction_wrong_user").modal('show');
                    } else {
                        $("#user_transaction_alert").modal('show');
                    }
                } else
                {
                    location.reload();
                }
            }
        }
    });
});


$("#transaction_expenses_successful").click(function(){
    location.reload();
});

$("#addExpenseModal").click(function(){
    var transactionValue = ($("#transactionValueModal").val()).replace(',', '.');
    var timePeriod = $("#timePeriodModal").val();
    var chooseCategory = $("#chooseCategoryModal").val();

    var repetitionValue = $("#repetition_valueModal").val();
    var timeUnit = $("#timeUnitModal").val();
    var dateTimeID = $("#dateTimeIDModal").val();

    var destinationAccount = $("#destination_account_modal").val();
    var destinationID = $("#destination_id_modal").val();


    //Fehlermanagment
    if(chooseCategory == "Choose Category" || timePeriod == "Choose Expense Type" || (timePeriod == "2" && (timeUnit == "Choose Time unit" || repetitionValue == "")) || transactionValue.charAt(0) == '.' || transactionValue == "")
    {
        if(transactionValue.charAt(0) == '.' || transactionValue == "")
        {
            $("#transactionValueModal").css("box-shadow", "0 0 0 3px rgba(255, 0, 0, 0.5)");
            $('#transactionValueModal').css('border-color', 'red');
        }
        if(chooseCategory == "Choose Category")
        {
            $("#chooseCategoryModal").css("box-shadow", "0 0 0 3px rgba(255, 0, 0, 0.5)");
            $('#chooseCategoryModal').css('border-color', 'red');
        }
        if(timePeriod == "Choose Expense Type")
        {
            $("#timePeriodModal").css("box-shadow", "0 0 0 3px rgba(255, 0, 0, 0.5)");
            $('#timePeriodModal').css('border-color', 'red');
        }
        if (timePeriod == "2" && timeUnit == "Choose Time unit")
        {
            $("#timeUnitModal").css("box-shadow", "0 0 0 3px rgba(255, 0, 0, 0.5)");
            $('#timeUnitModal').css('border-color', 'red');
        }
        if (timePeriod == "2" && repetitionValue == "")
        {
            $("#repetition_valueModal").css("box-shadow", "0 0 0 3px rgba(255, 0, 0, 0.5)");
            $('#repetition_valueModal').css('border-color', 'red');
        }
        return false;
    }
    

    var transaction = {'transactionValue':transactionValue, 'timePeriod':timePeriod,'chooseCategory':chooseCategory, 
        'repetitionValue':repetitionValue, 'timeUnit':timeUnit, 'dateTimeID':dateTimeID, 'destinationID':destinationID,
        'destinationAccount':destinationAccount};


    $.post( "/expenses", transaction ) 
    .done(function( data ) {
        if (data == "past_error") {
            $("#past_time_alert").modal('show');
        } else {
            if (data == "debts_alert") 
            {
                $("#expense_alert").modal('show');
            } 
            else
            {
                if (destinationAccount > 1) 
                {
                    if (data=="transaction_wrong_username") {
                        $("#transaction_wrong_user").modal('show');
                    } else {
                        $("#user_transaction_alert").modal('show');
                    }
                } else
                {
                    $('#ExpenseModal').modal('hide');
                    location.reload();
                }
            }
        }
    });
});

$("#addNewCategory").click(function(){
    var newCategory = $("#newCategory").val();
    var description = $("#CategoryDescription").val();
    var category_isExpense = 1; // true

    var category = {'newCategory': newCategory, 'description': description, 'category_isExpense':category_isExpense};
    $.post( "/category/add", category ) 
    .done(function( data ) {
        console.log( "Data Loaded: " + data );
        
        $('#Category').modal('hide');
        $( ' <option value="' + data[0].category_id + '">' + data[0].category_name + '</option>' ).appendTo( "#chooseCategoryModal" );
        $( ' <option value="' + data[0].category_id + '">' + data[0].category_name + '</option>' ).appendTo( "#chooseCategory" );
    });
});

$("#addNewCategoryModal").click(function(){
    var newCategory = $("#newCategoryModal").val();
    var description = $("#CategoryDescriptionModal").val();
    var category_isExpense = 1; // true

    var category = {'newCategory': newCategory, 'description': description, 'category_isExpense':category_isExpense};
    $.post( "/category/add", category ) 
    .done(function( data ) {
        /*console.log( "Data Loaded: " + data );*/
        $('#CategoryModal').modal('hide');
        $( ' <option value="' + data[0].category_id + '">' + data[0].category_name + '</option>' ).appendTo( "#chooseCategoryModal" );
        $( ' <option value="' + data[0].category_id + '">' + data[0].category_name + '</option>' ).appendTo( "#chooseCategory" );

        
    });
});

$("#filterByCategoryExpensesButton").click(function(){
    var categoryToFilter = $("#categoryToFilter").val();
    var category_isExpense = 1; // true

    //var category = {'newCategory': newCategory, 'description': description, 'category_isExpense':category_isExpense};
    //$.post( "/category/add", category ) 
    //.done(function( data ) {
    //    console.log( "Data Loaded: " + data );
    //});
});

$("button[data-dismiss-modal=modal2]").click(function(){
    $('#CategoryModal').modal('hide');
});


var categorysById = {};
var paymentGoals;
$(document).ready(function(){
    $.ajax({
        url: '/expenses/user_categories',
        type: 'GET',
        success: function (data) {
            console.log(data);
            for (const key in data) {
                categorysById[data[key]['category_id']] = data[key]['category_name'];
            }
        },error: function (request, error) {
            console.log(error + 'Request:' + JSON.stringify(request));
        },
    });

    $.ajax({
        url: '/income/regular_income_overview',
        type: 'GET',
        success: function (data) {
            var tableRef = document.getElementById('regular_expense_overview').getElementsByTagName('tbody')[0];
            for (const key in data) {
                if(parseInt(data[key]['TRANSACTION_VALUE']) < 0){
                    // Insert a row in the table at the last row
                    var newRow = tableRef.insertRow();
                    newRow.id = 'regularExpenseRow' + key;
                    for (let index = 0; index < 5; index++) {
                        if(index != 4){
                            var newCell  = newRow.insertCell(index); // Insert the cells in the row
                        }
                        // Append a text node to each cell
                        var newText;
                    switch (index) {
                        case 0: 
                                newText = document.createTextNode(data[key]['TRANSACTION_VALUE'] + '$');
                                newCell.appendChild(newText);
                                break;
                            case 1:
                                newText = document.createTextNode(data[key]['INTERVAL_VALUE'] + ' ' + data[key]['INTERVAL_FIELD']);
                                newCell.appendChild(newText);
                                break;
                            case 2:
                                newText = document.createTextNode(data[key]['LAST_ALTERED']);
                                newCell.appendChild(newText);
                                break;
                            case 3: 
                                newText = document.createTextNode(categorysById[parseInt(data[key]['EVENT_DEFINITION'])]);
                                newCell.appendChild(newText);
                                break;
                            case 4: 
                                newText = '<td><button id="deleteRegularExpense' + key + '" class="btn btn-circle btn-primary bg-gradient-primary"><i class="fas fa-trash text-white"></i></button></td>';
                                $('#regularExpenseRow' + key).append(newText);
                                break;
                        default: console.log('error');
                            break;
                    }
                    
                    }

                    $('#deleteRegularExpense' + key).click(function(){
                        $.ajax({
                            url: '/income/delete_regular_income',
                            type: 'POST',
                            data: {event_name: data[key]['EVENT_NAME']},
                            success: function (data) {
                                console.log(typeof data);
                                if(data == 'OK'){
                                    $('#regularExpenseRow' + key).remove();
                                }
                            },
                                error: function (request, error) {
                                console.log(error + 'Request:' + JSON.stringify(request));
                            }

                        });
                    });
                }
            }      
        },
        error: function (request, error) {
            console.log(error + 'Request:' + JSON.stringify(request));
        },
    });

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

            $('#payment_tasks_average').text(sum/counter + '%');
            $('#payment_tasks_average_width').css('width', sum/counter + '%');

        },
        error: function (request, error) {
            console.log(error + 'Request:' + JSON.stringify(request));
        }
    });

});



$('#addPaymentGoal').click(() => {
    var payment_goal_title = $('#paymentGoalTitle').val();
    var payment_goal_value = $('#paymentGoalValue').val();
    var payment_goal_category = $('#choosePaymentGoalCategory').val();
    if(payment_goal_title != ''){
        if(payment_goal_value != '' && parseInt(payment_goal_value) != 0){
            $.ajax({
                url: '/expenses/insert_payment_goal',
                type: 'POST',
                data: {title: payment_goal_title, value: payment_goal_value, category: payment_goal_category},
                success: function (data) {
                    console.log(data);
                    $('#payment_goal_overview').append('<h4 class="small font-weight-bold">' + payment_goal_title + '<span class="float-right">0% - 0/ ' + payment_goal_value + '$</span></h4><div class="progress mb-4"><div class="progress-bar bg-primary" role="progressbar" style="width: 0%"></div></div>');
                },
                error: function (request, error) {
                    console.log(error + 'Request:' + JSON.stringify(request));
                },
            });
        }else{
            $("#paymentGoalValue").css("box-shadow", "0 0 0 3px rgba(255, 0, 0, 0.5)");
            $('#paymentGoalValue').css('border-color', 'red');
        }
    }else{
        $("#paymentGoalTitle").css("box-shadow", "0 0 0 3px rgba(255, 0, 0, 0.5)");
        $('#paymentGoalTitle').css('border-color', 'red');
    }

    
});

$('#addPaymentGoalValue').click(() => {
    var payment_goal_id = $('#choosePaymentGoal').val();
    var payment_goal_title;
    var payment_goal_value = $('#paymentGoalAddValue').val();
    console.log(payment_goal_id);
    if(payment_goal_id != 'Choose Payment Goal'){
        if(payment_goal_value != '' && parseInt(payment_goal_value) != 0){
            for (const key in paymentGoals) {
                if(paymentGoals[key]['goal_id'] == payment_goal_id){
                    payment_goal_title = paymentGoals[key]['title'];
                }
            }
            
            $.ajax({
                url: '/expenses/goal_add_value',
                type: 'POST',
                data: {value: payment_goal_value, goal_id: payment_goal_id},
                success: function (data) {
                    location.reload();
                },
                error: function (request, error) {
                    console.log(error + 'Request:' + JSON.stringify(request));
                },
            });
        }else{
            $("#paymentGoalAddValue").css("box-shadow", "0 0 0 3px rgba(255, 0, 0, 0.5)");
            $('#paymentGoalAddValue').css('border-color', 'red');
        }
    }else{
        $("#choosePaymentGoal").css("box-shadow", "0 0 0 3px rgba(255, 0, 0, 0.5)");
        $('#choosePaymentGoal').css('border-color', 'red');
    }

    
});