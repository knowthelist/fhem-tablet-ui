/* FTUI Plugin
* Copyright (c) 2015 Mario Stephan <mstephan@shared-files.de>
* Under MIT License (http://www.opensource.org/licenses/mit-license.php)
*/

if(typeof widget_widget == 'undefined') {
    loadplugin('widget_widget');
}

var widget_link= $.extend({}, widget_widget, {
    widgetname : 'link',
    onClicked: function(elem) {
      if( elem.isValidData('url') ) {
          document.location.href = elem.data('url');
      } else if( elem.isValidData('url-xhr') ) {
          TOAST && $.toast(elem.data('url-xhr'));
          $.get(elem.data('url-xhr'));
      } else if( elem.isValidData('fhem-cmd') ) {
          TOAST && $.toast(elem.data('fhem-cmd'));
          setFhemStatus(elem.data('fhem-cmd'));
      };
    },
    colorize: function(elem) {
        var url = window.location.pathname + window.location.hash;
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
    },
    init_attr : function(elem) {
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
    },
    init_ui : function(elem) {
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
        base.colorize(elem);

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
            base.onClicked(elem);
        });
        elem.on(clickEventType,function() {
            elem.fadeTo( "fast" , 0.5);
        });
        elem.on(leaveEventType,function() {
            elem.fadeTo( "fast" , 1);
        });
        $(window).bind( 'hashchange', function(e) {
            base.colorize(elem);
        });

        return elem;
    },
    init: function () {
        var base = this;
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            base.init_attr($(this));
            base.init_ui($(this));
        });
    },
    update: function (dev,par) {}
});
