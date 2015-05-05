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
        this.lastPage=elem_url;
        window.location.hash = elem_url;
        this.loadPage(elem_url);
    },
    toggleOff: function(elem) {
          setTimeout(function() {elem.setOn()}, 50);
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

            if (isCurrent){
                elem.setOn();
                elem.data('on-colors',[elem.data('on-color')]);
            }
            else{
                elem.setOff();
                elem.data('on-colors',[elem.data('off-color')]);
            }

            window.onpopstate = function(event) {
                var hashUrl=window.location.hash.replace('#','');
                if (base.lastPage!=hashUrl){
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
