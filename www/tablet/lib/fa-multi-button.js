/*!jQuery FA multi button*/
/**
 * Modern toggle, push button, dimmer or just a signal indicator
 *
 * Version: 1.2.1
 * Requires: jQuery v1.7+
 *
 * Copyright (c) 2015 Mario Stephan
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 *
 * Thanks to phoxoey
 */

"use strict";

/* global jQuery:true */

(function ($) {

    $.fn.famultibutton = function (pOptions) {

        if (this.length > 1) {
            this.each(function () {
                $(this).famultibutton(pOptions);
            });
            return this;
        }

        // private variables;
        var elem = this;
        var faElem;
        var state = false;
        // private for dimmer
        var canvasScale;
        var objTimer;
        var isRunning = false;
        var resStepValues = [0, 10, 40, 80, 120, 140, 150, 160, 180, 200, 240, 260, 280, 300, 320, 420, 430, 440, 450, 460, 470];
        var dragy = 0;
        var currVal = 0;
        var diff = 0;
        var baseTop = 0;
        var posy = 0;
        var isDrag = false;
        var isDown = false;

        // setup options
        var defaultOptions = {
            backgroundIcon: 'fa-circle',
            classes: ['fa-2x'],
            icon: 'fa-power-off',
            offColor: '#2A2A2A',
            offBackgroundColor: '#505050',
            onColor: '#2A2A2A',
            onBackgroundColor: '#aa6900',
            mode: 'toggle', //toggle, push, signal, dimmer
            toggleOn: null,
            toggleOff: null,
            valueChanged: null,
            progressWidth: 15,
            max: 100,
            min: 0,
            step: 1,
        };

        var options = $.extend({}, defaultOptions, pOptions);

        // private functions;
        var intialize = function () {

            options = $.extend({}, options, elem.data());

            var content = (elem.html() !== elem.text()) ?
                jQuery('<div>', {}).html(elem.html()).children().detach() :
                jQuery('<div>', {}).text(elem.text());
            if (options['onColor'] !== 'none' && options['offColor'] !== 'none') {
                content.attr('id', 'fg');
            }
            content.addClass('fa-stack-1x');

            elem.html('');

            faElem = $('<div/>', {
                class: 'famultibutton'
            }).appendTo(elem);


            faElem.addClass('fa-stack');

            jQuery('<i/>', {
                    'id': 'bg',
                    'class': 'fa fa-stack-2x'
                }).addClass(options['backgroundIcon'])
                .appendTo(faElem);

            jQuery('<i/>', {
                'id': 'fg',
                'class': 'fa fa-stack-1x'
            }).addClass(options['icon']).appendTo(faElem);

            content.appendTo(faElem);

            if (options['classes'] && options['classes'].length > 0) {
                for (var i = 0; i < options['classes'].length; i++) {
                    faElem.addClass(options['classes'][i]);
                }
            }

            elem.o = options;

            setOff();

            if (options['mode'] == 'dimmer') {
                canvasScale = $('<canvas>').attr({
                    id: 'scale',
                    height: elem.height() + 'px',
                    width: elem.width() + 'px'
                }).appendTo(faElem);

                baseTop = parseInt(canvasScale.offset().top) - parseInt(faElem.offset().top);

                drawScale();
                moveScale();
            }

            elem.data("famultibutton", elem);

            initEvents();

            return elem;
        };

        function setOn() {

            state = true;

            faElem.children('#bg').css("color", options['onBackgroundColor']);
            faElem.children('#fg').css("color", options['onColor']);
            elem.trigger('setOn');
        }

        function setOff() {

            state = false;
            faElem.children('#bg').css("color", options['offBackgroundColor']);
            faElem.children('#fg').css("color", options['offColor']);
            elem.trigger('setOff');
        }

        function fadeOff() {

            if (state) {

                state = false;

                $('<div />').animate({
                    'width': 100
                }, {
                    duration: 700,
                    easing: 'swing',
                    // Fade the colors in the step function
                    step: function (now, fx) {
                        var completion = (now - fx.start) / (fx.end - fx.start);
                        faElem.children('#bg').css('color', getGradientColor(
                            options['onBackgroundColor'],
                            options['offBackgroundColor'],
                            completion));
                        faElem.children('#fg').css('color', getGradientColor(
                            options['onColor'],
                            options['offColor'],
                            completion));
                    },
                });
            }
        }

        // helper functions for color fade out
        function rgbToHex(rgb) {
            var tokens = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
            return (tokens && tokens.length === 4) ? "#" +
                ("0" + parseInt(tokens[1], 10).toString(16)).slice(-2) +
                ("0" + parseInt(tokens[2], 10).toString(16)).slice(-2) +
                ("0" + parseInt(tokens[3], 10).toString(16)).slice(-2) : rgb;
        }

        function getGradientColor(start_color, end_color, percent) {
            // strip the leading # if it's there
            start_color = rgbToHex(start_color).replace(/^\s*#|\s*$/g, '');
            end_color = rgbToHex(end_color).replace(/^\s*#|\s*$/g, '');

            // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
            if (start_color.length == 3) {
                start_color = start_color.replace(/(.)/g, '$1$1');
            }

            if (end_color.length == 3) {
                end_color = end_color.replace(/(.)/g, '$1$1');
            }



            // get colors
            var start_red = parseInt(start_color.substr(0, 2), 16),
                start_green = parseInt(start_color.substr(2, 2), 16),
                start_blue = parseInt(start_color.substr(4, 2), 16);

            var end_red = parseInt(end_color.substr(0, 2), 16),
                end_green = parseInt(end_color.substr(2, 2), 16),
                end_blue = parseInt(end_color.substr(4, 2), 16);

            // calculate new color
            var diff_red = end_red - start_red;
            var diff_green = end_green - start_green;
            var diff_blue = end_blue - start_blue;

            diff_red = ((diff_red * percent) + start_red).toString(16).split('.')[0];
            diff_green = ((diff_green * percent) + start_green).toString(16).split('.')[0];
            diff_blue = ((diff_blue * percent) + start_blue).toString(16).split('.')[0];

            // ensure 2 digits by color
            if (diff_red.length == 1)
                diff_red = '0' + diff_red;

            if (diff_green.length == 1)
                diff_green = '0' + diff_green;

            if (diff_blue.length == 1)
                diff_blue = '0' + diff_blue;

            return '#' + diff_red + diff_green + diff_blue;
        }

        function setProgressValue(value) {

            var $canvasProgress = elem.find('canvas#progress');
            if (value > 0) {
                if ($canvasProgress.length === 0) {

                    $canvasProgress = $('<canvas>').attr({
                        id: 'progress'
                    }).appendTo(faElem);
                }
                var canvas = $canvasProgress[0];
                if (canvas) {
                    canvas.height = faElem.height();
                    canvas.width = faElem.width();
                    var x = canvas.width / 2;
                    var y = canvas.height / 2;
                    if (canvas.getContext) {
                        var c = canvas.getContext('2d');
                        c.beginPath();
                        c.strokeStyle = options.onColor;
                        c.arc(x, y, x * ((-0.4 / 90) * Number(options.progressWidth) + 0.8), -0.5 * Math.PI, (-0.5 + value * 2) * Math.PI, false);
                        c.lineWidth = x * 0.80 * options.progressWidth / 100;
                        c.stroke();
                    }
                }

            } else {
                elem.find('canvas#progress').remove();
            }

        }

        function tickTimer() {
            clearTimeout(objTimer);
            currVal = (diff > 0) ? currVal -= options['step'] : currVal += options['step'];

            if (currVal > options['max']) currVal = options['max'];
            if (currVal < options['min']) currVal = options['min'];

            drawScale();
            var d = (resStepValues[Math.abs(diff)]);
            objTimer = setTimeout(function () {
                tickTimer();
            }, 500 - d);
        }

        function drawScale() {

            var canvas = canvasScale[0];
            canvas.height = faElem.innerHeight();
            canvas.width = faElem.innerWidth();

            if (canvas.getContext) {

                var context = canvas.getContext('2d');
                context.strokeStyle = options['offBackgroundColor'];
                var max = options['max'];
                var min = options['min'];
                var valPosition = canvas.height - Math.round(canvas.height * (currVal - min) / (max - min));

                for (var i = 0; i < canvas.height; i += 4) {
                    context.lineWidth = 1;
                    context.beginPath();
                    context.moveTo(5, i);
                    context.lineTo(25, i);
                    context.stroke();
                }

                context.strokeStyle = (state) ? options['onBackgroundColor'] :
                    getGradientColor(options['offBackgroundColor'], '#ffffff', 0.4);
                context.lineWidth = 3;
                context.beginPath();
                context.moveTo(5, valPosition);
                context.lineTo(25, valPosition);
                context.stroke();

                context.fillStyle = getGradientColor(options['offBackgroundColor'], '#ffffff', 0.4);
                context.font = "10px sans-serif";
                context.fillText(currVal, 30, canvas.height);

            }
        }

        function moveScale() {

            canvasScale.css({
                position: 'absolute',
                'z-index': -1,
            });

            if (isDrag) {
                canvasScale.animate({
                    left: -faElem.innerWidth() * 0.6 + 'px'
                });
            } else {
                canvasScale.animate({
                    left: faElem.innerWidth() / 5 + 'px',
                    top: '0px'
                });
            }

        }

        function getAndroidVersion(ua) {
            ua = (ua || navigator.userAgent).toLowerCase();
            var match = ua.match(/android\s([0-9\.]*)/);
            return match ? match[1] : false;
        }

        function initEvents() {
            var touch_pos_x, touch_pos_y;
            var android = getAndroidVersion();
            var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
            var onlyTouch = ((android && parseFloat(android) < 5) || iOS);
            var clickEventType = (onlyTouch) ? 'touchstart' : 'touchstart mousedown';
            var moveEventType = ((onlyTouch) ? 'touchmove' : 'touchmove mousemove');
            var releaseEventType = ((onlyTouch) ? 'touchend' : 'touchend mouseup');
            var leaveEventType = ((onlyTouch) ? 'touchleave' : 'touchleave mouseout');
            var lastState;

            if (options['mode'] == 'push') {
                faElem.on(clickEventType, function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    touch_pos_y = $(window).scrollTop();
                    touch_pos_x = $(window).scrollLeft();
                });
                faElem.on(releaseEventType, function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    if (Math.abs(touch_pos_y - $(window).scrollTop()) > 3 ||
                        (Math.abs(touch_pos_x - $(window).scrollLeft()) > 3)) return;

                    lastState = state;
                    setOn();

                    if (typeof options['toggleOn'] === 'function') {
                        options['toggleOn'].call(this);
                    }

                    setTimeout(function () {
                        fadeOff();
                    }, 200);

                    if (lastState === true) {
                        setTimeout(function () {
                            setOn();
                        }, 1000);
                    }

                    setTimeout(function () {
                        if (state === true) {
                            setOn();
                        }
                    }, 1200);

                    elem.trigger('clicked');

                    return false;
                });
            } else if (options['mode'] == 'updown') {
                faElem.on(clickEventType, function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();

                    lastState = state;
                    setOn();

                    if (typeof options['toggleOn'] === 'function') {
                        options['toggleOn'].call(this);
                    }

                });
                faElem.on(releaseEventType, function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();

                    if (typeof options['toggleOff'] === 'function') {
                        options['toggleOff'].call(this);
                    }

                    setTimeout(function () {
                        fadeOff();
                    }, 200);

                    if (lastState === true) {
                        setTimeout(function () {
                            setOn();
                        }, 1000);
                    }

                    setTimeout(function () {
                        if (state === true) {
                            setOn();
                        }
                    }, 1200);


                    elem.trigger('clicked');

                    return false;
                });
            } else if (options['mode'] == 'toggle') {
                faElem.on(clickEventType, function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    touch_pos_y = $(window).scrollTop();
                    touch_pos_x = $(window).scrollLeft();
                });
                faElem.on(releaseEventType, function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();

                    if (Math.abs(touch_pos_y - $(window).scrollTop()) > 3 ||
                        (Math.abs(touch_pos_x - $(window).scrollLeft()) > 3)) return;
                    if (state) {

                        setOff();
                        if (typeof options['toggleOff'] === 'function') {
                            options['toggleOff'].call(this);
                        }
                    } else {

                        setOn();
                        if (typeof options['toggleOn'] === 'function') {
                            options['toggleOn'].call(this);
                        }
                    }

                    elem.trigger('clicked');

                    return false;
                });
            } else if (options['mode'] == 'dimmer') {
                faElem.on(clickEventType, function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    var event = e.originalEvent;
                    dragy = event.touches ? event.touches[0].clientY : e.pageY;
                    diff = 0;
                    isDown = true;
                });
                faElem.on(leaveEventType, function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    if (isDrag) {
                        isDrag = false;
                        faElem.animate({
                            top: 0
                        });
                        clearInterval(objTimer);
                        isRunning = false;
                        moveScale();
                    }
                    isDown = false;
                });

                faElem.on(releaseEventType, function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    if (isDrag) {
                        isDrag = false;
                        faElem.animate({
                            top: 0
                        });
                        clearTimeout(objTimer);
                        isRunning = false;
                        if (typeof options['valueChanged'] === 'function') {
                            options['valueChanged'].call(this, currVal);
                        }
                    } else {
                        if (state) {

                            setOff();
                            if (typeof options['toggleOff'] === 'function') {
                                options['toggleOff'].call(this);
                            }
                        } else {

                            setOn();
                            if (typeof options['toggleOn'] === 'function') {
                                options['toggleOn'].call(this);
                            }
                        }
                    }
                    isDrag = false;
                    isDown = false;
                    moveScale();
                    drawScale();
                    elem.trigger('clicked');
                    return false;
                });
                faElem.on(moveEventType, function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    if (isDown)
                        isDrag = true;

                    var event = e.originalEvent;
                    posy = event.touches ? event.touches[0].clientY : e.pageY;

                    diff = posy - dragy;

                    if (diff > 20) diff = 20;
                    if (diff < -20) diff = -20;
                    if (isDrag) {
                        this.style.top = diff + "px";
                        var canvas = canvasScale[0];

                        canvas.style.top = -diff + 'px';

                        if (!isRunning) {
                            moveScale();
                            tickTimer();
                            isRunning = true;
                        }
                    }
                });
            }
        }

        // public functions;
        this.setOn = function () {
            setOn();
        };
        this.setOff = function () {
            setOff();
        };
        this.getState = function () {
            return state;
        };
        this.getValue = function () {
            return currVal;
        };
        this.setDimValue = function (val) {
            currVal = val;
            drawScale();
        };
        this.setProgressValue = function (val) {
            setProgressValue(val);
        };
        return intialize();
    };
})(jQuery);