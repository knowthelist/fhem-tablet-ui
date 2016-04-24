/* FTUI Plugin for ftui version 2.1
* Copyright (c) 2015-2016 Mario Stephan <mstephan@shared-files.de>
* Under MIT License (http://www.opensource.org/licenses/mit-license.php)
*/

/* for readme:
   - if  in nav container then nav trigger "changedSelection"
   - class "default" functionallity
*/
var Modul_link = function () {

    function onClicked(elem) {
      if( elem.isValidData('url') ) {
          document.location.href = elem.data('url');
          var hashUrl=window.location.hash.replace('#','');
          if ( hashUrl && elem.isValidData('load') ) {
              elem.closest('nav').trigger('changedSelection',[elem.text()]);
              var sel = elem.data('load');
              if ( sel ) {
                  $(sel).siblings().removeClass('active');
                  //load page if not done until now
                  if ($(sel+" > *").children().length === 0 || elem.hasClass('nocache'))
                      loadPage(elem);
                  $(sel).addClass('active');
              }
          }
      } else if( elem.isValidData('url-xhr') ) {
          ftui.toast(elem.data('url-xhr'));
          $.get(elem.data('url-xhr'));
      } else if( elem.isValidData('fhem-cmd') ) {
          ftui.toast(elem.data('fhem-cmd'));
          setFhemStatus(elem.data('fhem-cmd'));
      } else if( elem.isValidData('device') ) {
          elem.transmitCommand();
      };

    };

    function loadPage(elem){
        console.time('fetch content');
        var sel = elem.data('load');
        var hashUrl=elem.data('url').replace('#','');
        var lockID = ['ftui','link',hashUrl,sel].join('_');
        if ( localStorage.getItem(lockID) ){
            console.log('---------------link load locked',lockID);
            return;
        }
        localStorage.setItem(lockID,'locked');
        console.log('link loadPage: hashUrl='+hashUrl +" sel="+sel+" > *");
        $(sel).load(hashUrl +" "+sel+" > *",function (data_html) {
            console.timeEnd('fetch content');
            console.log(me.widgetname+': new content from $('+sel+') loaded');
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

    function colorize(elem) {
        var url = window.location.pathname + ((window.location.hash.length)?'#'+ window.location.hash:'');
        var isActive = url.match(new RegExp('^'+elem.data('active-pattern')+'$'));
        var color = isActive ? elem.mappedColor('active-color') : elem.mappedColor('color');
        var backgroundColor = isActive ? elem.mappedColor('active-background-color') : elem.mappedColor('background-color');
        var borderColor = isActive ? elem.mappedColor('active-border-color') : elem.mappedColor('border-color');
        elem.css({
                color: color,
                backgroundColor: backgroundColor,
            });
        if ( borderColor ){
            elem.css({
                borderColor: borderColor,
                borderWidth: '2px',
                borderStyle: 'solid',
             });
        }
        if (isActive)
            elem.addClass('active');
        else
            elem.removeClass('active');
    };

    function init_attr(elem) {
        elem.initData('cmd'                     ,'set');
        elem.initData('color'                   ,getClassColor(elem) || getStyle('.'+this.widgetname,'color')  || '#aa6900');
        elem.initData('background-color'        ,getStyle('.'+this.widgetname,'background-color')    || null);
        elem.initData('icon-left'               ,elem.data('icon') || null);
        elem.initData('icon-right'              ,null);
        elem.initData('width'                   ,'auto');
        elem.initData('height'                  ,'auto');
        elem.initData('text-align'              ,'center');
        elem.initData('border-color'            ,null);
        elem.initData('active-pattern'          ,null);
        elem.initData('active-color'            ,elem.data('color'));
        elem.initData('active-border-color'     ,elem.data('border-color'));
        elem.initData('active-background-color' ,elem.data('background-color'));
    };

    function init_ui(elem) {
        me = this;
        var base = this;
        var leftIcon = elem.data('icon-left');
        var rightIcon = elem.data('icon-right');
        var text = elem.html();
        var iconWidth = 0;

        // prepare container element
        elem.html('')
            .addClass('link')
            .css({
                width: elem.data('width'),
                height: elem.data('height'),
                lineHeight: elem.data('height')*0.9+'px',
                cursor: 'pointer',
        });

        if ( elem.data('width')=='auto' && elem.data('height')=='auto'
                && ( elem.hasClass('round') ||  elem.hasClass('square') )){
            if ( elem.data('border-color') || elem.data('active-border-color') )
                elem.css({ padding: '2px 7px',});
            else
                elem.css({ padding: '3px 7px',});
        }

        // set colors of the container element
        colorize(elem);

        // prepare left icon
        if (leftIcon){
            var elemLeftIcon=jQuery('<div/>', {
                class: 'linklefticon fa '+ leftIcon +' fa-lg fa-fw',
            })
            .prependTo(elem);
            iconWidth = elemLeftIcon.innerWidth();
        };

        // prepare text element
        var elemText = jQuery('<div/>', {
            class: '',
        }).css({
          display: 'inline-block',
          textAlign: elem.data('text-align'),
          verticalAlign: 'middle',
          whiteSpace: 'nowrap',
          padding: '3px',
          lineHeight: '1.05em',
        })
        .html(text)
        .appendTo(elem);

        // prepare right icon
        if (rightIcon){
            var elemRightIcon=jQuery('<div/>', {
                class: 'linkrighticon fa '+ rightIcon +' fa-lg fa-fw',
            })
            .appendTo(elem);
            iconWidth += elemRightIcon.innerWidth();
        };

        // recalculate width of text element
        elemText.css({width: elem.innerWidth()-iconWidth-15 +'px',})

        // event handler
        var clickEventType=((document.ontouchstart!==null)?'mousedown':'touchstart');
        var releaseEventType=((document.ontouchend!==null)?'mouseup':'touchend');
        var leaveEventType=((document.ontouchleave!==null)?'mouseout':'touchleave');
        elem.on(releaseEventType,function() {
            elem.fadeTo( "fast" , 1);
            onClicked(elem);
        });
        elem.on(clickEventType,function() {
            elem.fadeTo( "fast" , 0.5);
        });
        elem.on(leaveEventType,function() {
            elem.fadeTo( "fast" , 1);
        });
        $(window).bind( 'hashchange', function(e) {
            colorize(elem);
        });

        // is-current-link detection
        var url = window.location.pathname + ((window.location.hash.length)?'#'+ window.location.hash:'');
        var isActive = url.match(new RegExp('^'+elem.data('active-pattern')+'$'));
        if ( isActive || ftui.config.filename==='' && elem_url==='index.html') {
           this.elements.each(function(index) {
                   $(this).removeClass('default')
           });
           elem.addClass('default');
        }

        // remove all left locks
        var sel = elem.data('load');
        var hashUrl=elem.data('url').replace('#','');
        var lockID = ['ftui',me.widgetname,hashUrl,sel].join('_');
        localStorage.removeItem(lockID);

        // prefetch page if necessary
        if ( elem.isValidData('load') && elem.isValidData('url')
             && (elem.hasClass('prefetch') || elem.hasClass('default'))) {

            // pre fetch sub pages randomly delayed
            setTimeout(function(){
                loadPage(elem);
            }, (elem.hasClass('default'))?10:5000*Math.random()+500);
        }

        return elem;
    };

    function update(dev,par) {};

    // public
    // inherit all public members from base class
    var me = this;
    return $.extend(new Modul_widget(), {
        //override or own public members
        widgetname: 'link',
        init_attr: init_attr,
        init_ui:init_ui,
        update: update,
    });
};
