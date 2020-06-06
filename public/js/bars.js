function beautifyTime(datetime) {
    if ((datetime[6] = '')) return '';
    var d = new Date(); // build datetime format: yyyy-mm-dd hh:mm:ss
    datetime = datetime.split(/(T|\.|:|-| )/);
    // beautify time
    if (d.getFullYear() - parseInt(datetime[0]) || d.getMonth() + 1 - parseInt(datetime[2]) || d.getDate() - parseInt(datetime[4]) > 1) {
        return datetime[4] + '.' + datetime[2] + '.' + datetime[0];
    } else if (d.getDate() - parseInt(datetime[4]) == 1) {
        return 'yesterday';
    } else if (d.getHours() - parseInt(datetime[6])) {
        return datetime[6] + ':' + datetime[8] + ' | Today';
    } else if (!(d.getMinutes() - parseInt(datetime[8]))) {
        return 'now';
    } else {
        return d.getMinutes() - parseInt(datetime[8]) + ' min';
    }
}


$('.alert-close').on('click', (function(event) {
    event.preventDefault();
    event.stopPropagation();
    let id = $(this).prop('id').split(/_/).pop();
    $.ajax({
        url: '/alerts/read',
        type: 'POST',
        data: { id: id }
    });
    let s_id = '#aw_' + id;
    $(s_id).remove();
    $('.alert-wrapper:hidden:first').addClass('d-flex');
    let list = $('.alert-wrapper');
    let el = document.createElement('button');
    el.classList = 'dropdown-item align-items-center text-gray-500';
    el.type = 'button';
    el.innerText = 'There are now more new Alerts.';
    if(list.length == 0) $('#alert-link').before(el);
    $('#alertsDropdown span').text(parseInt($('#alertsDropdown span').text()) - 1);
}));


$(function() {
    $('.message-div').each((i, el) => {
        let msg_time = $(el).children('span:hidden').text();
        msg_time = beautifyTime(msg_time);
        $(el).children('.small').text($(el).children('.small').text() + ' · ' + msg_time);
    })
})