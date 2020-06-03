var isEditing = false,
    tempNameValue = "",
    tempDataValue = "";
var counter;

$(document).ready(function () {
    bindEvents();
});

jQuery(document).ready(function () {
    var curlink = "/provider/invoicing";

    var navbar = $('.nav, .sidebar-menu');
    var anchor = $(navbar).find("a[href='" + curlink + "']")[0];
    $(anchor).parent('li').addClass('active');
});

// Handles live/dynamic element events, i.e. for newly created edit buttons
$(document).on('click', '.edit', function () {
    var parentRow = $(this).closest('tr'),
        tableBody = parentRow.closest('tbody'),
        tdName = parentRow.children('td.name'),
        tdData = parentRow.children('td.data');

    if (isEditing) {
        var nameInput = tableBody.find('input[name="name"]'),
            dataInput = tableBody.find('input[name="data"]'),
            tdNameInput = nameInput.closest('td'),
            tdDataInput = dataInput.closest('td'),
            currentEdit = tdNameInput.parent().find('td.edit');

        if ($(this).is(currentEdit)) {
            // Save new values as static html
            var tdNameValue = nameInput.prop('value'),
                tdDataValue = dataInput.prop('value');

            tdNameInput.empty();
            tdDataInput.empty();

            tdNameInput.html(tdNameValue);
            tdDataInput.html(tdDataValue);
        }
        else {
            // Restore previous html values
            tdNameInput.empty();
            tdDataInput.empty();

            tdNameInput.html(tempNameValue);
            tdDataInput.html(tempDataValue);
        }
        // Display static row
        currentEdit.html('Edit');
        isEditing = false;
    }
    else {
        // Display editable input row
        isEditing = true;
        $(this).html('Save');

        var tdNameValue = tdName.html(),
            tdDataValue = tdData.html();

        // Save current html values for canceling an edit
        tempNameValue = tdNameValue;
        tempDataValue = tdDataValue;

        // Remove existing html values
        tdName.empty();
        tdData.empty();

        // Create input forms
        tdName.html('<input type="text" name="name" value="' + tdNameValue + '">');
        tdData.html('<input type="text" name="data" value="' + tdDataValue + '">');
    }
});

function getCounter() {
    var rowCount = $('#invoice-table >tbody >tr').length;
    return rowCount;
}

// Handles live/dynamic element events, i.e. for newly created trash buttons
$(document).on('click', '.trash', function () {
    // Turn off editing if row is current input
    if (isEditing) {
        var parentRow = $(this).closest('tr'),
            tableBody = parentRow.closest('tbody'),
            tdInput = tableBody.find('input').closest('td'),
            currentEdit = tdInput.parent().find('td.edit'),
            thisEdit = parentRow.find('td.edit');

        if (thisEdit.is(thisEdit)) {
            isEditing = false;
        }
    }

    // Remove selected row from table
    $(this).closest('tr').remove();
    bindEvents();
    calTotal();
});
$('.new-row').on('click', function (e) {
    e.preventDefault()
    counter = getCounter();
    var tableBody = $(this).closest('tbody'),
        trNew = '<tr><td class="num">' + counter + '</td>' +
            '<td class="admin-form"><div class="smart-widget sm-right smr-50"><label class="field"><input type="text" name=\"name[' + counter + ']\" placeholder="Наименование услуги или товара" class="form-control name"/></label><button style="height: 38px;" type="button" class="button btn-primary cat" data-mfp-src="#test-popup" data-toggle="modal" data-target="#myModal" title="Выбрать из каталога"><i class="glyphicon glyphicon-tags"></i></button></div></td>' +
            // '<td class="name"><input type="text" class="name" id=\"name' + counter + '\" name=\"name[' + counter + ']\" value=""></td>' +
            '<td class="data quantity"><input type="number" min="0" id=\"quantity' + counter + '\" name="quantity" value="1"></td>' +
            '<td class="data price"><input type="text" name="price" id=\"price' + counter + '\" value="0"></td>' +
            '<td class="total"><input type="text" name="cost" id=\"cost' + counter + '\" readonly="readonly"/></td>' +
            '<td class="action"><a class="trash" href="#"><i class="fa fa-trash-o" aria-hidden="true"></i></a></td>' +
            '<</tr>';
    isEditing = true;
    tableBody.find('tr:last').before(trNew);

    // $('#invoice-form').validate().resetForm();
    // $('#invoice-form').validate();
    //
    // $('input[name="name['+counter+']"]').rules("add", {  // <- apply rule to new field
    //     required: true
    // });
    reloadValidate();
    bindEvents();
    putInputMasks();
    counter++;
});

$('#generateLink').on('click', function () {
    submit('/provider/invoice-generate-link');
});

$('#generateTgLink').on('click', function () {
    submit('/provider/invoice-generate-telegram-link');
});
$('#sendLink').on('click', function () {
    submit('/provider/invoice-send');
});

$('#saveLink').on('click', function () {
    submit('/provider/invoice-save');
});

$('#cancelLink').on('click', function () {
    window.location.replace("/provider/invoicing");
});

$("#stores").change(function () {
    var storeId = $('#stores').find(':selected').val();
    $('#storeId').val(storeId);
});

$(document).ready(function () {
    putInputMasks();
});

$(function () {
    $("#email").click(function () {
        if ($(this).is(":checked")) {
            $(".email-form").show();
        } else {
            $(".email-form").hide();
        }
    });
});


function copyToClipboard() {
    var copyText = document.getElementById("gen-link");

    copyText.select();
    document.execCommand("copy");
}

function copyToClipboardModal() {
    var copyText = document.getElementById("gen-link-modalka");

    copyText.select();
    document.execCommand("copy");
}

function bindEvents() {

    $('input[name="price"]').bind('change keyup', function () {
        var qnt = $(this).parents("tr").find("input[name='quantity']").val();
        var price = $(this).inputmask("unmaskedvalue");
        var product = qnt * price;
        $(this).parents("tr").find("input[name='cost']").val(product);
        calTotal();
    });

    $('input[name="quantity"]').bind('change keyup', function () {
        var qnt = parseInt($(this).val());
        var price = $(this).parents("tr").find("input[name='price']").inputmask("unmaskedvalue");
        var product = qnt * price;
        $(this).parents("tr").find("input[name='cost']").val(product);
        calTotal();
    });
}

function calTotal() {
    var total = 0;
    $('input[name="cost"]').each(function (i, el) {
        if ($(this).inputmask("unmaskedvalue"))
            total += parseFloat($(this).inputmask("unmaskedvalue"));
        $('#total').val(total);
        $('#total').text(total);
    });
}

//Submission
function submit(url) {
    if (!validateInvoice()) return false;

    var storeId = $('#storeId').val();
    var invoiceDetails = [];
    var phone = '9989' + $('#phone').inputmask("unmaskedvalue");
    var email = $('#person_email').val();
    var account = $('#account').val();
    var total = $('#total').inputmask("unmaskedvalue");
    var contactType = $('a.btn-xs.active').data('id');

    var invoice = {
        phone: phone,
        email: email,
        details: invoiceDetails,
        storeId: storeId,
        total: total,
        contactType: contactType,
        account: account
    }

    $('table#invoice-table tbody tr').each(function (i, row) {

        // reference all the stuff you need first
        var $row = $(row),
            $name = $row.find('input.name'),
            $qnt = $row.find('input[name="quantity"]'),
            $price = $row.find('input[name="price"]'),
            $cost = $row.find('input[name="cost"]');

        invoiceDetails.push({
            name: $name.val(),
            price: $price.inputmask("unmaskedvalue"),
            cost: $cost.inputmask("unmaskedvalue"),
            qnt: $qnt.val()
        });
    });
    invoice.details = invoiceDetails;
    var data = JSON.stringify(invoice);

    $('.preloader').css('display', 'block');

    $.ajax({
        type: 'POST',
        url: url,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: data,
        success: function (data) {
            var result = data.result;
            if (result == 'success') {
                var method = data.method;
                if (method == 'send' || method == 'save') {
                    alert(data.msg);
                    window.location.href = '/provider/invoicing';
                }
                if (method == 'generate-link') {
                    var link = data.link;
                    $('#gen-link-modalka').val(link);
                    $('#gen-link-modal').modal('toggle');
                }
                if (data.method == 'generate-tg-link') {
                    var link = data.link;
                    window.open(link);
                }
            } else {
                alert(data.msg);
            }

        },
        error: function (data) {
            alert(data)
        }
    });
    $('.preloader').css('display', 'none');
}

function resend() {
    if (!validateInvoice()) return false;

    var invoiceId = $('#invoiceId').val();
    var phone = '9989' + $('#phone').inputmask("unmaskedvalue");
    var email = $('#person_email').val();
    var account = $('#account').val();
    var total = $('#total').inputmask("unmaskedvalue");
    var contactType = $('a.btn-xs.active').data('id');
    var storeId = $('#storeId').val();
    var invoice = {
        id: invoiceId,
        phone: phone,
        email: email,
        storeId: storeId,
        total: total,
        contactType: contactType,
        account: account
    }
    var data = JSON.stringify(invoice);

    var url = "/provider/invoice-resend-link"
    $.ajax({
        type: 'POST',
        url: url,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: data,
        success: function (data) {
            if (data.result == 'fail') {
                alert(data.msg);
            } else {
                if (data.method == 'generate-link') {
                    $('#gen-link').val(data.link);
                    var link = data.link;
                    $('#gen-link-modalka').val(link);
                    $('#gen-link-modal').modal('toggle');
                }

                if (data.method == 'generate-tg-link') {
                    var link = data.link;
                    var win = window.open(link, '_blank');
                    win.focus();
                }

                if (data.method == 'send') {
                    alert(data.msg);
                    window.location.href = '/provider/invoicing';
                }
            }
        },
        error: function (data) {
            alert("b")
        }
    });
}

function sendSaved() {
    if (!validateInvoice()) return false;

    var invoiceDetails = [];
    var invoiceId = $('#invoiceId').val();
    var phone = '9989' + $('#phone').inputmask("unmaskedvalue");
    var email = $('#person_email').val();
    var account = $('#account').val();
    var total = $('#total').inputmask("unmaskedvalue");
    var contactType = $('a.btn-xs.active').data('id');
    var storeId = $('#storeId').val();

    var invoice = {
        id: invoiceId,
        phone: phone,
        email: email,
        details: invoiceDetails,
        storeId: storeId,
        total: total,
        contactType: contactType,
        account: account
    }

    $('table#invoice-table tbody tr').each(function (i, row) {

        // reference all the stuff you need first
        var $row = $(row),
            $name = $row.find('input.name'),
            $qnt = $row.find('input[name="quantity"]'),
            $price = $row.find('input[name="price"]'),
            $cost = $row.find('input[name="cost"]');

        invoiceDetails.push({
            name: $name.val(),
            price: $price.inputmask("unmaskedvalue"),
            cost: $cost.inputmask("unmaskedvalue"),
            qnt: $qnt.val()
        });
    });
    invoice.details = invoiceDetails;
    var data = JSON.stringify(invoice);
    var url = "/provider/invoice-send-saved"
    $.ajax({
        type: 'POST',
        url: url,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: data,
        success: function (data) {
            if (data.result == 'fail') {
                alert(data.msg);
            } else {
                if (data.method == 'generate-link') {
                    $('#gen-link').val(data.link);
                }
                alert(data.msg);
                window.location.href = '/provider/invoicing';
            }
        },
        error: function (data) {
            alert("b")
        }
    });
}

function forwardToRepeat() {
    var invoiceId = $('#invoiceId').val();
    var url = "/provider/invoice-details-repeat/" + invoiceId;
    window.location.replace(url);
}

//Validations
function clearInput() {
    $('table#invoice-table').find('input[name="cost"], input[name="price"], input[name="name"]').val('');
    $('table#invoice-table').find('input[name="quantity"]').val('1');
    $('#invoice-table tbody tr:not(".init")').remove();
    $('#phone').val('');
    $('#phone').text('');

    $('#invoice-form').validate().resetForm();
    $('#invoice-form').validate();

    counter = 1;
};

function validateInvoice() {
    bindEvents();
    var form = $('#invoice-form');

    form.validate({
        rules: {
            phone: {
                required: function () {
                    if ($('#sms').hasClass('active'))
                        return true;
                    else
                        return false;
                },
                minlength: 12,
                maxlength: 19
            },
            price: {
                required: true
            },
            email: {
                required: function () {
                    if ($('#email').hasClass('active'))
                        return true;
                    else
                        return false;
                },
                email: true,
                minlength: 5
            },
            account: {
                required: true,
                minlength: 2
            },
            "name[0]": {
                required: true,
                minlength: 3
            },
            stores: {
                required: true
            }
        },
        messages: {
            "name[0]": {
                required: "Пустое поле",
                minlength: "Введите более 3 символов"
            },
            phone: {
                required: "Пустое поле",
                minlength: "Номер телефона должен быть более 12 символов"
            },
            email: {
                required: "Пустое поле",
                minlength: "Номер телефона должен быть более 12 символов"
            },
            account: {
                required: "Пустое поле",
                minlength: "Идентификатор должен быть более 2 символов"
            },
            stores: {
                required: "Поставщик не выбран"
            }
        }
    });

    console.log(form.valid());
    return form.valid();
}

function reloadValidate() {
    $('#invoice-form').validate().resetForm();
    $('#invoice-form').validate();

    $('.name').each(function () {
        $(this).rules("add", {  // <- apply rule to new field
            required: true,
            messages: {
                required: "Пустое поле",
                minlength: "Введите более 3 символов"
            }
        });
    });

    $('#phone').rules("add", {
        required: true,
        messages: {
            required: "Пустое поле",
            minlength: "Номер телефона должен быть более 12 символов"
        }
    });

    $('#person_email').rules("add", {
        required: true,
        minlength: 5,
        messages: {
            required: "Пустое поле",
            minlength: "Email должен быть более 5 символов"
        }
    });

    $('#account').rules("add", {
        required: true,
        minlength: 2,
        messages: {
            required: "Пустое поле",
            minlength: "Идентификатор должен быть более 2 символов"
        }
    });

    $('#stores').rules("add", {
        required: true,
        messages: {
            required: "Поставщик не выбран"
        }
    });
    bindEvents();
}

$('#gen-link-modal').on('hidden.bs.modal', function () {
    window.location.href = '/provider/invoicing';
});

function putInputMasks() {
    $('#phone').inputmask({
        "mask": "(\\9\\98)\\99 999-99-99",
        clearMaskOnLostFocus: false,
        placeholder: "(998)9* ***-**-**",
        removeMaskOnSubmit: true
    });


    $('input[name="price"]').inputmask("currency", {
        prefix: '',
        digits: 0,
        removeMaskOnSubmit: true
    });

    $('input[name="template-price"]').inputmask("currency", {
        prefix: '',
        digits: 0,
        removeMaskOnSubmit: true
    });

    $('input[name="cost"]').inputmask("currency", {
        prefix: '',
        digits: 0,
        removeMaskOnSubmit: true
    });

    $('#total').inputmask("currency", {
        prefix: '',
        digits: 0,
        removeMaskOnSubmit: true
    });
}

function saveCat(cat) {
    var storeId = $('#storeId').val();
    if (!storeId) return false;
    var category = {'cat': cat, 'storeId': storeId};
    $.ajax({
        type: 'POST',
        url: "/provider/invoice/save-cat",
        dataType: "json",
        data: category,
        success: function (data) {
            reloadCatModal();
        },
        error: function (data) {
            alert("error")
        }
    });
}

var catBtn;
$('.cat').on('click', function () {
    catBtn = $(this);
    reloadCatModal();
});

function reloadCatModal() {
    $('.preloader').css('display', 'block');

    var storeId = $('#storeId').val();
    if (!storeId) return false;
    $.ajax({
        type: 'POST',
        url: "/provider/invoice/list-cat",
        dataType: "json",
        data: {'storeId': storeId},
        success: function (data) {
            $('#tabs_nav li.cat-item').empty();
            $('#cat-items').empty();
            $.each(data, function (k, v) {
                if (k == 0)
                    $('.add-cat').before('<li class="active cat-item"><a class="remove-tab-item" href="#" onclick="removeCat(' + v.id + ')"><i class="fa fa-remove"></i></a><a href="#tab18_' + v.id + '" data-toggle="tab" data-catid="' + v.id + '" aria-expanded="true">' + v.name + '</a></li>');
                else
                    $('.add-cat').before('<li class="cat-item"><a class="remove-tab-item" href="#" onclick="removeCat(' + v.id + ', this)"><i class="fa fa-remove"></i></a><a href="#tab18_' + v.id + '" data-toggle="tab" data-catid="' + v.id + '" aria-expanded="false">' + v.name + '</a></li>');

                $('#cat-items').append(genCatItems(v, k));
            });
            putInputMasks();
            $('.preloader').css('display', 'none');
            $('#myModal').modal();
        },
        error: function (data) {
            $('.preloader').css('display', 'block');
            alert("error")
        }
    });
}

function removeCat(id, el) {
    $(el).parent('li').remove();
    $.ajax({
        type: 'DELETE',
        url: "/provider/invoice/delete-cat/" + id,
        success: function (data) {
            $('tr[id="tab18_' + id + '"]').remove();
        },
        error: function (data) {
            alert("error")
        }
    });
}

function removeCatItem(id) {
    $.ajax({
        type: 'DELETE',
        url: "/provider/invoice/delete-cat-item/" + id,
        success: function (data) {
            $('tr[id="item-' + id + '"]').remove();
        },
        error: function (data) {
            alert("error")
        }
    });
}

function addCatItem(el) {
    var tr = $(el).parents('.row-adder').first();
    var catId = tr.data('catid');
    var name = '';
    var price = 0;
    $(tr).find("td input").each(function () {
        if (this.name == 'template-name')
            name = this.value;
        if (this.name == 'template-price')
            price = $(this).inputmask("unmaskedvalue");
    });

    var template = {name: name, price: price, catId: catId};

    $.ajax({
        type: 'POST',
        url: "/provider/invoice/save-cat-item",
        dataType: "json",
        data: template,
        success: function (data) {
            var row = '<tr id="item-' + data.id + '" class="tr-template-item">\n' +
                '                                                        <td>\n' +
                '                                                            <div class="field">\n' +
                '                                                                <label class="option option-info">\n' +
                '                                                                    <input type="checkbox" name="checked"/><span\n' +
                '                                                                        class="checkbox"></span>\n' +
                '                                                                </label>\n' +
                '                                                            </div>\n' +
                '                                                        </td>\n' +
                '                                                        <td><label for="item1" class="item-name">' + data.name + '</label></td>\n' +
                '                                                        <td class="item-cost">' + data.cost + '</td>\n' +
                '                                                        <td><a href="#" onclick="removeCatItem(' + data.id + ')"><i class="fa fa-remove"></i></a></td>\n' +
                '                                                    </tr>';

            $(tr).find("td input").each(function () {
                $(this).val('');
            });

            $('.row-adder').before(row);
        },
        error: function (data) {
            alert("error")
        }
    });


}

function genCatItems(cat, active) {
    var items = cat.itemVm;
    var rows = '';
    var table;
    if (items) {
        $.each(items, function (k, v) {
            rows += '<tr id="item-' + v.id + '" class="tr-template-item">\n' +
                '                                                        <td>\n' +
                '                                                            <div class="field">\n' +
                '                                                                <label class="option option-info">\n' +
                '                                                                    <input id="item1" type="checkbox" name="checked"/><span\n' +
                '                                                                        class="checkbox"></span>\n' +
                '                                                                </label>\n' +
                '                                                            </div>\n' +
                '                                                        </td>\n' +
                '                                                        <td><label for="item1" class="item-name">' + v.name + '</label></td>\n' +
                '                                                        <td class="item-cost">' + v.cost + '</td>\n' +
                '                                                        <td><a href="#" onclick="removeCatItem(' + v.id + ')"><i class="fa fa-remove"></i></a></td>\n' +
                '                                                    </tr>'
        });
        var tabPaneClass;
        if (active == 0)
            tabPaneClass = 'tab-pane active';
        else
            tabPaneClass = 'tab-pane';

        table = '<div id="tab18_' + cat.id + '" class="' + tabPaneClass + '">\n' +
            '                                                <table class="table table-hover admin-form">\n' +
            '                                                    <thead>\n' +
            '                                                    <tr>\n' +
            '                                                        <th></th>\n' +
            '                                                        <th>Наименование</th>\n' +
            '                                                        <th>Цена (сум)</th>\n' +
            '                                                        <th></th>\n' +
            '                                                    </tr>\n' +
            '                                                    </thead>\n' +
            '                                                    <tbody>\n' + rows +
            '                                                    <tr class="row-adder" data-catId="' + cat.id + '">\n' +
            '                                                        <td>\n' +
            '                                                            <div class="field">\n' +
            '                                                                <label class="option option-info">\n' +
            '                                                                    <input type="checkbox" name="checked"\n' +
            '                                                                           /><span\n' +
            '                                                                        class="checkbox"></span>\n' +
            '                                                                </label>\n' +
            '                                                            </div>\n' +
            '                                                        </td>\n' +
            '                                                        <td>\n' +
            '                                                            <input type="text"\n' +
            '                                                                   placeholder="Добавить новый"\n' +
            '                                                                   class="form-control input-sm" name="template-name"/>\n' +
            '                                                        </td>\n' +
            '                                                        <td>\n' +
            '                                                            <input type="text" placeholder="Цена"\n' +
            '                                                                   class="form-control input-sm" name="template-price"/>\n' +
            '                                                        </td>\n' +
            '                                                        <td><a href="#" onclick="addCatItem(this)"><i class="fa fa-save"></i></a></td>\n' +
            '                                                    </tr>\n' +
            '                                                    </tbody>\n' +
            '                                                </table>\n' +
            '                                            </div>';
    }

    return table;
}

function fillWithTemplates() {
    var items = [];
    $('tr.tr-template-item').each(function (k, v) {
        var checked = $(this).find('input[name="checked"]').is(":checked");
        if (checked) {
            var cost = $(this).find('td.item-cost').text();
            var name = $(this).find('td label.item-name').text();

            items.push({
                name: name,
                cost: cost
            });
        }
    });

    if (items.length > 0) {
        addRows(items);
    }
    $('#myModal').modal('toggle');
}

function addRows(items) {
    $.each(items, function (k, v) {
        counter = getCounter();
        if (k == 0) {
            var tr = $(catBtn).parents('tr').first();
            $(tr).find("td input").each(function () {
                if (this.name.match('^name'))
                    $(this).val(v.name);
                if (this.name.match('^quantity'))
                    $(this).val(1);
                if (this.name.match('^cost'))
                    $(this).val(v.cost);
                if (this.name.match('^price'))
                    $(this).val(v.cost);
            });
        } else {
            var tableBody = $('.new-row').closest('tbody'),
                trNew = '<tr><td class="num">' + counter + '</td>' +
                    '<td class="admin-form"><div class="smart-widget sm-right smr-50"><label class="field"><input type="text" name=\"name[' + counter + ']\" placeholder="Наименование услуги или товара" class="form-control name" value="' + v.name + '"/></label><button style="height: 38px;" type="button" class="button btn-primary cat" data-mfp-src="#test-popup" data-toggle="modal" data-target="#myModal" title="Выбрать из каталога"><i class="glyphicon glyphicon-tags"></i></button></div></td>' +
                    // '<td class="name"><input type="text" class="name" id=\"name' + counter + '\" name=\"name[' + counter + ']\" value=""></td>' +
                    '<td class="data quantity"><input type="number" min="0" id=\"quantity' + counter + '\" name="quantity" value="1"></td>' +
                    '<td class="data price"><input type="text" name="price" id=\"price' + counter + '\" value="' + v.cost + '"></td>' +
                    '<td class="total"><input type="text" name="cost" id=\"cost' + counter + '\" value="' + v.cost + '" readonly="readonly"/></td>' +
                    '<td class="action"><a class="trash" href="#"><i class="fa fa-trash-o" aria-hidden="true"></i></a></td>' +
                    '<</tr>';
            isEditing = true;
            tableBody.find('tr:last').before(trNew);
        }

        reloadValidate();
        bindEvents();
        putInputMasks();
        calTotal();
        counter++;
    });
}