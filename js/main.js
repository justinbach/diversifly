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

    // bind the button to the eyespot count for linking
    var PaletteButtonView = Backbone.View.extend({
      initialize: function() {
        _.bindAll(this, 'updateLink');
        this.model.bind('change:eyespot_count', this.updateLink);
      },
      updateLink : function () {
        this.el.setAttribute("href", "palette/eyespots/" + this.model.get('eyespot_count')
          + "/page/1");
      }
    });

    var paletteButtonView = new PaletteButtonView({
      model: butterfly,
      el: document.getElementById('palette-link')
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

  // routing / navigation via backbone
  var Router = Backbone.Router.extend({
    routes : {
      "palette/eyespots/:spotCount/page/:page" : "palette",
      ":page" : "defaultTransition",
      "*path" : "defaultRoute"
    },

    palette : function () {
      this.defaultTransition('palette');
    },

    defaultRoute : function() {
      this.defaultTransition('home');
    },

    defaultTransition : function(page) {
      var $pageHolder = $('#page-holder');
      // animation setup
      $.fn.animateOut = $.fn.fadeOut;
      $.fn.animateIn = $.fn.fadeIn;
      $pageHolder.animateOut();
      $pageHolder.promise().done(function() {
        var targetPage = pages[page];
        // load new content, execute page functions,
        // and bind click handlers
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

  var router = new Router();
  Backbone.history.start(); // let's go



});
