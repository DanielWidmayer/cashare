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


function pollDataIncome() {
    var poll = function(){
        $.ajax({
            url: '/jsondata-income',
            dataType: 'json',
            type: 'get',
            success: function(data){

                var thisMonth = new Date().getMonth()+1;

                BarChart_Incomes.data.datasets[0].data = [];
                for (let index = 0; index < thisMonth; index++)
                {
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
        })
    };
    poll();
    setInterval(function(){
        poll();
    }, 1000);
}

pollDataIncome();


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
        console.log( "Data Loaded: " + data );
        location.reload();
        //document.getElementById("#average_income").contentWindow.location.reload(true);
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
        console.log( "Data Loaded: " + data );
        $('#IncomeModal').modal('hide');
        location.reload();
    });
});

$("#addNewCategory").click(function(){
    var newCategory = $("#newCategory").val();
    var description = $("#CategoryDescription").val();
    var category_isExpense = 0; // false

    var category = {'newCategory': newCategory, 'description': description, 'category_isExpense':category_isExpense};
    $.post( "/addCategory", category ) 
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
    $.post( "/addCategory", category ) 
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
