// $.getScript("chart-bar.js", function() {
//     $(document).ready(function(){
//         let sum = 0;
//         let div_val = 0;

//         // iterate through each income entry in database and calculate the avg, annual and last_month income
//         for (let i = 1; i <= 12; i++)
//         {
//             if (getValue(i) != 0){
//                 sum = sum + getValue(i);
//                 div_val++;
//             }
//         }
//         if (div_val == 0)
//         {
//             //$("#average_income").text("no income");
//         }
//         else {
//             //$("#average_income").text('$' + Math.round(((sum / div_val) + Number.EPSILON) * 100) / 100);
//         }
//         // in the financial world, the numbers have to be right, hence they are rounded exactly
//         $("#annual_income").text('$'+Math.round(((sum) + Number.EPSILON) * 100) / 100);
//         $("#last_month_income").text('$'+Math.round(((getValue(new Date().getMonth()) + Number.EPSILON) * 100) / 100).toString());
//     });
//  });

var thisMonth = new Date().getMonth()+1;
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "Dezember"];

function pollDataIncome() {
    $.ajax({
        url: '/jsondata/income',
        dataType: 'json',
        type: 'get',
        success: function(data){

            BarChart_Incomes.data.datasets[0].data = [];
            BarChart_Incomes.data.labels = [];
            for (let index = 0; index < thisMonth; index++)
            {
                BarChart_Incomes.data.labels.push(months[index]);
                BarChart_Incomes.data.datasets[0].data.push(data.income_eachMonth[thisMonth-index-1]);
                BarChart_Incomes.options.scales.yAxes[0].ticks.max = checkMaxValueExceeded(data.income_eachMonth[thisMonth-index-1], BarChart_Incomes.options.scales.yAxes[0].ticks.max);
            }
            BarChart_Incomes.update();

            if (data.average_income == null){
                $("#average_income").text("$0");
            } else {
                $('#average_income').text("$" + data.average_income);
            }
            if(data.annual_income == null){
                $('#annual_income').text("$0");
            } else {
                $('#annual_income').text("$" + data.annual_income);
            }
            if (data.lastMonth_income == null){
                $('#last_month_income').text("$0");
            } else {
                $('#last_month_income').text("$" + data.lastMonth_income);
            }

            //$("#last_month_income").text("Hellooo");
        },
        error: function(){
            alert(data.toString);
        }
    });
}

pollDataIncome();

function pollPieChartData()
{
    var poll = function()
    {
    $.ajax({
        url: '/jsondata/piechart-incomes',
        dataType: 'json',
        type: 'get',
        success: function(data)
              {
                  
                  //console.log(PieChartIncome.data.datasets[0]);
                  PieChartIncome.data.datasets[0].data = [];
                  PieChartIncome.data.labels = [];
                  for (let index = 0; index < data.categories.length; index++)
                  {
                    //   console.log(index);
                    //   console.log(data.categories[index]);
                    //   console.log(data.totalincomes[index]);
                      PieChartIncome.data.labels.push(data.categories[index]);  
                      PieChartIncome.data.datasets[0].data.push(data.totalincomes[index]);
                    
                  }
                  PieChartIncome.update();
  
                  
              },
              error: function(err){
                console.log(err);
            }
    })
};
poll();
};

pollPieChartData();


$('#repetition_value').on("keypress keyup blur",function (event) {
       var regex = new RegExp("[0-9]+(\.[0-9][0-9]?)?");
       if (!regex.test(event.key) && event.keyCode != 46) {
           event.preventDefault();
           return false;
       }
});

$("#transactionValue").on("keypress keyup blur", function (event) {
    //$(this).val($(this).val().replace(/[^0-9\.]/g,''));
    // if(event.which == 44)
    // {
    // return true;
    // }
    //if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57  )) {
    
    //  event.preventDefault();
    //}
    var regex = new RegExp("[0-9]+(\.[0-9][0-9]?)?");
    if (!regex.test(event.key) && event.keyCode != 46) {
        event.preventDefault();
        return false;
    }
});

$("#transactionValueModal").on("keypress keyup blur", function (event) {
    // $(this).val($(this).val().replace(/[^0-9\.|\,]/g,''));
    // if(event.which == 44)
    // {
    // return true;
    // }
    // if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57  )) {
    
    //   event.preventDefault();
    // }
    var regex = new RegExp("[0-9]+(\.[0-9][0-9]?)?");
    if (!regex.test(event.key) && event.keyCode != 46) {
        event.preventDefault();
        return false;
    }
});


$("#filterByCategoryIncomeButton").click(function(){
    var categoryToFilter = $("#categoryToFilter").val();
    if (categoryToFilter == "Choose Category") {
        $("#categoryToFilter").css("box-shadow", "0 0 0 3px rgba(255, 0, 0, 0.5)");
        $('#categoryToFilter').css('border-color', 'red');
        $("#filterByCategoryIncomeButton").disabled = true;
    } else {
        $("#filterByCategoryIncomeButton").disabled = false;
        var categoryToFilterJSON = {'categoryToFilter':categoryToFilter};

        $.post( "/jsondata/filterByCategoryIncome", categoryToFilterJSON).done(function(data) {
            BarChart_Incomes.data.datasets[0].data = [];
            BarChart_Incomes.data.labels = [];
            for (let index = 0; index < thisMonth; index++)
            {
                BarChart_Incomes.data.labels.push(months[index]);
                BarChart_Incomes.data.datasets[0].data.push(data.filtered_income_eachMonth[thisMonth-index-1]);
                BarChart_Incomes.options.scales.yAxes[0].ticks.max = checkMaxValueExceeded(data.filtered_income_eachMonth[thisMonth-index-1], BarChart_Incomes.options.scales.yAxes[0].ticks.max);
            }
            BarChart_Incomes.update();
            $("#filter_data").modal('hide');
        });
    }
});


$("#addIncome").click(function(){
    var transactionValue = ($("#transactionValue").val()).replace(',', '.');
    var timePeriod = $("#timePeriod").val();
    var chooseCategory = $("#chooseCategory").val();

    var repetitionValue = $("#repetition_value").val();
    var timeUnit = $("#timeUnit").val();
    var dateTimeID = $("#dateTimeID").val();

    // temporär bis einheitliches Fehlermanagment vorhanden ist..
    if(chooseCategory == "Choose Category" || timePeriod == "Choose Income Type" || (timePeriod == "2" && (timeUnit == "Choose Time unit" || repetitionValue == "")) || transactionValue.charAt(0) == '.' || transactionValue == "")
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
        if(timePeriod == "Choose Income Type")
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



    var transaction = {'transactionValue':transactionValue, 'timePeriod':timePeriod,'chooseCategory':chooseCategory, 'repetitionValue':repetitionValue, 'timeUnit':timeUnit, 'dateTimeID':dateTimeID};
    $.post( "/income", transaction ) 
    .done(function( data ) {
        if (data == "past_error") {
            $("#past_time_alert").modal('show');
        } else {
            location.reload();
        }
    });
});


$("#addIncomeModal").click(function(){
    var transactionValue = ($("#transactionValueModal").val()).replace(',', '.');
    var timePeriod = $("#timePeriodModal").val();
    var chooseCategory = $("#chooseCategoryModal").val();

    var repetitionValue = $("#repetition_valueModal").val();
    var timeUnit = $("#timeUnitModal").val();
    var dateTimeID = $("#dateTimeIDModal").val();

    // temporär bis einheitliches Fehlermanagment vorhanden ist..
    if(chooseCategory == "Choose Category" || timePeriod == "Choose Income Type" || (timePeriod == "2" && (timeUnit == "Choose Time unit" || repetitionValue == "")) || transactionValue.charAt(0) == '.' || transactionValue == "")
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
        if(timePeriod == "Choose Income Type")
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

    var transaction = {'transactionValue':transactionValue, 'timePeriod':timePeriod,'chooseCategory':chooseCategory, 'repetitionValue':repetitionValue, 'timeUnit':timeUnit, 'dateTimeID':dateTimeID};
   $.post( "/income", transaction ) 
    .done(function( data ) {
        if (data == "past_error") {
            $("#past_time_alert").modal('show');
        } else {
            $('#IncomeModal').modal('hide');
            location.reload();
        }
    });
});

$("#addNewCategory").click(function(){
    var newCategory = $("#newCategory").val();
    var description = $("#CategoryDescription").val();
    var category_isExpense = 0; // false

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
    var category_isExpense = 0; // false

    var category = {'newCategory': newCategory, 'description': description, 'category_isExpense': category_isExpense};
    $.post( "/category/add", category ) 
    .done(function( data ) {
        console.log( "Data Loaded: " + data );
        $('#CategoryModal').modal('hide');
        $( ' <option value="' + data[0].category_id + '">' + data[0].category_name + '</option>' ).appendTo( "#chooseCategoryModal" );
        $( ' <option value="' + data[0].category_id + '">' + data[0].category_name + '</option>' ).appendTo( "#chooseCategory" );
    });
});

$("button[data-dismiss-modal=modal2]").click(function(){
    $('#CategoryModal').modal('hide');
});

var categorysById = {};
$(document).ready(function(){
    $.ajax({
        url: '/income/user_categories',
        type: 'GET',
        success: function (data) {
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
            var tableRef = document.getElementById('regular_income_overview').getElementsByTagName('tbody')[0];
            for (const key in data) {
                if(parseInt(data[key]['TRANSACTION_VALUE']) >= 0){
                    // Insert a row in the table at the last row
                    var newRow = tableRef.insertRow();
                    newRow.id = 'regularIncomeRow' + key;
                    for (let index = 0; index < 5; index++) {
                        if(index != 4){
                            var newCell  = newRow.insertCell(index); // Insert the cells in the row
                        }
                        // Append a text node to each cell
                        var newText;
                    switch (index) {
                        case 0: 
                                newText = document.createTextNode('$' + data[key]['TRANSACTION_VALUE']);
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
                                newText = '<td><button id="deleteRegularIncome' + key + '" class="btn btn-circle btn-primary bg-gradient-primary"><i class="fas fa-trash text-white"></i></button></td>';
                                $('#regularIncomeRow' + key).append(newText);
                                break;
                        default: console.log('error');
                            break;
                    }
                    
                    }

                    $('#deleteRegularIncome' + key).click(function(){
                        $.ajax({
                            url: '/income/delete_regular_income',
                            type: 'POST',
                            data: {event_name: data[key]['EVENT_NAME']},
                            success: function (data) {
                                console.log(typeof data);
                                if(data == 'OK'){
                                    $('#regularIncomeRow' + key).remove();
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
});
