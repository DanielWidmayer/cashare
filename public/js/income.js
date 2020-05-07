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

$("#addIncome").click(function(){
    var transactionValue = ($("#transactionValue").val()).replace(',', '.');
    var timePeriod = $("#timePeriod").val();
    var chooseCategory = $("#chooseCategory").val();

    // temporär bis einheitliches Fehlermanagment vorhanden ist..
    if(chooseCategory == "Choose Category" || timePeriod == "Choose Time period" || transactionValue.charAt(0) == '.' || transactionValue == "")
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
        if(timePeriod == "Choose Time period")
        {
            $("#timePeriod").css("box-shadow", "0 0 0 3px rgba(255, 0, 0, 0.5)");
            $('#timePeriod').css('border-color', 'red');
        }
        return false;
    }



    var transaction = {'transactionValue':transactionValue, 'timePeriod':timePeriod,'chooseCategory':chooseCategory};
    $.post( "/income", transaction ) 
    .done(function( data ) {
        console.log( "Data Loaded: " + data );
        location.reload();
    });
});

$("#addIncomeModal").click(function(){
    var transactionValue = ($("#transactionValueModal").val()).replace(',', '.');
    var timePeriod = $("#timePeriodModal").val();
    var chooseCategory = $("#chooseCategoryModal").val();

        // temporär bis einheitliches Fehlermanagment vorhanden ist..
        if(chooseCategory == "Choose Category" || timePeriod == "Choose Time period" || transactionValue.charAt(0) == '.' || transactionValue == "")
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
            if(timePeriod == "Choose Time period")
            {
                $("#timePeriodModal").css("box-shadow", "0 0 0 3px rgba(255, 0, 0, 0.5)");
                $('#timePeriodModal').css('border-color', 'red');
            }
            return false;
        }

    var transaction = {'transactionValue':transactionValue, 'timePeriod':timePeriod,'chooseCategory':chooseCategory};
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
