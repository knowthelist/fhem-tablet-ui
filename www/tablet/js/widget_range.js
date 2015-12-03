/* FTUI Plugin
* Copyright (c) 2015 Mario Stephan <mstephan@shared-files.de>
* Under MIT License (http://www.opensource.org/licenses/mit-license.php)
*/

if(typeof widget_widget == 'undefined') {
    loadplugin('widget_widget');
}

$('head').append('<link rel="stylesheet" href="'+ dir + '/../css/ftui_range.css" type="text/css" />');


var widget_range= $.extend({}, widget_widget, {
    widgetname : 'range',
    init_attr : function(elem) {
        elem.initData('high'        ,'STATE');
        elem.initData('low'         ,'');
        elem.initData('width'       ,8);
        elem.initData('height'      ,220);
        elem.initData('max'         ,30);
        elem.initData('min'         ,-10);
        elem.initData('limit-low'   ,0);
        elem.initData('limit-high'  ,20);
        elem.initData('color'       ,getClassColor(elem) || getStyle('.'+this.widgetname+'.range','color')  || '#aa6900');
        elem.initData('color-low'   ,getStyle('.'+this.widgetname+'.low','color')    || '#337ab7');
        elem.initData('color-high'  ,getStyle('.'+this.widgetname+'.high','color')   || '#ad3333');

        elem.addReading('low');
        elem.addReading('high');
    },
    init_ui : function(elem) {
        var base = this;
        var levelArea =  jQuery('<div/>', {
            class: 'levelArea',
        })
        .css({
            width: elem.data('width'),
            height: elem.data('height'),
            });

        //levelRange
        jQuery('<div/>', {
            class: 'levelRange',
        }).appendTo(levelArea)
          .css({
            width: elem.data('width'),
            });

        //Labels
        if (!elem.hasClass('nolabels')){
            jQuery('<div/>', {
                class: 'labelMax',
            }).appendTo(levelArea)
              .text(elem.data('max')+'-');

            jQuery('<div/>', {
                class: 'labelLimitMax',
            }).appendTo(levelArea)
            .text(elem.data('limit-high')+'-');

            jQuery('<div/>', {
                class: 'labelLimitMin',
            }).appendTo(levelArea)
              .text(elem.data('limit-low')+'-');

            jQuery('<div/>', {
                class: 'labelMin',
            }).appendTo(levelArea)
              .text(elem.data('min')+'-');
        }

        elem.append(levelArea);
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
        this.elements.filterDeviceReading('high',dev,par)
        .add( this.elements.filterDeviceReading('low',dev,par) )
        .each(function(index) {
            var elem = $(this);
            var value_high  = parseFloat(elem.getReading('high').val);
            var value_low   = parseFloat(elem.getReading('low').val);
            var height      = parseFloat(elem.data('height'));
            var min         = parseFloat(elem.data('min'));
            var max         = parseFloat(elem.data('max'));
            var limit_low   = parseFloat(elem.data('limit-low'));
            var limit_high  = parseFloat(elem.data('limit-high'));

            if (isNaN(value_high)) value_high = max;
            if (isNaN(value_low))  value_low = min;
            if ( !(isNaN(value_high) || isNaN(value_low)) ) {

                var levelRange = elem.find('.levelRange');
                if (levelRange ) {

                  var top           = height * (value_high-min) / (max-min);
                  var bottom        = height * (value_low-min) / (max-min);
                  var limit_top     = 100 - 100 * (limit_high-value_low) / (value_high-value_low);
                  var limit_bottom  = 100 - 100 * (limit_low-value_low) / (value_high-value_low);
                  var llimit_top    = height * (limit_high-min) / (max-min);
                  var llimit_bottom = height * (limit_low-min) / (max-min);

                  if ( top > height) top = height;
                  if ( bottom < 0) bottom = 0;
                  if ( limit_top < 0) limit_top = 0;
                  if ( limit_bottom > height) limit_bottom = height;

                  var colorHigh = elem.mappedColor('color-high');
                  var color     = elem.mappedColor('color');
                  var colorLow  = elem.mappedColor('color-low');

                  var gradient = colorHigh  +' '+ limit_top    +'%,'+
                                 color      +' '+ limit_top    +'%,'+
                                 color      +' '+ limit_bottom +'%,'+
                                 colorLow   +' '+ limit_bottom +'%)';
                  levelRange.css({
                      top:        height - top + 'px',
                      bottom:     bottom + 'px',
                  });

                  levelRange.css({ background: '-webkit-linear-gradient(top, '+gradient,}); /* Chrome10-25,Safari5.1-6 */
                  levelRange.css({ background: 'linear-gradient(to bottom, '+gradient,}); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */

                  if ( limit_high == max )
                      elem.find('.labelLimitMax').hide();
                  else
                      elem.find('.labelLimitMax').css({bottom: llimit_top-6 + 'px'}).show();
                  if ( limit_low == min )
                      elem.find('.labelLimitMin').hide();
                  else
                      elem.find('.labelLimitMin').css({bottom: llimit_bottom-6 + 'px'}).show();
                }
            }
        });
    }
});
