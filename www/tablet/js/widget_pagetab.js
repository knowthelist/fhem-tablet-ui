if(typeof widget_famultibutton == 'undefined') {
    loadplugin('widget_famultibutton');
}

var widget_pagetab = $.extend({}, widget_famultibutton, {
    widgetname : 'pagetab',
    lastPage : '',
    loadPage: function (goUrl){
        $("div.gridster").fadeOut('fast');
        $.get(goUrl, function (data_html) {
            $("div.gridster")
              .html($(data_html).closest('div.gridster').html())
              .fadeIn('slow');
            initPage();
        });
    },
    toggleOn : function(elem) {
        var elem_url=elem.data('url');
        lastPage=elem_url;
        window.location.hash = elem_url;
        this.loadPage(elem_url);
    },
    toggleOff: function(elem) {
          setInterval(function() {elem.setOn()}, 50);
    },
    init: function () {
        var base = this;
        this.elements = $('div[data-type="'+this.widgetname+'"]');
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
            if (elem_url.indexOf(filename)>-1 && !window.location.hash
                    || window.location.hash.indexOf(elem_url,1)>-1){
                isCurrent=true;
            }
            $(this).attr('title',$(this).data('url'));

            if (isCurrent)
                elem.setOn();
            else
                elem.setOff();

            window.onpopstate = function(event) {
                var hashUrl=window.location.hash.replace('#','');
                if (lastPage!=hashUrl){
                        base.loadPage(hashUrl);
                }
            };
        });
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
                      var icons=$(this).data('icons');
                      var colors=$(this).data('on-colors');
                      if (icons && colors && states && icons.length == colors.length && icons.length == states.length ) {
                          var elm=$(this).children().filter('#fg');
                          var idx=indexOfGeneric(states,state);
                          if (idx>-1){
                              elm.removeClass()
                              .addClass('fa fa-stack-1x')
                              .addClass(icons[idx])
                              .css( "color", colors[idx] );
                          }
                      }
                  }
              }
              if ($(this).hasClass('warn') || $(this).children().filter('#fg').hasClass('warn'))
                  base.showOverlay($(this),state);
              else
                  base.showOverlay($(this),"");
          }
      });
    },
});
