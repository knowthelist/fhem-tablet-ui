if(typeof widget_famultibutton == 'undefined') {
    loadplugin('widget_famultibutton');
}

var widget_pagetab = $.extend({}, widget_famultibutton, {
    widgetname : 'pagetab',
    startReturnTimer: function (){
      var mainElem = this.elements.eq(0);
      var waitUntilReturn = mainElem.data('return-time');
      var lastUrl = localStorage.getItem('pagetab_lastUrl');
      var returnTimer = localStorage.getItem('pagetab_returnTimer');
      clearTimeout(returnTimer);
      if ( waitUntilReturn > 0 && lastUrl !== mainElem.data('url') ){
          var base = this;
          DEBUG && console.log( 'Reload main tab in : ' + waitUntilReturn + ' seconds');
          returnTimer = setTimeout(function () {
             // back to first page
             localStorage.setItem('pagetab_doload', 'initializing');
             base.loadPage(mainElem.data('url'),true);
          }, waitUntilReturn * 1000);
          localStorage.setItem('pagetab_returnTimer',returnTimer);
      }
    },
    loadPage: function (goUrl, doPush){
        // set return timer
        localStorage.setItem('pagetab_lastUrl',goUrl);
        this.startReturnTimer();

        DEBUG && console.log( 'load page called with : ' + goUrl);
        if ( doPush ) {
          history.pushState( history.state, history.title, '#'+goUrl )
        } else {
          history.replaceState( history.state, history.title, '#'+goUrl )
        }
        $('div.gridster').fadeTo(200,0);
        $.get(goUrl, function (data_html) {

          $('div.gridster')
              .html($(data_html).closest('div.gridster').html())
              .fadeTo(600,1);
            initPage();
            $('div.gridster').fadeTo(600,1);
        });
    },
    toggleOn : function(elem) {
        var elem_url=elem.data('url');
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
           this.loadPage(dl);
        } else if( ! ( dl == 'initializing' ) ) {
           DEBUG && console.log( 'redirect init : ');
           DEBUG && console.log( 'init set doload to <initializing> ' );
           localStorage.setItem('pagetab_doload', 'initializing');
           this.loadPage(dl);
        } else {
          DEBUG && console.log( 'normal init : ');

          this.elements.each(function(index) {
              var elem = $(this);
              elem.initData('off-color'             , getStyle('.'+base.widgetname+'.off','color')   || '#606060');
              elem.initData('off-background-color'  , getStyle('.'+base.widgetname+'.off','background-color')   || 'transparent');
              elem.initData('on-color'              , getStyle('.'+base.widgetname+'.on','color')               || '#222222');
              elem.initData('on-background-color'   , getStyle('.'+base.widgetname+'.on','background-color')    || '#606060');
              elem.initData('background-icon'       , 'fa-circle');
              elem.initData('mode'                  , 'toggle');
              elem.initData('return-time'           , 0);
              base.init_attr(elem);

              elem = base.init_ui(elem);

              var elem_url=elem.data('url');
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

              elem.attr('title',elem.data('url'));

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
          });

            $(window).once('popstate', function(event) {
                localStorage.setItem('pagetab_doload', 'initializing');
                var hashUrl=window.location.hash.replace('#','');
                if ( hashUrl ) {
                   base.loadPage(hashUrl);
                } else {
                   base.loadPage(base.elements.eq(0).data('url') );
                }
           });

           // start return timer after last activity
           if ( this.elements.eq(0).data('return-time') > 0 ){
               var releaseEventType=((document.ontouchend!==null)?'mouseup':'touchend');
                $('body').once(releaseEventType, function() {
                       base.startReturnTimer();
               });
           }

          localStorage.removeItem('pagetab_doload');         
        }
    },
    update: function (dev,par) {
        var base = this;
        // update from normal state reading
        this.elements.filterDeviceReading('get',dev,par)
        .each(function(index) {
            var elem = $(this);
            var state = elem.getReading('get').val;
              if (state) {
                  var states=elem.data('states') || elem.data('get-on');
                  if ( $.isArray(states)) {
                      base.showMultiStates(elem,states,state,-1);
                  }
              }
              if (elem.hasClass('warn') || elem.children().filter('#fg').hasClass('warn'))
                  base.showOverlay(elem,state);
              else
                  base.showOverlay(elem,"");

              var id=dev+"_"+elem.data('url');

              if (elem.children().filter('#fg').hasClass('activate')){
                  //only for the first occurance (Flipflop logic)
                  if ( localStorage.getItem(id)!='true' ){
                      localStorage.setItem(id, 'true');
                      base.toggleOn(elem);
                  }
              }
              else{
                  localStorage.setItem(id, 'false');
              }
      });
    },
});
