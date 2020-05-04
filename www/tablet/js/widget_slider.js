/* FTUI Plugin
 * Copyright (c) 2015-2019 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_widget:true, Powerange:true */

'use strict';

function depends_slider() {

  var deps = [];
  if (!$('link[href$="lib/powerange.min.css"]').length) {
    deps.push(ftui.config.basedir + 'lib/powerange.min.css');
  }
  if (!$('link[href$="css/ftui_slider.css"]').length) {
    deps.push(ftui.config.basedir + 'css/ftui_slider.css');
  }
  if (!$.fn.Powerange) {
    deps.push(ftui.config.basedir + 'lib/powerange.js');
  }
  return deps;
}

var Modul_slider = function () {

  $(document).on('changedSelection', function () {
    window.requestAnimationFrame(function () {
      onResize();
    });
  });

  $(window).resize(function () {
    onResize();
  });

  function setTimer(elem, state) {

    ftui.log(2, me.widgetname + ' - set timer to ' + state);
    if (state === 'on' && !elem.isValidData('timer-id')) {
      var timerInterval = elem.data('timer-interval');
      ftui.log(2, me.widgetname + ' - timerInterval=' + timerInterval);
      if (timerInterval > 0) {
        var tid = setInterval(function () {
          if (elem && elem.data('timer-step')) {
            var id = elem.widgetId();
            var storeval = parseFloat(sessionStorage.getItem(id));

            var pwrng = elem.data('Powerange');
            storeval = storeval + parseFloat(elem.data('timer-step'));
            if (pwrng && storeval <= pwrng.options.max) {
              ftui.log(3, me.widgetname + ': id=' + id + ' / storeval=' + storeval);
              pwrng.setStart(parseFloat(storeval));
              sessionStorage.setItem(id, storeval);
            }
          } else {
            clearInterval(tid);
          }
        }, timerInterval);
        elem.data('timer-id', tid);
      }
    }
    if (state === 'off' && elem.isValidData('timer-id')) {
      clearInterval(elem.data('timer-id'));
    }

  }

  function onChange(elem) {

    var pwrng = elem.data('Powerange');
    var id = elem.widgetId();

    var selMode = elem.data('selection');
    var v = 0,
      sliVal = 0;
    var isunsel = 1;
    if (pwrng) {
      isunsel = $(pwrng.slider).hasClass('unselectable');
      if (isunsel) {
        elem.data('selection', 1);
      }
      sliVal = pwrng.element.value;
      v = elem.hasClass('negated') ? pwrng.options.max + pwrng.options.min - sliVal : sliVal;
    }

    if (elem.hasClass('value') || elem.hasClass('value-right')) {
      elem.find('#slidervalue').text(v);
    }
    var storeval = sessionStorage.getItem(id);

    // isunsel == false (0) means drag is over
    if (pwrng && (!isunsel) && (selMode) && (sliVal != storeval)) {

      if (elem.hasClass('lock')) {
        elem.addClass('fail-shake');
        setTimeout(function () {

          pwrng.setStart(parseFloat(storeval));
          elem.removeClass('fail-shake');
        }, 500);
        return;
      }

      if (elem.hasClass('FS20')) {
        v = ftui.FS20.dimmerValue(v);
      }
      elem.data('value', elem.data('set-value').toString().replace('$v', v.toString()));

      // write visible value (from pwrng) to local storage NOT the fhem exposed value)
      sessionStorage.setItem(elem.widgetId(), sliVal);
      elem.transmitCommand();

      elem.data('selection', 0);

    }
  }

  function onResize() {
    if (me.elements.length > 0) {
      me.elements.each(function () {
        var elem = $(this);
        var id = elem.widgetId();
        var storeval = sessionStorage.getItem(id);
        var pwrng = elem.data('Powerange');
        if (pwrng) {
          pwrng.setStart(parseFloat(storeval));
          // second call necessary
          pwrng.setStart(parseFloat(storeval));
        }
      });
    }
  }

  function init_attr(elem) {

    //init standard attributes 
    base.init_attr.call(me, elem);

    elem.initClassColor('color');

    elem.initData('on', 'on');
    elem.initData('off', 'off');
    elem.initData('width', elem.hasClass('horizontal') ? elem.hasClass('mini') ? '60px' : '90%' : null);
    elem.initData('height', elem.hasClass('horizontal') ? null : elem.hasClass('mini') ? '60px' : '90%');
    elem.initData('value', 0);
    elem.initData('min', 0);
    elem.initData('max', 100);
    elem.initData('step', 1);
    elem.initData('handle-diameter', 20);
    elem.initData('touch-diameter', elem.data('handle-diameter'));
    elem.initData('set-value', '$v');
    elem.initData('get-value', elem.data('part') || -1);
    elem.initData('color', '#aa6900');
    elem.initData('background-color', '#404040');
    elem.initData('timer-state', '');
    elem.initData('timer-step', '1');
    elem.initData('timer-interval', '1000');
    elem.initData('timer-state-on', 'on');
    elem.initData('timer-state-off', 'off');


    // numeric value means fix value, others mean it is a reading
    if (!$.isNumeric(elem.data('max'))) {
      me.addReading(elem, 'max');
    }
    if (!$.isNumeric(elem.data('min'))) {
      me.addReading(elem, 'min');
    }
    if (elem.isDeviceReading('timer-state')) {
      me.addReading(elem, 'timer-state');
    }

  }

  function init_ui(elem) {

    var id = elem.widgetId();
    var storeval = sessionStorage.getItem(id);
    storeval = (storeval) ? storeval : '5';

    // prepare container element
    var contElem = $('<div/>', {
      class: 'slider-wrapper'
    });

    var input_elem = $('<input/>', {
      type: 'text',
      class: me.widgetname,
    }).appendTo(contElem);

    elem.data('selection', 0);
    var step = elem.data('step');

    var pwrng = new Powerange(input_elem[0], {
      vertical: !elem.hasClass('horizontal'),
      handleDiameter: elem.data('handle-diameter'),
      touchDiameter: elem.data('touch-diameter'),
      min: elem.data('min'),
      max: elem.data('max'),
      step: step,
      decimal: Number(step) === step && step % 1 !== 0,
      tap: elem.hasClass('tap') || false,
      klass: elem.hasClass('horizontal') ? me.widgetname + '_horizontal' : me.widgetname + '_vertical',
      callback: function () {
        me.onChange(elem);
      }
    });

    elem.data('Powerange', pwrng);
    elem.html('').append(contElem);

    var rangeContainer = elem.find('.range-container');
    var rangeQuantity = elem.find('.range-quantity');
    var rangeBar = elem.find('.range-bar');
    rangeQuantity.css({
      'background-color': elem.data('color')
    });
    rangeBar.css({
      'background-color': elem.data('background-color')
    });

    if (elem.hasClass('negated')) {
      var rangeBarColor = rangeBar.css('background-color');
      rangeBar.css({
        'background-color': rangeQuantity.css('background-color')
      });
      rangeQuantity.css({
        'background-color': rangeBarColor
      });
    }

    sessionStorage.setItem(id, storeval);
    var width = elem.data('width');
    var widthUnit = ($.isNumeric(width)) ? 'px' : '';
    var height = elem.data('height');
    var heightUnit = ($.isNumeric(height)) ? 'px' : '';
    var widthHandle = elem.data('handle-diameter');
    var widthHandleUnit = ($.isNumeric(widthHandle)) ? 'px' : '';

    if (elem.hasClass('horizontal')) {
      contElem.css({
        'height': height + heightUnit
      });

      rangeContainer.css({
        'height': widthHandle + widthHandleUnit
      });

      if (width) {
        contElem.css({
          'width': width + widthUnit
        });
      }

      if (height) {
        rangeBar.css({
          'height': height + heightUnit,
          'max-height': height + heightUnit,
          'top': '-' + height / 2 + heightUnit
        });
        contElem.css({
          'height': height + heightUnit,
          'max-height': height + heightUnit,
          'top': '-' + height / 2 + heightUnit
        });
      }
    } else {
      if (height) {
        contElem.css({
          'height': height + heightUnit
        });
      }
      if (width) {
        rangeBar.css({
          'width': width + widthUnit,
          'max-width': width + widthUnit,
          'left': '-' + width / 4 + widthUnit,
        });
      }
    }

    if (elem.hasClass('value')) {
      $('<div/>', {
        id: 'slidervalue',
        class: 'slidertext normal',
      }).appendTo(contElem);
    }

    if (elem.hasClass('value-right')) {
      $('<span/>', {
        id: 'slidervalue',
        class: 'slidertext-right',
      }).appendTo(rangeContainer);
    }

    if (elem.hasClass('readonly')) {
      elem.children().find('.range-handle').css({
        'visibility': 'hidden',
        'width': '0px',
        'height': '0px'
      });
    }

    //elem.addClass(pwrng.options.klass);

    // set initial value
    pwrng.setStart(parseFloat(storeval));


    // Refresh slider position after it became visible
    elem.closest('[data-type="popup"]').on('fadein', function () {
      setTimeout(function () {
        onResize();

      }, 500);
    });

    if (elem.data('timer-state') === 'on') {
      setTimer(elem, 'on');
    }
  }

  function update(dev, par) {
    // update from normal state reading
    me.elements.filterDeviceReading('get', dev, par)
      .add(me.elements.filterDeviceReading('min', dev, par))
      .add(me.elements.filterDeviceReading('max', dev, par))
      .each(function () {
        var elem = $(this);
        var state = elem.getReading('get').val;
        if (ftui.isValid(state)) {
          var pwrng = elem.data('Powerange');
          var input_elem = elem.find('input');
          var part = elem.data('get-value') || elem.data('part');
          var txtValue = ftui.getPart(state, part);
          var val = parseFloat(txtValue);
          pwrng.options.min = ($.isNumeric(elem.data('min'))) ? elem.data('min') : elem.getReading('min').val;
          pwrng.options.max = ($.isNumeric(elem.data('max'))) ? elem.data('max') : elem.getReading('max').val;

          pwrng.options.min = parseFloat(pwrng.options.min);
          pwrng.options.max = parseFloat(pwrng.options.max);

          if (val > pwrng.options.max) {
            val = pwrng.options.max;
          }
          if (val < pwrng.options.min) {
            val = pwrng.options.min;
          }

          if (new RegExp('^' + elem.data('on') + '$').test(txtValue))
            val = pwrng.options.max;
          if (new RegExp('^' + elem.data('off') + '$').test(txtValue))
            val = pwrng.options.min;
          if ($.isNumeric(val) && input_elem && pwrng.options.min < pwrng.options.max) {
            var v = elem.hasClass('negated') ? pwrng.options.max + pwrng.options.min - parseFloat(val) : parseFloat(val);
            pwrng.setStart(parseFloat(v));

            sessionStorage.setItem(elem.widgetId(), v);
            ftui.log(1, 'slider dev:' + dev + ' par:' + par + ' changed to:' + v);

            //set colors according matches for values
            var limits = elem.data('limits');
            if (limits) {
              var colors = elem.data('colors');

              // if data-colors isn't set, try using #505050 instead
              if (typeof colors == 'undefined') {
                colors = new Array('#505050');
              }

              // fill up colors and icons to states.length
              // if an index s isn't set, use the value of s-1
              for (var s = 0, len = limits.length; s < len; s++) {
                if (typeof colors[s] == 'undefined') {
                  colors[s] = colors[s > 0 ? s - 1 : 0];
                }
              }

              var idx = ftui.indexOfGeneric(limits, val);
              if (idx > -1) {
                elem.children().find('.range-quantity').css('background-color', colors[idx]);
              }
            }
            elem.attr('title', val);
          }
          if (elem.hasClass('value') || elem.hasClass('value-right')) {
            var slidervalue = elem.find('#slidervalue');
            if (slidervalue) {
              if (elem.hasClass('textvalue')) {
                slidervalue.text(txtValue);
              } else {
                slidervalue.text(val);
              }
            }
          }
          input_elem.css({
            visibility: 'visible'
          });
        }
      });


    //extra reading for timer
    var reading = 'timer-state';
    me.elements.filterDeviceReading(reading, dev, par)
      .each(function () {
        var elem = $(this);
        var val = elem.getReading(reading).val;
        if (ftui.isValid(val)) {
          var state = elem.matchingState(reading, val);
          setTimer(elem, state);
        }
      });

    //extra reading for lock
    me.update_lock(dev, par);

    //extra reading for hide
    me.update_hide(dev, par);

    //extra reading for reachable
    me.update_reachable(dev, par);
  }

  // public
  // inherit members from base class
  var parent = new Modul_widget();
  var base = {
    init_attr: parent.init_attr
  };
  var me = $.extend(parent, {
    //override or own public members
    widgetname: 'slider',
    init_ui: init_ui,
    init_attr: init_attr,
    onChange: onChange,
    update: update,
  });

  return me;
};
