$("document").ready(function() {

  // model for butterfly selection
  Butterfly = Backbone.Model.extend({
    defaults: {
      eyespot_count: 1,
      id: 0,
      palette: [],
    }
  });

  var SliderView = Backbone.View.extend({
    initialize: function() {
      _.bindAll(this, 'render');
      this.model.bind('change:eyespot_count', this.render);
      this.$handleText = null;
      this.render();
      console.log('initialize...m.eyespot_count is', this.model.get('eyespot_count'));
    },
    render: function() {
      var v = this;
      var m = this.model;
      if (this.$handleText != null) // only valid once slider exists
        this.$handleText.html(m.get('eyespot_count'));
      $("#eyespot-slider").slider({
        value: m.get('eyespot_count'),
        min: 1,
        max: 18,
        step: 1,
        create: function() {
          $('.ui-slider-handle').first().html(
            '<span id="handle-text">'+m.get('eyespot_count')+'</span>'
          );
          v.$handleText = $('#handle-text');
        },
        slide: function(event, ui) {
          m.set({'eyespot_count': ui.value});
        }
    })}
  });

  var butterfly = new Butterfly();

  var sliderView = new SliderView({
    model: butterfly
  })

})
