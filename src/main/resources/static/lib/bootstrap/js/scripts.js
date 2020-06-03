$('document').ready(function(){

  var TEMP_HTML = null;
  var EQUIPMENT_FORM = 0;
  var body = $('body');

  $('._tooltip').tooltip();

  $('.datepicker').mask('99.99.9999');
  $('.datepicker_year').mask('9999');

  $('#password').pwstrength({texts: ['ненадёжный', 'средний', 'нормальный', 'надёжный', 'очень надёжный']});

  body.modalmanager();

  body.on('click', '._inspection_form', function(e){
    e.preventDefault();
    $('#_inspect_result_form').resetForm();
    $('#_inspect_equipment_id').val($(this).data('pk'));
  });

  body.on('click', '._equip_modal', function(e){
    e.preventDefault();
    //switchEquipmentField(0);
  });

  body.on('click', '._password_modal', function(e){
    e.preventDefault();
    $('#_password_form').resetForm();
  });

  body.on('click', '._search_toggle', function(e){
    e.preventDefault();
    $('._search_panel').toggle();
  });

  $("#_owner_form").validate({
    highlight: function(element) {
      $(element).css('border-color', '#D33A3A');
    },
    unhighlight: function(element) {
      $(element).css('border-color', '#AEAEAE #C6C6C6 #C6C6C6 #C6C6C6');
      //$(element).next().hide();
    },
    errorPlacement: function(error, element) {
      element.next().text(error.text()).show();
    },
    submitHandler: function(form)
    {

      $(form).ajaxSubmit({
        success: function(response){
          if(response.success == true)
          {
            var url_array = location.href.split('/');
            if(url_array[url_array.length-1]=='owners' || url_array[url_array.length-1]=='admin')
            {
              location.reload();
            } else
            {
              if(response.result != null)
              {
                $("._owner_select").append('<option value="'+response.result.inn+'" selected>'+response.result.name+'</option>');
              }
              $("#owner_form").modal('hide');
            }
          }
          else
          {
            alert("организация с такими инициалами уже есть в базе");
          }
        }
      });
    }
  });

  $("#owner_form").on("shown", function(){
    $("#_owner_form").resetForm();
  });

  $("#myModal").on("hidden.bs.modal", function(){
    var $form = $("#_equipment_form");
    //if(EQUIPMENT_FORM==1)
    //{
      $form.attr('action', $form.data('url'));
      $('select[name=equipType]').val("");
      $('input[name=regNum]').val("");
      $('input[name=plantNum]').val("");
      $('input[name=manufacturer]').val("");
      $('input[name=manufactured]').val("");
      $('input[name=param1]').val("");
      $('input[name=param2]').val("");
      $('input[name=param3]').val("");
      $('input[name=param4]').val("");
      $('input[name=param5]').val("");
      $('input[id="inspection.expired"]').attr('name', 'inspection.expired');
    /*}
    else
    {
      $form.resetForm();
    }*/

  });

  var offset = $('.navbar').height();
  $("html:not(.legacy) table").stickyTableHeaders({fixedOffset: offset});

  $().UItoTop({ easingType: 'easeOutQuart' });

  var $modal = $('#ajax-modal');

  $('._users_form').on('click', function(e){
    var action = $(this).data('action');
    var id = $(this).data('id');
    var url = action == 'add' ? document.URL+'/form/add' : document.URL+'/edit/update/'+id;
    e.preventDefault();
    $('body').modalmanager('loading');
    setTimeout(function(){
      $modal.load(url, '', function(){
        $modal.modal();
      });
    }, 100);
  });

  $('._eqmodal_form').on('click', function(e){
    var form = $('#_equipment_form'), id=$(this).data('id'), geturl = $(this).data('geturl');
    form.attr('action', $(this).data('url'));
    $.ajax({
      url: geturl,
      success: function(response){
        //switchEquipmentField(1);
    	  $('select[name=owner]').val(response.result.owner.inn);
    	  $('select[name=inspector]').val(response.result.inspector.id);
        $('select[name=equipType]').val(response.result.equipType.id);
        $('input[name=regNum]').val(response.result.regNum);
        $('input[name=plantNum]').val(response.result.plantNum);
        $('input[name=manufacturer]').val(response.result.manufacturer);
        var manufactured = printDate(response.result.manufactured);
        $('input[name=manufactured]').val(manufactured);
        $('input[id="inspection.expired"]').attr('name', 'newInspection.expired');
        $('input[name=param1]').val(response.result.param1);
        $('input[name=param2]').val(response.result.param2);
        $('input[name=param3]').val(response.result.param3);
        $('input[name=param4]').val(response.result.param4);
        $('input[name=param5]').val(response.result.param5);
      }
    });
    e.preventDefault();
  });

  var editableDom = $('.editable');
  editableDom.editable(editableDom.data('url'), {
    "data" : function(string) {
      $(this).parent().removeClass('invalid');
      $('._regNum_star').remove();
      return $.trim(string)
    },
    "placeholder" : "нет"
  });

  body.on('change', '._regions', function(e){
    var areas = $('._areas'), regions = $(this);
    $.ajax({
      url: BASE_URL + '/user/areas/'+$(this).val(),
      success: function(response){
        regions.attr('name', 'region');
        areas.attr('name', 'not_region');
        areas.html('<option value="" selected="true" disabled="true">-- Выберите регион --</option>');
        $.each(response.result, function(){
          areas.append('<option value="'+this.id+'">'+this.name+'</option>');
        });
      }
    });
  });

  body.on('change', '._areas', function(e){
    if($(this).val()!=null)
    {
      $('._regions').attr('name', 'not_region');
      $(this).attr('name', 'region');
    }
  });

  $('._required').tooltip({title: 'Объязательно для заполнения'});

  /*function switchEquipmentField(status)
  {
    if(status==0)
    {
      if(EQUIPMENT_FORM==1)
      {
        $('._owner_select').attr('name', 'owner').attr('required', true);
        $('._owner_select_div').show();
        $('._owner_text').attr('name', 'owner_temp').attr('value=""');
        $('._owner_text_div').hide();
      }
      else
      {
        $('._owner_text').attr('name', 'owner_temp');
        $('._owner_text_div').hide();
      }
      EQUIPMENT_FORM=0;
    }
    else
    {
      if(EQUIPMENT_FORM==0)
      {
        $('._owner_text').attr('name', 'owner');
        $('._owner_text_div').show();
        $('._owner_select').attr('name', 'owner_temp').attr('required', false);
        $('._owner_select_div').hide();
      }
      else
      {
        $('._owner_select').attr('name', 'owner_temp').attr('required', false);
        $('._owner_select_div').hide();
      }
      EQUIPMENT_FORM=1;
    }
  }*/
});

function printDate(time) {
  var temp = new Date(time);
  var dateStr = padStr(temp.getFullYear()) + '-' +
    padStr(1 + temp.getMonth()) + '-' +
    padStr(temp.getDate());
    return dateStr;
}

function padStr(i) {
  return (i < 10) ? "0" + i : "" + i;
}
