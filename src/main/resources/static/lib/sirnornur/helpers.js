function toggleOnCheckboxClicked(checkbox, elementForToggling, initallyVisible) {
    $(checkbox).click(function () {
        $(elementForToggling).slideToggle();
    });
    if(initallyVisible==undefined) {
        $(elementForToggling).toggle($('input[type=checkbox]'+checkbox).is(':checked'));
    } else {
        $(elementForToggling).toggle(initallyVisible);
    }
}

var formatPrice = function(number, c, d, t){
    var c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = number < 0 ? "-" : "",
        i = parseInt(number = Math.abs(+number || 0).toFixed(c)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    var result = s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(number - i).toFixed(c).slice(2) : "");
    return result;
};

function formatMoney(tiyinMoney) {
    return (parseFloat(tiyinMoney)/100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}