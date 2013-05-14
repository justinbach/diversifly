$(function() {


  //////////////////////////////////
  // MODELS
  //////////////////////////////////

  // model for butterfly selection
  Butterfly = Backbone.Model.extend({
    defaults: {
      eyespot_count: 1,
      id: 0,
      palette: [],
      name: ""
    }
  });

  var butterfly = new Butterfly();

  // jquery caching
  var $pageHolder = $('#page-holder');



  // animation setup
  $.fn.animateOut = $.fn.fadeOut;
  $.fn.animateIn = $.fn.fadeIn;

  var animatePageOut = function() {
    return $pageHolder.animateOut();
  }

  var animatePageIn = function () {
    $pageHolder.animateIn();
  }

  var oldRoute = "";

  // // routing via backbone
  // var Router = Backbone.Router.extend({
  //   routes : {
  //     "palette/eyespots/:spotCount/page/:page" : "palette",
  //     "eyespots" : "eyespots",
  //     ":page" : "defaultTransition",
  //     "*path" : "defaultRoute"
  //   },

  //   // the eyespots page
  //   eyespots: function () {
  //     var init = function() {



      // };
  //     this.defaultTransition('eyespots', init);
  //   },

  //   palette : function () {
  //     this.defaultTransition('palette');
  //   },

  //   defaultRoute : function() {
  //     this.defaultTransition('home');
  //   },

  //   defaultTransition : function(page, init) {
  //     console.log("from", oldRoute);
  //     console.log("to", Backbone.history.fragment);

  //     $pageHolder.animateOut();
  //     $pageHolder.promise().done(function() {
  //       // load new content, execute page functions,
  //       // and bind click handlers
  //       $pageHolder.html($("#" + page + "-template").html());
  //       if(typeof init != "undefined")
  //         init();
  //       bindNavLinks();
  //       $pageHolder.animateIn();
  //     });
  //     oldRoute = page;
  //   }
  // });

  // var router = new Router();
  // Backbone.history.start(); // let's go


  //////////////////////////////////
  // VIEWS
  //////////////////////////////////

  // helper for initializing navigation links
  var bindNavLinks = function ($container) {
    $container.find('a.nav').each(function(index, el) {
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
  }

  // generic view for page support
  var PageView = Backbone.View.extend({

    el: $('#page-holder'),

    initialize : function () {
      console.log('initialize');
    },

    render : function() {
      this.$el.html(this.template());
      bindNavLinks(this.$el);
    }
  });

  var HomeView = PageView.extend({ template: _.template($('#home-template').html())});

  var AboutView = PageView.extend({ template: _.template($('#about-template').html())});

  // handles update of slider count as well as spot count in model
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

  var EyespotsView = PageView.extend({
    template : _.template($('#eyespots-template').html()),
    render : function () {
      PageView.prototype.render.apply(this);
      var sliderView = new SliderView({
        model: butterfly
      });
      var paletteButtonView = new PaletteButtonView({
        model: butterfly,
        el: document.getElementById('palette-link')
      });
    }
  });

  var PaletteView = PageView.extend({
    template: _.template($('#palette-template').html())
  });


  var App = Backbone.View.extend({

    el: $('#container'),

    initialize : function () {
      this.views = {
        homeView : new HomeView(),
        aboutView : new AboutView(),
        eyespotsView : new EyespotsView(),
        paletteView : new PaletteView()
      };
      this.showView(this.views.homeView);
    },
    showView : function (view) {
        this.$el.html(view.render()).show();
    }
  });

  var app = new App;

  //////////////////////////////////
  // ROUTING
  //////////////////////////////////

  var Router = Backbone.Router.extend({
    routes : {
      // "palette/eyespots/:spotCount/page/:page" : "palette",
      // "eyespots" : "eyespots",
      ":page" : "defaultTransition"
      // "*path" : "defaultRoute"
    },

    defaultTransition : function(page) {
      var pageViewMap = {
        home : "homeView",
        about : "aboutView",
        eyespots : "eyespotsView",
        palette : "paletteView",
      }
      console.log(page);
      // debugger;
      app.showView(app.views[pageViewMap[page]])
    }
  });

  // kick things off
  var router = new Router();
  Backbone.history.start();

});
