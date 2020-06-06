$('.cb-role').on('change', (function() {
    if($(this).is(':checked')) {
        $('input[name="' + $(this).prop('name') + '"]:hidden').prop('checked', false);
    } else {
        $('input[name="' + $(this).prop('name') + '"]:hidden').prop('checked', true);
    }
}));

$.ajax({
    url: '/user',
    type: 'GET',
    success: function (data) {
        autocomplete(document.getElementById('searchUserInput'), data);
    },
    error: function (request, error) {
        console.log(error + 'Request:' + JSON.stringify(request));
    },
});
