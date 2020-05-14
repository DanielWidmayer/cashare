$(function () {
    //moment().format("DD-MM-YYYY, HH:mm:ss")

    $('.datetimepicker').datetimepicker({
        format: "YYYY-MM-DD HH:mm:ss",
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
    $.viewMapModal = {
        '0': $([]),
        '1': $([]),//$('#groupCalendar'),
        '2': $('#groupTimePeriodModal, #groupCalendarModal')
    };

    $('#timePeriod').change(function () {
        // hide all
        $.each($.viewMap, function () { this.hide(); });
        // show current
        if ($.viewMap[$(this).val()] != undefined) {
            $.viewMap[$(this).val()].show();
        }
        // trick: double click the calendar so the current time and date is default in it
        $('#dateTimeID').click();
        $('#dateTimeID').click();
    });
    $('#timePeriodModal').change(function () {
        // hide all
        $.each($.viewMapModal, function () { this.hide(); });
        // show current
        if ($.viewMap[$(this).val()] != undefined) {
            $.viewMapModal[$(this).val()].show();
        }
        // trick: double click the calendar so the current time and date is default in it
        $('#dateTimeIDModal').click();
        $('#dateTimeIDModal').click();
    });
});