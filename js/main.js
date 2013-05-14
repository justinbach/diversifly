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
    home : {
      template: $('#home-template'),
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

  // backbone routing for history
  var Router = Backbone.Router.extend({
    routes : {
      ":page" : "defaultTransition",
    },

    // TODO: add history.pushstate support or similar?
    defaultTransition : function(page) {
      var $pageHolder = $('#page-holder');
      // animation setup
      $.fn.animateOut = $.fn.fadeOut;
      $.fn.animateIn = $.fn.fadeIn;
      $pageHolder.animateOut();
      $pageHolder.promise().done(function() {
        var targetPage = pages[page];
        // load new content, execute page functions,
        //  and bind click handlers
        $pageHolder.html(targetPage.template.html());
        _(targetPage.fns).each(function (fn) { fn(); });
        $pageHolder.find('a.nav').each(function(index, el) {
          $el = $(el);
          $el.click((function($el) {
            return (
              function(e) {
              router.navigate($el.attr('href'), { trigger : true});
                return false;
              });
            }
          )($el));
        });

        $pageHolder.animateIn();
      });
    }
  });

  Backbone.history.start();
  var router = new Router();

  router.navigate('home', { trigger : true }); // kick things off


});
