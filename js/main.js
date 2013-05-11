$("document").ready(function() {

  // jquery cache
  var $handle;
  var $handleTxt = $('<span id="handle-text">1</span>');
  var initVal = 1;


  var onSliderCreate = function() {
    $handle = $('.ui-slider-handle').first();
    $handle.html($handleTxt);
  };

  var onSliderChange = function(event, ui) {
    $handleTxt.html(ui.value);
  }

  $("#eyespot-slider").slider({
    value: initVal,
    min:   1,
    max:  18,
    step:  1,
    create: onSliderCreate,
    change: onSliderChange,
    slide: onSliderChange
  });
})
