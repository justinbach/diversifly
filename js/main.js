// $(function () {

  // helper to load images using jquery deferred objects
  // see http://aboutcode.net/2013/01/09/load-images-with-jquery-deferred.html
  $.loadImage = function (url) {
    // Define a "worker" function that should eventually resolve or reject the deferred object.
    var loadImage = function (deferred) {
      var image = new Image();

      // Set up event handlers to know when the image has loaded
      // or fails to load due to an error or abort.
      image.onload = loaded;
      image.onerror = errored; // URL returns 404, etc
      image.onabort = errored; // IE may call this if user clicks "Stop"

      // Setting the src property begins loading the image.
      image.src = url;

      function loaded() {
        unbindEvents();
        // Calling resolve means the image loaded sucessfully and is ready to use.
        deferred.resolve(image);
      }
      function errored() {
        unbindEvents();
        // Calling reject means we failed to load the image (e.g. 404, server offline, etc).
        deferred.reject(image);
      }
      function unbindEvents() {
        // Ensures the event callbacks only get called once.
        image.onload = null;
        image.onerror = null;
        image.onabort = null;
      }
    };

    // Create the deferred object that will contain the loaded image.
    // We don't want callers to have access to the resolve() and reject() methods,
    // so convert to "read-only" by calling `promise()`.
    return $.Deferred(loadImage).promise();
  };



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


  // TODO: factor out common code below
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

  // a few global animation settings
  var paletteFade = 150;
  var paletteDelay = 100;
  var paletteSlide = 500;
  var viewFade = 500;
  var revealFade = 1000;

  // helper for initializing navigation links
  var bindNavLinks = function ($container) {
    $container.find('a.nav').each(function(index, el) {
      var $el = $(el);
      $el.click((function($el) {
        console.log('binding nav link');
        return (
          function(e) {
            router.navigate($el.attr('href'), { trigger : true});
            return false;
          });
        }
      )($el));
    });
  }

  // and the converse
  var unbindNavLinks = function ($container) {
    $container.find('a.nav').each(function(index, el) {
      console.log('unbinding nav link');
      $(el).unbind();
    });
  }

  // generic view for page support
  var PageView = Backbone.View.extend({
    initialize : function() {
      _.bindAll(this);
    },
    el : $('#page-holder'),
    render : function() {
      this.$el.html(this.template());
      bindNavLinks(this.$el);
    },
    childViews : [],
    close : function() {
      // TODO: should we be removing and unbinding here?
      // each page instance is only created once...
      // this.remove();
      // this.unbind();
      _.each(this.childViews, function(childView) {
        if (childView.close)
          childView.close();
          delete childView;
      });
    }
  });

  // simple stuff
  var HomeView = PageView.extend({ template: _.template($('#home-template').html())});
  var AboutView = PageView.extend({ template: _.template($('#about-template').html())});

  // several eyespot-page-related views here

  // handles update of slider count as well as spot count in model
  var SliderView = Backbone.View.extend({
    initialize : function () {
      _.bindAll(this, 'render');
      this.listenTo(this.model, 'change:eyespot_count', this.render);
      this.$handleText = null;
      this.$eyespotSlider = $('#eyespot-slider');
      this.render();
    },
    render : function () {
      var v = this;
      var m = this.model;
      v.$eyespotSlider.slider({
        value: m.get('eyespot_count'),
        min: 1,
        max: 18,
        step: 1,
        create : function () {
          $('.ui-slider-handle').first().html(
            '<span id="handle-text">'+m.get('eyespot_count')+'</span>'
          );
          v.$handleText = $('#handle-text');
        },
        slide : function (event, ui) {
          m.set({'eyespot_count': ui.value});
        }
      });
      this.$handleText.html(m.get('eyespot_count'));
    },
    close : function () {
      this.stopListening();
      this.unbind();
      // TODO: disable slider
      // this.$eyespotSlider.destroy();
      this.$eyespotSlider = null;
      this.$handleText = null;
      this.remove();
    }
  });

  // bind the button to the eyespot count for linking
  var PaletteButtonView = Backbone.View.extend({
    initialize : function () {
      _.bindAll(this, 'updateLink');
      this.listenTo(this.model, 'change:eyespot_count', this.updateLink);
    },
    updateLink : function () {
      this.el.setAttribute("href", "palette/eyespots/" + this.model.get('eyespot_count')
        + "/page/1");
    },
    close : function () {
      this.stopListening();
      this.unbind();
      this.remove();
    }
  });

  var EyespotsView = PageView.extend({
    template : _.template($('#eyespots-template').html()),
    render : function () {
      PageView.prototype.render.apply(this);
      this.childViews.push(new SliderView({
        model: butterfly
      }));
      this.childViews.push(new PaletteButtonView({
        model: butterfly,
        el: document.getElementById('palette-link')
      }));
    }
  });

  var PalettePageView = Backbone.View.extend({
    el : $('.palette-page'),
    initialize : function() {
      _.bindAll(this);
      this.$el = $('.palette-page');
      this.$el.bind('click', this.handleClick);
      this._butterflyPaletteViews = [];
    },
    setCollection : function (col) {
      if (this.collection) {
        _(this.collection).map(function (m) {
          delete m;
        })
        delete this.collection;
      }
      this.collection = col;
      this.closeButterflyPaletteViews();
      this._butterflyPaletteViews = [];
      var that = this;
      this.collection.each(function(bfly) {
        that._butterflyPaletteViews.push(new ButterflyPaletteView({
          model : bfly
        }));
      });
    },
    handleClick : function (e) {
      // set up click handler for animation
      // it's either the image or its parent
      var $link = (e.target.tagName == "IMG" ?
        $(e.target.parentElement) : $(e.target));
      this.navigateFrom($link.attr('href').split('/')[1]);
      return false;
    },
    navigateFrom : function (id) {
      butterfly.set('id', id);
      var children = this.$el.children();
      var that = this;
      var $palette;
      _(children.get().reverse()).each(function(el, i) {
        var $el = $(el).children().first();
        var position = $el.position();
        $el.css('position', 'absolute');
        $el.css('left', position.left + 'px');
        $el.css('top', position.top + 'px');
        if($el.attr('href').split('/')[1] != id) {
          $el.fadeOut(paletteFade);
        } else {
          $palette = $el;
        }
      });
      children.promise().done(function() {
        var $buttons = $('.buttons');
        var $banner = $('.banner');
        var $spacer = $('.spacer');
        // adjust for gutter
        var centerLeft = that.$el.width() / 2 - $palette.width() / 2 - 35;
        var centerTop = that.$el.height() / 2 - $palette.height() / 2;
        $palette.animate(
          {left : centerLeft, top : centerTop},
          paletteSlide);
        _([$buttons, $banner, $spacer]).each(function($el) {
          $el.delay(paletteSlide).animate({opacity : 0}, paletteSlide);
        });
        $banner.promise().done(function() {
          router.navigate("butterfly/" + butterfly.get('id'), {trigger: true});
        })
      });
      return false;
    },
    showPalettes : function () {
      // animate in the new page
      var that = this;
      _(this._butterflyPaletteViews).each(function(bflyView) {
        var $bfly = bflyView.render().$el;
        that.$el.append($bfly);
        $bfly.fadeOut(0);
      });
      _(this.$el.children()).each(function (el, i) {
        $(el).delay(paletteDelay * i).fadeIn(paletteFade);
      });
    },
    render : function() {
      var children = this.$el.children();
      var that = this;
      // debugger;
      if (children.length != 0) {
        // animate out the old page
        _(children.get().reverse()).each(function(el, i) {
          $(el).delay(paletteDelay * i).fadeOut(paletteFade);
        });
        children.promise().done(function() {
          _(children).map(function (el) {
            var $el = $(el);
            $el.unbind();
            $el.remove();
          });
          that.$el.empty();
          that.showPalettes();
        });
      } else {
        that.showPalettes();
      }
    },
    closeButterflyPaletteViews : function() {
      _(this._butterflyPaletteViews).each(function(bflyPaletteView) {
        bflyPaletteView.close();
        bflyPaletteView = null;
      });
    },
    close : function () {
      this.closeButterflyPaletteViews();
      this.unbind();
      this.remove();
    }
  });

  var ButterflyPaletteView = Backbone.View.extend({
    initialize : function() {
      _.bind(this, 'render');
    },
    render : function () {
      this.$el.html(
        _.template($('#butterfly-palette-template').html(), {
        'id' : this.model.get('id'),
        'colorString' : "colors[]=" + this.model.get('palette').join('&colors[]=')
      }));
      return this;
    },
    close : function () {
      this.$el.unbind();
      this.unbind();
      console.log('closing ButterflyPaletteView');
      // removal handled by PalettePageView
    }
  });

  // this still seems to be leaking memory (DOM elements) on pagination
  // events
  var PaletteView = PageView.extend({
    initialize : function() {
      _.bindAll(this);

    },
    template : _.template($('#palette-template').html()),
    page : 1,
    setPage : function(p) {
      if (p > Math.ceil(butterfliesWithSpotCount.length / pageLength) || p < 1)
        this.page = 1;
      else
        this.page = p;
    },
    updatePagination : function(p) {
      this.setPage(p);
      this.render(false); // don't force total refresh
    },
    setPaginationButtons : function() {
      var getURL = function (delta, curPage) {
        var newPage = parseInt(curPage, 10) + parseInt(delta, 10);
        var curHash = document.location.hash.substr(1);
        var hashArr = curHash.split('/');
        var newURL = hashArr.slice(0, hashArr.length - 1).join('/') + '/' + newPage;
        return newURL;
      }
      var totalPages = Math.ceil(butterfliesWithSpotCount.length / pageLength);
      if(this.page == 1) {
        this.$prevBtn.removeClass('red').addClass('disabled');
      } else {
        this.$prevBtn.removeClass('disabled').addClass('red');
        this.$prevBtn.attr('href', getURL(-1, this.page));
      }
      if(this.page == totalPages) {
        this.$nextBtn.removeClass('yellow').addClass('disabled');
      } else {
        this.$nextBtn.removeClass('disabled').addClass('yellow');
        this.$nextBtn.attr('href', getURL(1, this.page));
      }
    },
    clearPalette : function () {
      if (this._palettePageView) {
        this._palettePageView.close();
        this._palettePageView = null;
      }
    },
    render : function(pageload) {
      if (typeof pageload !== "boolean" || pageload == true) {
        PageView.prototype.render.apply(this);
        this.$prevBtn = $('#palette-prev-button');
        this.$nextBtn = $('#palette-next-button');
      }
      // the router ensures that the butterfly model has the right spot count
      var start = (this.page - 1) * pageLength;
      if(typeof this._palettePageView == "undefined" ||
          this._palettePageView == null) {
        this._palettePageView = new PalettePageView();
        this.childViews.push(this._palettePageView);
      }
      this._palettePageView.setCollection(
        new Butterflies(butterfliesWithSpotCount.slice(start, start + pageLength)));
      this.setPaginationButtons();
      this._palettePageView.render();
    },
    close : function () {
      this.$prevBtn = null;
      this.$nextBtn = null;
      this.clearPalette();
      PageView.prototype.close.apply(this);
    }
  });

  // butterfly page stuff
  var ButterflyPaletteRevealView = ButterflyPaletteView.extend({
    render : function () {
      this.$el.html(
        _.template($('#butterfly-palette-reveal-template').html(), {
        'id' : this.model.get('id'),
        'colorString' : "colors[]=" + this.model.get('palette').join('&colors[]=')
      }));
      return this;
    },
    close : function () {
      ButterflyPaletteView.prototype.close.apply(this);
      console.log('closing reveal view');
    }
  });

  var ButterflyView = PageView.extend({

    initialize : function() {
      _.bindAll(this);
    },
    template : _.template($('#butterfly-template').html()),
    renderWithID : function() {
      PageView.prototype.render.apply(this);
      var that = this;
      // hide all the usual elements
      var $banner = $(".banner");
      // TODO: use IDs, not classes
      var $spacer = $(".spacer");
      var $button = $(".button");
      var $reveal = $('#butterfly-reveal');
      var $species = $('#species-name');
      var $country = $('#country-desc');
      var $butterflyPage = $('.butterfly-page');
      var fadeItems = [$banner, $spacer, $button, $reveal, $species, $country];
      var firstFadeItems = [$banner, $spacer];
      _(fadeItems).each(function(el) {
        $(el).css('opacity', 0);
      })
      // regenerate the palette from the current butterfly id
      var bfly = getButterflyByID(butterfly.get('id'));
      var bflyPaletteView = new ButterflyPaletteRevealView({
        model : bfly
      });
      this.childViews.push(bflyPaletteView);
      $butterflyPage.prepend(bflyPaletteView.render().$el.html());
      _(firstFadeItems).each(function($el) {
        $el.animate({opacity : 1}, paletteSlide);
      });
      // load and flip
      var src = "img/butterflies/" + butterfly.get('id') + ".jpg";
      var iPromise = $.loadImage(src);
      $.when(iPromise, $banner).done(function(i) {
        var $cardReveal = $('#rotating-card a');
        var frameWidth = i.width + 24;
        var frameHeight = i.height + 24;
        $cardReveal.css('visibility', 'visible');
        $cardReveal.css('width', frameWidth);
        $cardReveal.css('height', frameHeight);
        $cardReveal.css('top', 0);
        $cardReveal.css('left', '50%');
        $cardReveal.css('margin-left', (-1 * frameWidth / 2) + 'px');
        var $rotatingCard = $('#rotating-card');
        $('#rotating-card a.back img').attr('src', src)
        $rotatingCard.addClass('flip');
        $rotatingCard.addClass('full-size');
        // listen for end of CSS animation
        var flipCount = 0;
        $('#rotating-card a.back').bind('transitionend', function(e) {
          // depending on the state of things, we're either
          // flipping the card or revealing the species and genus name
          if (e.originalEvent.propertyName = "-webkit-transform" && flipCount < 4) {
            $rotatingCard.toggleClass('flip');
            flipCount++;
            return;
          }

          if (e.originalEvent.propertyName == "width") {
            $('#rotating-card a.back').unbind('transitionend');
            $species.html(butterfly.get('name').toUpperCase());
            $country.html('Native Country: ' + butterfly.get('country'));
            $species.animate({opacity : 1}, revealFade);
            $species.promise().done(function() {
              $country.animate({opacity : 1}, revealFade);
              $country.promise().done(function() {
                $button.animate({opacity : 1}, revealFade);
              });
            });
          }
        });
      });
    },
    render : function () {
      PageView.prototype.render.apply(this);
      var $reveal = $('#butterfly-reveal');
      var $species = $('#species-name');
      var $country = $('#country-desc');
      $species.html(butterfly.get('name').toUpperCase());
      $country.html('Native Country: ' + butterfly.get('country'));
      $reveal.css('visibility', 'hidden');
      var i = new Image();
      $(i).load(function() {
        var frameWidth = i.width + 24;
        var frameHeight = i.height + 24;
        $reveal.fadeOut(0); // TODO: fix this hacky stuff
        $reveal.css('visibility', 'visible');
        $reveal.css('width', frameWidth);
        $reveal.css('height', frameHeight);
        $('#butterfly-reveal').html(i);
        $reveal.fadeIn();
      })
      i.src = "img/butterflies/" + butterfly.get('id') + ".jpg";
    },
    close : function () {
      PageView.prototype.close.apply(this);
      console.log('closing reveal page');
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
    oldView : null,
    showView : function (view, animate, fn) {
      if (typeof animate == "undefined")
        animate = true;
      if (typeof fn == "undefined") {
        fn = "render";
      }
      var $viewEl = this.$el;
      unbindNavLinks($viewEl); // has to be done before close is called
      $viewEl.fadeOut(animate ? viewFade : 0);
      var that = this;
      // TODO: ****** THIS SECTION IS THE PROBLEM ******
      $viewEl.promise().done(function() {
        if (that.oldView) {
          console.log("that.oldView", that.oldView);
          that.oldView.close();
          // that.oldView.remove();
        }
        $viewEl.html(view[fn]).fadeIn(animate ? viewFade : 0);
        // bindNavLinks($viewEl);
      });
      this.oldView = view;
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

    oldRoute : "",

    defaultPage : function () {
      this.defaultTransition('home')
    },

    home : function () {
      if(!butterfly)
        butterfly = new Butterfly();
      this.defaultTransition('home');
    },

    palette : function (spotCount, page) {
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

    butterfly : function (id) {
      butterfly = getButterflyByID(id);
      if (this.oldRoute.indexOf("palette") != -1) {
        // complete animation from palette screen
        app.showView(app.views.butterflyView, false, "renderWithID");
        this.oldRoute = 'butterfly';
      } else {
        this.defaultTransition('butterfly');
      }
    },


    defaultTransition : function (route) {
      app.showView(app.views[this.pageViewMap[route]])
      this.oldRoute = route;
    }
  });

  // kick things off
  var router = new Router();
  Backbone.history.start();

// });
