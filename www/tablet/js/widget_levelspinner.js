/* FTUI Plugin
* Copyright (c) 2015 Mario Stephan <mstephan@shared-files.de>
* Under MIT License (http://www.opensource.org/licenses/mit-license.php)
*/

if(typeof widget_widget == 'undefined') {
    loadplugin('widget_widget');
}

var widget_levelspinner= $.extend({}, widget_widget, {
    widgetname : 'levelspinner',
    drawLevel: function(elem) {
        var max         = parseFloat(( $.isNumeric(elem.data('max')) ) ? elem.data('max') : elem.getReading('max').val);
        var min         = parseFloat(( $.isNumeric(elem.data('min')) ) ? elem.data('min') : elem.getReading('min').val);
        var width       = parseFloat(elem.data('width'))/2;
        var value       = parseFloat(elem.data('value'));
        var position    = width * (value-min) / (max-min);
        var levelRange = elem.find('.levelRange');
        if (levelRange ) {
          levelRange.css({
              width: position + 'px',
          });
        }
    },
    onClicked: function(elem,factor) {
        var base    = this;
        var step    = parseFloat(elem.data('step'));
        var min     = parseFloat(elem.data('min'));
        var max     = parseFloat(elem.data('max'));
        var value   = parseFloat(elem.data('value'));
        clearTimeout(elem.delayTimer);
        changeValue = function() {
            value = value + factor * step;
            if ( value < min ) value = min;
            if ( value > max ) value = max;
            elem.data('value',value);
            console.log('change value',value);
            base.drawLevel(elem);
        };
        changeValue(); // short press
        elem.delayTimer = setTimeout(function () {
            elem.repeatTimer = setInterval(function () {
                changeValue(); // long press
            }, 100);
        }, 600);
    },
    onReleased: function(elem) {
        clearTimeout(elem.repeatTimer);
        clearTimeout(elem.delayTimer);
            var base = this;
            elem.delayTimer = setTimeout(function () {
                var cmdl = [elem.data('cmd'),elem.data('device'),elem.data('set'),elem.data('value')].join(' ');
                setFhemStatus(cmdl);
                TOAST && $.toast(cmdl);
            }, 600);
    },
    init_attr : function(elem) {
        elem.initData('get'                     ,'STATE');
        elem.initData('set'                     ,'');
        elem.initData('cmd'                     ,'set');
        elem.initData('color'                   ,getClassColor(elem) || getStyle('.'+this.widgetname,'color')  || '#aaaaaa');
        elem.initData('background-color'        ,getStyle('.'+this.widgetname,'background-color')    || '#505050');
        elem.initData('icon-left'               ,elem.data('icon') || null);
        elem.initData('icon-right'              ,null);
        elem.initData('width'                   ,'200');
        elem.initData('height'                  ,'50');
        elem.initData('value'                   ,'0');
        elem.initData('min'                     ,'0');
        elem.initData('max'                     ,'100');
        elem.initData('step'                    ,'0.5');
        elem.initData('text-align'              ,'center');
        elem.initData('border-color'            ,null);
        elem.initData('get-value'               ,elem.data('part') || -1);

        elem.addReading('get');
        if ( elem.isDeviceReading('min') ) {elem.addReading('min');}
        if ( elem.isDeviceReading('max') ) {elem.addReading('max');}
    },
    init_ui : function(elem) {
        var base = this;
        var leftIcon = elem.data('icon-left');
        var rightIcon = elem.data('icon-right');
        var text = 'hust';
        var iconWidth = 0;

        // prepare container element
        elem.html('')
            .addClass('levelspinner')
            .css({
                width: elem.data('width'),
                height: elem.data('height'),
                lineHeight: elem.data('height')*0.9+'px',
                color: elem.data('color'),
                backgroundColor: elem.data('background-color'),
        });

        if ( elem.data('width')=='auto' && elem.data('height')=='auto'
                && ( elem.hasClass('round') ||  elem.hasClass('square') )){
            if ( elem.data('border-color') || elem.data('active-border-color') )
                elem.css({ padding: '2px 7px',});
            else
                elem.css({ padding: '3px 7px',});
        }

        // prepare left icon
        var elemLeftIcon=jQuery('<div/>', {
            class: 'lefticon',
        }).css({
                   display: 'inline-block',
                   textAlign: elem.data('text-align'),
                   verticalAlign: 'middle',
                   whiteSpace: 'nowrap',
                   paddingBottom: '10px',
                   lineHeight: '1.05em',
                   fontSize: '40px',
                   cursor: 'pointer',
                 })
        .html('-')
        .prependTo(elem);
        iconWidth = elemLeftIcon.innerWidth();


        // prepare level element
        var levelArea = jQuery('<div/>', {
            class: 'levelArea',
        }).css({
          display: 'inline-block',
          textAlign: elem.data('text-align'),
          verticalAlign: 'middle',
          whiteSpace: 'nowrap',
          margingLeft: '9px',
          lineHeight: '1.05em',
                   width: '50%',
        })
        .appendTo(elem);

        //levelRange
        jQuery('<div/>', {
            class: 'levelRange',
        }).appendTo(levelArea)
          .css({

            });

        // prepare right icon
        var elemRightIcon=jQuery('<div/>', {
            class: 'righticon',
        }).css({
                   display: 'inline-block',
                   textAlign: elem.data('text-align'),
                   verticalAlign: 'middle',
                   whiteSpace: 'nowrap',
                   paddingBottom: '10px',
                   lineHeight: '1.05em',
                   fontSize: '40px',
                   cursor: 'pointer',
                 })
        .html('+')
        .appendTo(elem);
        iconWidth += elemRightIcon.innerWidth();

        // event handler
        var clickEventType=((document.ontouchstart!==null)?'mousedown':'touchstart');
        var releaseEventType=((document.ontouchend!==null)?'mouseup':'touchend');
        var leaveEventType=((document.ontouchleave!==null)?'mouseout':'touchleave');
        // UP button
        elemRightIcon.on(clickEventType,function() {
            elemRightIcon.fadeTo( "fast" , 0.5);
            base.onClicked.call(base,elem,1);
        });
        elemRightIcon.on(releaseEventType + ' ' + leaveEventType,function() {
            elemRightIcon.fadeTo( "fast" , 1);
            base.onReleased.call(base,elem);
        });

        // DOWN button
        elemLeftIcon.on(clickEventType,function() {
            elemLeftIcon.fadeTo( "fast" , 0.5);
            base.onClicked.call(base,elem,-1);
        });
        elemLeftIcon.on(releaseEventType + ' ' + leaveEventType,function() {
            elemLeftIcon.fadeTo( "fast" , 1);
            base.onReleased.call(base,elem);
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
    update: function (dev,par) {
        var base = this;
        // update from normal state reading
        this.elements.filterDeviceReading('get',dev,par)
        .each(function(index) {
            var elem = $(this);
            var state = elem.getReading('get').val;
            if (state) {
                elem.data('value',parseFloat(getPart(state, elem.data('get-value'))));
                base.drawLevel(elem);
            }
         });
    },
});
