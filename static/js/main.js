var open = false;
let selected = false;

$("#closeNavContent").click(function () {
  $(".navContent").removeClass("open");
  $(".menuItem").removeClass("active");
  open = false;
});

function showContent(id) {
  if (!open) {
    $(".navContent").addClass("open");
    open = true;
    $(".subContent").removeClass("d-block");
    $("#" + id + ".subContent").addClass("d-block");
    $(".menuItem").removeClass("active");
    $("#" + id + "CTA").addClass("active");
  } else {
    $(".subContent").removeClass("d-block");
    $("#" + id + ".subContent").addClass("d-block");
    $(".menuItem").removeClass("active");
    $("#" + id + "CTA").addClass("active");
  }
}

$("input[name='pointRepresentation']").click(function(){
    if($("#dd").is(":checked")){
        $(".dms").addClass("d-none")
        $(".dd").removeClass("d-none")
    }
    if($("#dms").is(":checked")){
        $(".dd").addClass("d-none")
        $(".dms").removeClass("d-none")
    }
})

function showLayerOption(elem) {
  $(elem).next().slideToggle("show")
  $(elem).toggleClass('activeOptions')
}


$(function () {
  // $("#sortable").disableSelection();
  $("#sortable").sortable({
    stop: function (event, ui) {
      // console.log(event, ui);
      // updateZIndex();
    },
  });
});

$(document).ready(function() {
  $('#qry_layers,#qry_columns,#qry_values,#qry_layers2,#qry_layers3').select2();
});

function ExportToExcel(type, id, fn, dl) {
  var elt = document.getElementById(id);
  var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });
  return dl ?
    XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' }):
    XLSX.writeFile(wb, fn || (id + '.' + (type || 'xlsx')));
}