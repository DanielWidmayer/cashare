$("#addIncome").click(function(){
    var transactionValue = $("#transactionValue").val();
    var timePeriod = $("#timePeriod").val();
    var chooseCategory = $("#chooseCategory").val();

    var transaction = {'transactionValue':transactionValue, 'timePeriod':timePeriod,'chooseCategory':chooseCategory};
    $.post( "/income", transaction ) 
    .done(function( data ) {
        console.log( "Data Loaded: " + data );
        location.reload();
    });
});

$("#addIncomeModal").click(function(){
    var transactionValue = $("#transactionValueModal").val();
    var timePeriod = $("#timePeriodModal").val();
    var chooseCategory = $("#chooseCategoryModal").val();

    var transaction = {'transactionValue':transactionValue, 'timePeriod':timePeriod,'chooseCategory':chooseCategory};
    $.post( "/income", transaction ) 
    .done(function( data ) {
        console.log( "Data Loaded: " + data );
        $('#IncomeModal').modal('hide');
        location.reload;
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
