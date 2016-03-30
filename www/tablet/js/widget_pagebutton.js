var Modul_pagebutton = function () {

    if(typeof Module_famultibutton == 'undefined')
        loadplugin('widget_famultibutton');

    function loadPage(elem){
        console.time('fetch content');
        var sel = elem.data('load');
        var hashUrl=elem.data('url').replace('#','');
        $(sel).load(hashUrl +" "+sel+" > *",function (data_html) {
            console.timeEnd('fetch content');
            console.log(this.widgetname+': new content from $('+sel+') loaded');
            ftui.initPage(sel);
            if (elem.hasClass('default')){
                $(sel).addClass('active');
                elem.closest('nav').trigger('changedSelection');
            }
        });
    };

   function init() {
       var me = this;
       this.elements = $('div[data-type="'+this.widgetname+'"]',this.area);
       this.elements.each(function(index) {
           var elem = $(this);
           elem.initData('off-color'               ,getStyle('.button.off','color') || '#2A2A2A');
           elem.initData('off-background-color'    ,getStyle('.button.off','background-color')   || '#505050');
           elem.initData('on-color'                ,getClassColor($(this)) || getStyle('.button.on','color')               || '#2A2A2A');
           elem.initData('on-background-color'     ,getStyle('.button.on','background-color')    || '#aa6900');
           elem.initData('background-icon'         ,'fa-circle');
           elem.initData('active-pattern'          ,'.*/'+$(this).data('url'));
           elem.initData('get-warn'                ,-1);
           elem.initData('blink'                   ,'off');

           me.init_attr(elem);
           me.init_ui(elem);
           var elem_url=elem.data('url');

           elem.bind("toggleOn", function( event ){
              // only set this button to active just before switching page
              me.elements.each(function(index) {
                     $(this).data('famultibutton').setOff();
               });
               elem.data('famultibutton').setOn();
               var sel = elem.data('load');
               if ( sel ) {
                   elem.closest('nav').trigger('changedSelection');
                   $(sel).siblings().removeClass('active');
                   //load page if not done until now
                   if ($(sel+" > *").children().length === 0 || elem.hasClass('nocache'))
                       loadPage(elem);
                   $(sel).addClass('active');
               }
           });

           // is-current-button detection
           var url = window.location.pathname + ((window.location.hash.length)?'#'+ window.location.hash:'');
           var isActive = url.match(new RegExp('^'+elem.data('active-pattern')+'$'));
           if ( isActive || ftui.config.filename==='' && elem_url==='index.html') {
              me.elements.each(function(index) {
                      $(this).removeClass('default')
              });
              elem.setOn();
              elem.addClass('default');
           }

           // multi state support
           var states=elem.data('states') || elem.data('get-on');
           if ( $.isArray(states)) {
               var idx=indexOfGeneric(states,url);
               me.showMultiStates(elem,states,url,idx);
           }

           // activate element
           $(window).bind( 'hashchange', function(e) {
               var url = window.location.pathname + ((window.location.hash.length)?'#'+ window.location.hash:'');
               var isActive = url.match(new RegExp('^'+elem.data('active-pattern')+'$'));
               var faelem = elem.data('famultibutton');
               if (faelem){
                   if (isActive)
                     faelem.setOn();
                   else
                     faelem.setOff();
               }
           });

           //prefetch page if necessary
           if ( elem.isValidData('load') && elem.isValidData('url')
                && (elem.hasClass('prefetch') || elem.hasClass('default'))) {

               // pre fetch sub pages randomly delayed
               setTimeout(function(){
                   loadPage(elem);
               }, (elem.hasClass('default'))?10:5000*Math.random()+500);
           }

           $(this).attr('title',$(this).data('url'));
       });
   }

   function update_cb(elem,state) {
       if (elem.hasClass('warn') || elem.children().filter('#fg').hasClass('warn'))
           this.showOverlay(elem,getPart(state,elem.data('get-warn')));
       else
           this.showOverlay(elem,"");
   }

    // public
    // inherit all public members from base class
    return $.extend(new Modul_famultibutton(), {
        //override or own public members
        widgetname: 'pagebutton',
        update_cb:update_cb,
        init:init,
    });
};
