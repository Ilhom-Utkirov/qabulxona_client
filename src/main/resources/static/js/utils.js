$(document).ready(function () {

  // remove data from form when modal is showing
  $('body').on('hidden.bs.modal', '.modal', function () {
    $(this).removeData('bs.modal');
  });

});// end of $(document).ready