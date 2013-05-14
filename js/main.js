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

  var butterfly = new Butterfly(); // current butterfly being "created"

  var Butterflies = Backbone.Collection.extend({
    model: Butterfly
  })

  var butterflyPage = new Butterflies(); // active page for palette selection
  var butterfliesWithSpotCount = new Butterflies(); // total # butterflies meeting spot count

  var updateButterfliesWithSpotCount = function(spotCount) {
    butterfliesWithSpotCount.reset();
    IDsOfInterest = diversifly_data[spotCount - 1]; // 0-indexed
    _(IDsOfInterest).each(function(palette, id) {
      butterfliesWithSpotCount.add({
        eyespot_count : spotCount,
        id : id,
        palette : palette
      });
    });
  }


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

  // simple stuff
  var HomeView = PageView.extend({ template: _.template($('#home-template').html())});
  var AboutView = PageView.extend({ template: _.template($('#about-template').html())});

  // several eyespot-page-related views here

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
    initialize : function() {
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

  var PalettePageView = Backbone.View.extend({
    el : $('#palette-page'),

  });

  var ButterflyPaletteView = Backbone.View.extend({
    render : function () {
        alert('debugging');
        debugger;
        this.$el.html(
          _.template($('#butterfly-palette-template').html(), {
          'colorString' : ""
      }))
    }
  });

  var PaletteView = PageView.extend({
    template : _.template($('#palette-template').html()),
    render : function() {
      PageView.prototype.render.apply(this);
      // the router ensures that the butterfly model has the right spot count
      var palettePageView = new PalettePageView({
        collection : butterfliesWithSpotCount
      });
    }
  });


  // top-level app
  var App = Backbone.View.extend({

    el : $('#container'),

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
      $viewEl = this.$el;
      $viewEl.fadeOut();
      v = this;
      $viewEl.promise().done(function() {
        $viewEl.html(view.render()).fadeIn();
      });
    }
  });

  var app = new App;

  //////////////////////////////////
  // ROUTING
  //////////////////////////////////

  var Router = Backbone.Router.extend({
    routes : {
      "palette/eyespots/:spotCount/page/:page" : "palette",
      ":page" : "defaultTransition",
      "*path" : "defaultPage"
    },

    pageViewMap : {
      home : "homeView",
      about : "aboutView",
      eyespots : "eyespotsView",
      palette : "paletteView",
    },

    defaultPage : function () {
      this.defaultTransition('home')
    },

    palette : function(spotCount, page) {
      butterfly.set('eyespot_count', spotCount);
      updateButterfliesWithSpotCount(spotCount);
      this.defaultTransition('palette');
    },

    oldRoute : "",

    defaultTransition : function(route) {
      app.showView(app.views[this.pageViewMap[route]])
      oldRoute = route;
    }
  });

  // kick things off
  var router = new Router();
  Backbone.history.start();

});
