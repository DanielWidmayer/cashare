$(function () {
    $('#datetimepicker').datetimepicker({
        icons: {
            time: "fa fa-clock text-primary",
            date: "fa fa-calendar text-primary",
            up: "fa fa-arrow-up text-primary",
            down: "fa fa-arrow-down text-primary"
        }
    });
});

$(document).ready(function () {
    $.viewMap = {
        '0': $([]),
        //'1': $('#groupCalendar'),
        '2': $('#groupTimePeriod, #groupCalendar')
    };

    $('#timePeriod').change(function () {
        // hide all
        $.each($.viewMap, function () { this.hide(); });
        // show current
        $.viewMap[$(this).val()].show();

        // trick: double click the calendar so the current time and date is default in it
        $('#dateTimeID').click();
        $('#dateTimeID').click();
    });
});