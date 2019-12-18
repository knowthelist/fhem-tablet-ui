/* FTUI Plugin
 * Copyright (c) 2015-2016 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_widget:true */

'use strict';

var Modul_image = function () {

  function update_classes(state, elem) {
    // set colors according matches for values
    var states = elem.data('states');
    var classes = elem.data('classes');
    if (states && classes) {
      var idx = ftui.indexOfGeneric(states, state);
      var elemImg = elem.find('img');
      if (idx > -1) {
        for (var i = 0, len = classes.length; i < len; i++) {
          elemImg.removeClass(classes[i]);
        }
        elemImg.addClass(classes[idx]);
      }
    }
  }


  function addurlparam(uri, key, value) {
    // http://stackoverflow.com/a/6021027
    var hash = uri.replace(/^.*#/, '#');
    if (hash != uri) {
      uri = uri.replace(hash, '');
    } else {
      hash = '';
    }
    var re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
    var separator = uri.indexOf('?') !== -1 ? '&' : '?';

    if (uri.match(re)) {
      uri = uri.replace(re, '$1' + key + '=' + value + '$2');
    } else {
      uri = uri + separator + key + '=' + value;
    }
    uri += hash;
    ftui.log(1, 'widget_image url=' + uri);
    return uri;
  }

  function init_attr(elem) {
    elem.initData('state-get', '');
    elem.initData('opacity', 0.8);
    elem.initData('height', 'auto');
    elem.initData('width', '100%');
    elem.initData('size', '100%');
    elem.initData('part', -1);
    elem.initData('url', '');
    elem.initData('get', (elem.data('url') === '') ? 'STATE' : '');
    elem.initData('path', '');
    elem.initData('suffix', '');
    elem.initData('substitution', '');
    elem.initData('refresh', 15 * 60);

    // if hide reading is defined, set defaults for comparison
    if (elem.isValidData('hide')) {
      elem.initData('hide-on', 'true|1|on');
    }
    elem.initData('hide', elem.data('get'));
    if (elem.isValidData('hide-on')) {
      elem.initData('hide-off', '!on');
    }
    me.addReading(elem, 'hide');
    me.addReading(elem, 'get');
    me.addReading(elem, 'state-get');
    me.addReading(elem, 'refresh-get');
  }

  function init() {
    me.elements = $('div[data-type="' + me.widgetname + '"]:not([data-ready])', me.area);
    me.elements.each(function () {
      var elem = $(this);
      elem.attr('data-ready', '');

      me.init_attr(elem);
      $('img', elem).remove();
      var elemImg = $('<img/>', {
        alt: 'img',
      }).appendTo(elem);
      elemImg.css({
        'opacity': elem.data('opacity'),
        'height': elem.data('height'),
        'width': elem.data('width'),
        'max-width': elem.data('size'),
      });


      // 3rd party source refresh
      if (elem.data('url')) {
        var url = elem.data('url');
        if (elem.data('nocache') || elem.hasClass('nocache')) {
          url = addurlparam(url, '_', new Date().getTime());
        }
        elemImg.attr('src', url);

        var counter = 0;
        setInterval(function () {
          var isVisible = (elem[0].offsetParent !== null);
          var refresh = elem.data('refresh');
          counter++;
          if (counter >= refresh) {
            counter = 0;
            if (isVisible) {
              if (url.match(/_=\d+/)) {
                url = addurlparam(url, '_', new Date().getTime());
              }
              ftui.log(2, 'Update image widget source. URL=' + url);
              elemImg.attr('src', url);
            }
          }
        }, 1000);
      }
      // onClick events
      elem.on('click', function () {
        var cmd = elem.data('fhem-cmd');
        if (cmd)
          ftui.setFhemStatus(cmd);
      });
    });
  }

  function update(dev, par) {

    me.elements.filterDeviceReading('get', dev, par)
      .each(function () {
        var elem = $(this);
        var value = elem.getReading('get').val;
        value = ftui.getPart(value, elem.data('part'));
        value = me.substitution(value, elem.data('substitution'));
        if (value) {
          var src = [elem.data('path'), value, elem.data('suffix')].join('');
          elem.find('img').attr('src', src);
        }
      });

    me.elements.filterDeviceReading('refresh-get', dev, par)
      .each(function () {
        var elem = $(this);
        var value = elem.getReading('refresh-get').val;
        if (value) {
          console.log(value)
          elem.data('refresh', value);
        }
      });

    // extra reading for extra classes
    me.elements.filterDeviceReading('state-get', dev, par)
      .each(function () {
        var elem = $(this);
        var state = elem.getReading('state-get').val;
        if (state) {
          var part = elem.data('part');
          var val = ftui.getPart(state, part);
          update_classes(val, elem);
        }
      });

    // extra reading for hide
    me.update_hide(dev, par);
  }

  // public
  // inherit all public members from base class
  var me = $.extend(new Modul_widget(), {
    // override or own public members
    widgetname: 'image',
    addurlparam: addurlparam,
    init: init,
    init_attr: init_attr,
    update: update,
  });

  return me;
};
