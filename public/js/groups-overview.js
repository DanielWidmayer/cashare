$('.cb-role').on('change', (function() {
    if($(this).is(':checked')) {
        $('input[name="' + $(this).prop('name') + '"]:hidden').prop('checked', false);
    } else {
        $('input[name="' + $(this).prop('name') + '"]:hidden').prop('checked', true);
    }
}));
