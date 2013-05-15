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
      name: "",
      country: ""
    }
  });

  var butterfly = new Butterfly(); // current butterfly being "created"

  var Butterflies = Backbone.Collection.extend({
    model: Butterfly
  });

  var butterflyPage = new Butterflies(); // active page for palette selection
  var pageLength = 8; // number of butterflies on a page
  var butterfliesWithSpotCount = new Butterflies(); // total # butterflies meeting spot count

  var updateButterfliesWithSpotCount = function(spotCount) {
    butterfliesWithSpotCount.reset();
    IDsOfInterest = diversifly_data[spotCount - 1]; // 0-indexed
    _(IDsOfInterest).each(function(butterfly, id) {
      butterfliesWithSpotCount.add({
        eyespot_count : spotCount,
        id : id,
        palette : _(butterfly.palette).map(function (c) { return c.substr(1); }),
        name : butterfly.name,
        country : butterfly.country
      });
    });
  }

  var getButterflyByID = function(id) {
    for (var i = 0; i < diversifly_data.length; i++) {
      if (diversifly_data[i].hasOwnProperty(id)) {
        // match
        var record = diversifly_data[i][id];

        return new Butterfly({
          id : id,
          palette : _(record.palette).map(function (c) { return c.substr(1); }),
          name : record.name,
          country : record.country
        });
      }
    }
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
      // console.log('initialize');
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
    el : $('.palette-page'),
    initialize : function() {
      this.$el = $('.palette-page');
      this.paletteDelay = 50;
      this.paletteFade = 150;
      _.bindAll(this);
      this._butterflyPaletteViews = [];
    },
    setCollection : function (col) {
      this.collection = col;
      this._butterflyPaletteViews = [];
      var that = this;
      this.collection.each(function(bfly) {
        that._butterflyPaletteViews.push(new ButterflyPaletteView({
          model : bfly
        }));
      });
    },
    showPalettes : function () {
      // animate in the new page
      var that = this;
      _(this._butterflyPaletteViews).each(function(bflyView) {
        // debugger;
        $bfly = bflyView.render().$el;
        that.$el.append($bfly);
        $bfly.fadeOut(0);
      });
      bindNavLinks(this.$el);
      // debugger;
      _(this.$el.children()).each(function (el, i) {
        $(el).delay(that.paletteDelay * i).fadeIn(that.paletteFade);
      });
    },
    render : function() {
      var children = this.$el.children();
      var that = this;
      // TODO: figure out why children isn't populated here,
      // even though it should be
      if (children.length != 0) {
        // animate out the old page
        _(children.get().reverse()).each(function(el, i) {
          $(el).delay(that.paletteDelay * i).fadeOut(that.paletteFade);
        });
        children.promise().done(function() {
          that.$el.empty();
          that.showPalettes();
        });
      } else {
        that.showPalettes();
      }
    }
  });

  var ButterflyPaletteView = Backbone.View.extend({
    initialize : function() {
      _.bind(this, 'render');
    },
    render : function () {
      // alert('debugging');
      this.$el.html(
        _.template($('#butterfly-palette-template').html(), {
        'id' : this.model.get('id'),
        'colorString' : "colors[]=" + this.model.get('palette').join('&colors[]=')
      }));
      return this;
    }
  });

  var PaletteView = PageView.extend({
    initialize : function() {
      _.bindAll(this);

    },
    template : _.template($('#palette-template').html()),
    page : 1,
    setPage : function(p) {
      if (p > butterfliesWithSpotCount.length / pageLength || p < 1)
        this.page = 1;
      else
        this.page = p;
    },
    updatePagination : function(p) {
      this.setPage(p);
      this.render(false); // don't force total refresh
    },
    setPaginationButtons : function() {
      var that = this;
      var getURL = function (delta) {
        newPage = parseInt(that.page) + parseInt(delta, 10);
        curHash = document.location.hash.substr(1);
        hashArr = curHash.split('/');
        newURL = hashArr.slice(0, hashArr.length - 1).join('/') + '/' + newPage;
        return newURL;
      }
      this.$prevBtn = $('#palette-prev-button'); // TODO: cache earlier
      this.$nextBtn = $('#palette-next-button');
      var totalPages = Math.floor(butterfliesWithSpotCount.length / pageLength);
      if(this.page == 1) {
        this.$prevBtn.removeClass('red').addClass('disabled');
      } else {
        this.$prevBtn.removeClass('disabled').addClass('red');
        this.$prevBtn.attr('href', getURL(-1));
      }
      if(this.page == totalPages) {
        this.$nextBtn.removeClass('yellow').addClass('disabled');
      } else {
        this.$nextBtn.removeClass('disabled').addClass('yellow');
        this.$nextBtn.attr('href', getURL(1));
      }
    },
    clearPalette : function () {
      delete this._palettePageView;
    },
    render : function(pageload) {
      if (typeof pageload == "undefined" || pageload == true)
        PageView.prototype.render.apply(this);
      // the router ensures that the butterfly model has the right spot count
      var start = this.page * pageLength - 1;
      if(typeof this._palettePageView == "undefined")
        this._palettePageView = new PalettePageView();
      this._palettePageView.setCollection(
        new Butterflies(butterfliesWithSpotCount.slice(start, start + pageLength)));

      this.setPaginationButtons();
      this._palettePageView.render();
    }
  });

  // butterfly page stuff
  var ButterflyView = PageView.extend({
    initialize : function() {
      _.bindAll(this);
    },
    template : _.template($('#butterfly-template').html()),
    render : function () {
      PageView.prototype.render.apply(this);
      $reveal = $('#butterfly-reveal');
      $species = $('#species-name');
      $country = $('#country-desc');
      $species.html(butterfly.get('name').toUpperCase());
      $country.html('Native Country: ' + butterfly.get('country'));
      $reveal.css('visibility', 'hidden');
      var i = new Image();
      $(i).load(function() {
        var frameWidth = i.width + 24;
        var frameHeight = i.height + 24;
        console.log(i.height);
        $reveal.fadeOut(0); // TODO: fix this hacky stuff
        $reveal.css('visibility', 'visible');
        $reveal.css('width', frameWidth);
        $reveal.css('height', frameHeight);
        $('#butterfly-reveal').html(i);
        $reveal.fadeIn();
      })
      i.src = "img/butterflies/" + butterfly.get('id') + ".jpg";
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
        paletteView : new PaletteView(),
        butterflyView : new ButterflyView()
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
      "butterfly/:id" : "butterfly",
      "home" : "home",
      ":page" : "defaultTransition",
      "*path" : "defaultPage"
    },

    pageViewMap : {
      home : "homeView",
      about : "aboutView",
      eyespots : "eyespotsView",
      palette : "paletteView",
      butterfly : "butterflyView"
    },

    defaultPage : function () {
      this.defaultTransition('home')
    },

    home : function() {
      butterfly = new Butterfly();
      this.defaultTransition('home');
    },

    palette : function(spotCount, page) {
      if (this.oldRoute.indexOf("palette") != -1) {
        // pagination event
        app.views.paletteView.updatePagination(page);
      } else {
        butterfly.set('eyespot_count', spotCount);
        updateButterfliesWithSpotCount(spotCount);
        app.views.paletteView.setPage(page);
        app.views.paletteView.clearPalette();
        this.defaultTransition('palette');
      }
    },

    butterfly : function(id) {
      butterfly = getButterflyByID(id);
      this.defaultTransition('butterfly');
    },

    oldRoute : "",

    defaultTransition : function(route) {
      app.showView(app.views[this.pageViewMap[route]])
      this.oldRoute = route;
    }
  });

  // kick things off
  var router = new Router();
  Backbone.history.start();

});
