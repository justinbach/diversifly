$("document").ready(function() {

  // model for butterfly selection
  Butterfly = Backbone.Model.extend({
    defaults: {
      eyespot_count: 1,
      id: 0,
      palette: [],
    }
  });

  var butterfly = new Butterfly();

  var eyespots = function() {

    var SliderView = Backbone.View.extend({
      initialize: function() {
        _.bindAll(this, 'render');
        this.model.bind('change:eyespot_count', this.render);
        this.$handleText = null;
        this.$eyespotSlider = $('#eyespot-slider');
        this.render();
      },
      render: function() {
        var v = this;
        var m = this.model;
        v.$eyespotSlider.slider({
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
        });
        this.$handleText.html(m.get('eyespot_count'));
      }
    });

    var sliderView = new SliderView({
      model: butterfly
    });
  }

  // pages and flow
  var pages  = {
    about : {
      template: $('#about-template'),
      fns: []
    },
    landing : {
      template: $('#landing-template'),
      fns: []
    },
    eyespots : {
      template: $('#eyespots-template'),
      fns: [eyespots]
    },
    palette : {
      template: $('#palette-template'),
      fns: []
    }
  }

  var $pageHolder = $('#page-holder');

  // TODO: clean up using promises
  // TODO: add history.pushstate support or similar?
  var navigateTo = function(page) {
    // debugger;
    $pageHolder.fadeOut(function() {
      var targetPage = pages[page];
      $pageHolder.html(targetPage.template.html());
      _(targetPage.fns).each(function (fn) { fn(); });
      $pageHolder.find('a.nav').each(function(index, el) {
        $el = $(el);
        // debugger;
        $el.click((function($el) {
          return (
            function(e) {
              navigateTo($el.attr('href'));
              return false;
            });
          }) ($el));
      });
      $pageHolder.fadeIn();
    });

  }

  navigateTo('landing');


});
