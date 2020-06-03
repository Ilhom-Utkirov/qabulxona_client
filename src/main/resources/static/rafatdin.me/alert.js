/**
 * Created by rafatdin on 12/10/18.
 */

var alertCount = 0;
function createAlert(text, type){
    if(!type)
        type = "info";

    if($('#alert-'+alertCount).length === 0)
        alertCount = -1;
    alertCount+=1;

    var position = 6 + (4*alertCount);
    var alert = '<div class="alert alert-'+type+' alert-dismissable" id="alert-'+alertCount+'" ' +
        'style="position: absolute; z-index: 100;right: 50px; top:'+position+'em; display: none;">' +
        '<button type="button" data-dismiss="alert" aria-hidden="true" class="close"></button>' +
        '<i class="fa fa-info pr10"></i>' +
        '<span class="text">'+text+'&nbsp;</span>'
        +'</div>"';
    $('body').append(alert);
    $('#alert-'+alertCount).fadeToggle();
    return $('#alert-'+alertCount);
}

function changeAlert(alert, text, success){
    if(alert){
        if(text){
            $(alert).find('.text').text(text + ' ');
        }
        if(success){
            $(alert).find('.fa').attr('class', 'pr10 fa fa-check');
            $(alert).removeClass('alert-info').removeClass('alert-warning').addClass('alert-success');
            setTimeout(function(){
                $(alert).fadeToggle();
            }, 5000);
        }else{
            $(alert).find('.fa').attr('class', 'pr10 fa fa-warning');
            $(alert).removeClass('alert-info').removeClass('alert-success').addClass('alert-warning');
        }
    }
}