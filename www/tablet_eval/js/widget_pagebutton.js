
function depends_pagebutton(){
    if(typeof Module_famultibutton == 'undefined')
        return ["famultibutton"];
};

var Modul_pagebutton = function () {

    function loadPage(elem){
	   $(document).trigger("loadPage");
       console.time('fetch content');
       var sel = elem.data('load');
       var hashUrl=elem.data('url').replace('#','');
       var lockID = ['ftui',me.widgetname,hashUrl,sel].join('_');
       if ( localStorage.getItem(lockID) ){
           console.log('---------------pagebutton load locked',lockID);
           return;
       }
       localStorage.setItem(lockID,'locked');
       $(sel).load(hashUrl +" "+sel+" > *",function (data_html) {
           console.timeEnd('fetch content');
           console.log(me.widgetname+': new content from $("'+sel+'") loaded');
           ftui.initPage(sel);
           if (elem.hasClass('default')){
               $(sel).addClass('active');
               elem.closest('nav').trigger('changedSelection');
           }
           $(document).on("initWidgetsDone",function(){
               localStorage.removeItem(lockID);
           });
       });
    };

    function startReturnTimer (elem){
      var waitUntilReturn = elem.data('return-time');
      var lastUrl = localStorage.getItem('pagebutton_lastUrl');
      var returnTimer = localStorage.getItem('pagebutton_returnTimer');
      clearTimeout(returnTimer);
      if ( waitUntilReturn > 0 && lastUrl !== elem.data('url') ){
          ftui.log(1,'Reload main page in : ' + waitUntilReturn + ' seconds');
          returnTimer = setTimeout(function () {
             // back to first page
             localStorage.setItem('pagebutton_doload', 'initializing');
             me.toggleOn(elem);
          }, waitUntilReturn * 1000);
          localStorage.setItem('pagebutton_returnTimer',returnTimer);
      }
    };

    function changeState(elem,isOn){
       if (isOn){
          elem.data('famultibutton').setOn();
          // overwrite default colors for showMultiStates
          elem.data('on-colors',[elem.data('on-color')]);
          elem.data('on-background-colors',[elem.data('on-background-color')]);
       }
       else{
          elem.data('famultibutton').setOff();
          // overwrite default colors for showMultiStates
          elem.data('on-colors',[elem.data('off-color')]);
          elem.data('on-background-colors',[elem.data('off-background-color')]);
       }
    };

   function init() {
       me = this;
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
           elem.initData('return-time'             , 0);

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
                       loadPage.call(me,elem);
                   $(sel).addClass('active');
               }
           });

          // is-current-button detection
          var url = window.location.pathname + ((window.location.hash.length)?'#'+ window.location.hash:'');
          var isActive = url.match(new RegExp('^'+elem.data('active-pattern')+'$'));
          if ( isActive || ftui.config.filename==='' && elem_url==='index.html') {
             elem.siblings().removeClass('default');
             elem.addClass('default');
           }
           changeState(elem,isActive);

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
               changeState(elem,isActive);
           });

           // remove all left locks
           var sel = elem.data('load');
           var hashUrl=elem.data('url').replace('#','');
           var lockID = ['ftui',me.widgetname,hashUrl,sel].join('_');
           localStorage.removeItem(lockID);

           //prefetch page if necessary
           if ( elem.isValidData('load') && elem.isValidData('url')
                && (elem.hasClass('prefetch') || elem.hasClass('default'))) {

               // pre fetch sub pages randomly delayed
               setTimeout(function(){
                   loadPage.call(me,elem);
               }, (elem.hasClass('default'))?10:5000*Math.random()+500);
           }

           // start return timer after last activity
           if ( me.elements.eq(0).data('return-time') > 0 ){
               var releaseEventType=((document.ontouchend!==null)?'mouseup':'touchend');
                $('body').once(releaseEventType, function() {
                       startReturnTimer(me.elements.eq(0));
               });
           }

           $(this).attr('title',$(this).data('url'));
       });
   }

   function toggleOff (elem) {
          setTimeout(function() {elem.setOn()}, 50);
   };

   function update_cb(elem,state) {
       if (elem.hasClass('warn') || elem.children().filter('#fg').hasClass('warn'))
           this.showOverlay(elem,getPart(state,elem.data('get-warn')));
       else
           this.showOverlay(elem,"");

       var id = elem.data('device') + "_" + elem.data('get') + "_" + elem.data('url');

       if (elem.children().filter('#fg').hasClass('activate')){
           //only for the first occurance (Flipflop logic)
           if ( localStorage.getItem(id)!=='true' ){
               localStorage.setItem(id, 'true');
               me.toggleOn(elem);
           }
       } else{
           localStorage.setItem(id, 'false');
       }
   };

    // public
    // inherit all public members from base class
    var me = this;
    return $.extend(new Modul_famultibutton(), {
        //override or own public members
        widgetname: 'pagebutton',
        update_cb:update_cb,
        toggleOff:toggleOff,
        init:init,
    });
};
