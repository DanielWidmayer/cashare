$(document).ready(function(){
    
    var transaction_log_list = $('#transaction_log_list');

    $.ajax({
        url: '/jsondata/transactionLogs',
        type: 'GET',
        success: function (data) {
        //     for (const key in data) {
        //         categorysById[data[key]['category_id']] = data[key]['category_name'];
        //     }
        // },error: function (request, error) {
        //     console.log(error + 'Request:' + JSON.stringify(request));
            console.log(data);

            for (var i = 0; i<data.length; i++){
                var tr_category = data[i].category_name;
                var tr_date = data[i].transaction_date;
                var tr_value = Math.abs(data[i].transaction_value);
                if (data[i].transaction_value > 0){
                    tr_type="Income";
                } else {
                    tr_type = "Expense";
                }

                transaction_log_list.append('<tr><td>' 
                + tr_type + '</td><td>' + tr_value + '</td><td>' + tr_category + '</td><td>' + tr_date + '</td></tr>');
            }
            $('#dataTable').DataTable({"recordsTotal":data.length, paging: false,searching: false});
        }
    });
});
