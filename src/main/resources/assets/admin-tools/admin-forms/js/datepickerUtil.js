function setDefaultDatesDatepicker() {
    var today = new Date();
    console.log(today.getMonth() + 1);
    var thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    var fromMonth = (thirtyDaysAgo.getMonth() + 1) < 10 ? '0' + (thirtyDaysAgo.getMonth() + 1) : (thirtyDaysAgo.getMonth() + 1)
    var fromDay = (thirtyDaysAgo.getDay() + 1) < 10 ? '0' + (thirtyDaysAgo.getDay() + 1) : (thirtyDaysAgo.getDay() + 1)
    var _from = thirtyDaysAgo.getFullYear() + '.' + fromMonth + '.' + fromDay;
    console.log(_from);

    var toMonth = (today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
    var toDay = (today.getDay() + 1) < 10 ? '0' + (today.getDay() + 1) : (today.getDay() + 1);
    var _to = today.getFullYear() + '.' + toMonth + '.' + toDay;

    $('input[name=date_from]').val(_from);
    $('input[name=date_to]').val(_to);
}


$(document).on('click', '#btn-set-createdAt-this-month', function () {
    var createdAt = new Date();
    var month = (createdAt.getMonth() + 1);
    if (month < 10) month = '0' + month;
    var date_from = createdAt.getFullYear() + '.';
    date_from += month + '.';
    date_from += '01';
    var next_month = createdAt.getMonth() + 1;
    var next_year = createdAt.getFullYear();
    if (next_month == 12) {
        next_month = 0;
        next_year++;
    }
    next_month++;
    if (next_month < 10) next_month = '0' + next_month;
    var date_to = next_year + '.' + next_month + '.01';
    $('input[name=date_from]').val(date_from);
    $('input[name=date_to]').val(date_to);
});

$(document).on('click', '#btn-set-createdAt-today', function () {
    var createdAt = new Date();
    var date_from = createdAt.getFullYear() + '.';
    var month = (createdAt.getMonth() + 1);
    if (month < 10) month = '0' + month;
    var day = createdAt.getDate();
    if (day < 10) day = '0' + day;
    date_from += month + '.';
    date_from += day;
    $('input[name=date_from]').val(date_from);
    $('input[name=date_to]').val('');
});