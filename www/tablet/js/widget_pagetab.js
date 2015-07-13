if(typeof widget_famultibutton == 'undefined') {
    loadplugin('widget_famultibutton');
}

var widget_pagetab = $.extend({}, widget_famultibutton, {
    widgetname : 'pagetab',
    lastPage : '',
    loadPage: function (goUrl, doPush){
        DEBUG && console.log( 'load page called with : ' + goUrl);
        if ( doPush ) {
          history.pushState( history.state, history.title, '#'+goUrl )
        } else {
          history.replaceState( history.state, history.title, '#'+goUrl )
        }
        // Wrong base_width, base_height seems to trouble gridster, so that elements are wrongly sorted on the page
        // not fadeOut-In
        $('div.gridster').fadeOut('fast');
        $.get(goUrl, function (data_html) {

          $('div.gridster')
              .html($(data_html).closest('div.gridster').html())
              .fadeIn('slow');
            initPage();
            $('div.gridster').fadeIn('slow');
        });
    },
    toggleOn : function(elem) {
        var elem_url=elem.data('url');
        this.lastPage=elem_url;
        DEBUG && console.log( 'change window location : ' + elem_url);
        localStorage.setItem('pagetab_doload', 'initializing');  
        DEBUG && console.log( 'toggle on with : ' + elem_url);
        this.loadPage(elem_url, true);
    },
    toggleOff: function(elem) {
          setTimeout(function() {elem.setOn()}, 50);
    },
    init: function () {
        var base = this;

        DEBUG && console.log( 'init is executed / currently at : ' + window.location);
        this.elements = $('div[data-type="'+this.widgetname+'"]');

        DEBUG && console.log( 'get localStore pagetab_doload (init) to: ' + localStorage.getItem('pagetab_doload'));
        var dl = localStorage.getItem('pagetab_doload');
        if ( ! dl ) {
          if ( window.location.hash ) {
            DEBUG && console.log( 'init set doload : ' + window.location.hash);
            localStorage.setItem('pagetab_doload', window.location.hash.replace('#',''));
          } else {
            DEBUG && console.log( 'init set doload : ' + 'home: ' + this.elements.eq(0).data('url'));
            localStorage.setItem('pagetab_doload', this.elements.eq(0).data('url'));  
          }
           var dl = localStorage.getItem('pagetab_doload');
           DEBUG && console.log( 'init set doload to <initializing> ' );
           localStorage.setItem('pagetab_doload', 'initializing');  
           base.loadPage(dl);
        } else if( ! ( dl == 'initializing' ) ) {
           DEBUG && console.log( 'redirect init : ');
           DEBUG && console.log( 'init set doload to <initializing> ' );
           localStorage.setItem('pagetab_doload', 'initializing');  
           base.loadPage(dl);
        } else {
          DEBUG && console.log( 'normal init : ');

          this.elements.each(function(index) {
              $(this).data('off-color',               $(this).data('off-color')           || getStyle('.'+this.widgetname+'.off','color')              || '#606060');
              $(this).data('off-background-color',    $(this).data('off-background-color')|| getStyle('.'+this.widgetname+'.off','background-color')   || 'transparent');
              $(this).data('on-color',                $(this).data('on-color')            || getStyle('.'+this.widgetname+'.on','color')               || '#222222');
              $(this).data('on-background-color',     $(this).data('on-background-color') || getStyle('.'+this.widgetname+'.on','background-color')    || '#606060');
              $(this).data('background-icon',         $(this).data('background-icon')     || 'fa-circle');
              $(this).data('mode', 'toggle');
              base.init_attr($(this));
              var elem = base.init_ui($(this));

              var elem_url=$(this).data('url');
              var isCurrent=false;

              if ( ! filename ) {
                if (!window.location.hash ) {
                  isCurrent = ( index == 0 );
                } else {
                  isCurrent = (window.location.hash.indexOf(elem_url,1)>-1);
                }
              } else if (elem_url.indexOf(filename)>-1) {
                isCurrent = true;
              } else {
                if (!window.location.hash ) {
                  isCurrent = ( index == 0 );
                } else {
                  isCurrent = (window.location.hash.indexOf(elem_url,1)>-1);
                }
              }

              $(this).attr('title',$(this).data('url'));

              if (isCurrent){
                  elem.setOn();
                  elem.data('on-colors',[elem.data('on-color')]);
                  elem.data('on-background-colors',[elem.data('on-background-color')]);
              }
              else{
                  elem.setOff();
                  elem.data('on-colors',[elem.data('off-color')]);
                  elem.data('on-background-colors',[elem.data('off-background-color')]);
              }

              window.onpopstate = function(event) {
                  localStorage.setItem('pagetab_doload', 'initializing');  
                  var hashUrl=window.location.hash.replace('#','');
                  if ( hashUrl ) {
                     base.loadPage(hashUrl);
                  } else {
                     base.loadPage(base.elements.eq(0).data('url') );
                  }
              };

          });

          localStorage.removeItem('pagetab_doload');  
        
        }
        
    },
    update: function (dev,par) {
      var deviceElements= this.elements.filter('div[data-device="'+dev+'"]');
      var base = this;
      deviceElements.each(function(index) {
          if ( $(this).data('get')==par) {
              var state = getDeviceValue( $(this), 'get' );
              if (state) {
                  var states=$(this).data('get-on');
                  if ( $.isArray(states)) {
                      base.showMultiStates($(this),states,state);
                  }
              }
              if ($(this).hasClass('warn') || $(this).children().filter('#fg').hasClass('warn'))
                  base.showOverlay($(this),state);
              else
                  base.showOverlay($(this),"");

              var id=dev+"_"+$(this).data('url');

              if ($(this).children().filter('#fg').hasClass('activate')){
                  //only for the first occurance (Flipflop logic)
                  if ( localStorage.getItem(id)!='true' ){
                      localStorage.setItem(id, 'true');
                      base.toggleOn($(this));
                  }
              }
              else{
                  localStorage.setItem(id, 'false');
              }

          }
      });
    },
});
