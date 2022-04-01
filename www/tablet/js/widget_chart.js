/* FTUI Plugin
 * Copyright (c) 2015-2017 Kurt Eckert
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */
/* Version 2.11.0
/* Compatible FTUI Version >= 2.7.2

/* global ftui:true, Modul_widget:true, Powerange:true */

"use strict";

function depends_chart (){
	var mainCSS = $('head').find("[href$='fhem-tablet-ui-user.css']");
	if (mainCSS.length)
		mainCSS.before('<link rel="stylesheet" href="' + ftui.config.basedir + 'css/ftui_chart.css" type="text/css" />');
	else
		$('head').append('<link rel="stylesheet" href="' + ftui.config.basedir + 'css/ftui_chart.css" type="text/css" />');

	if (!window.addResizeListener) {
		(function(){
			var attachEvent = document.attachEvent;
			var isIE = navigator.userAgent.match(/Trident/);
			//console.log(isIE);

			var requestFrame = (function(){
				var raf =	window.requestAnimationFrame ||
							window.mozRequestAnimationFrame ||
							window.webkitRequestAnimationFrame ||
							function(fn){ return window.setTimeout(fn, 20); };
				return function(fn){ return raf(fn); };
			})();
			
			var cancelFrame = (function(){
				var cancel =	window.cancelAnimationFrame ||
								window.mozCancelAnimationFrame ||
								window.webkitCancelAnimationFrame ||
								window.clearTimeout;
				return function(id){ return cancel(id); };
			})();
			
			function resizeListener(e){
				var win = e.target || e.srcElement;
				if (win.__resizeRAF__) cancelFrame(win.__resizeRAF__);
				win.__resizeRAF__ = requestFrame(function(){
					var trigger = win.__resizeTrigger__;
					trigger.__resizeListeners__.forEach(function(fn){
						fn.call(trigger, e);
					});
				});
			}
				
			function objectLoad(e){
				this.contentDocument.defaultView.__resizeTrigger__ = this.__resizeElement__;
				this.contentDocument.defaultView.addEventListener('resize', resizeListener);
			}
			
			window.checkResizeListener = function(element){
				if (element.__resizeListeners__ && element.__resizeListeners__.length && element.__resizeListeners__.length > 0)
					return true;
				else
					return false;
			};
			
			window.addResizeListener = function(element, fn){
				if (!element.__resizeListeners__) {
					element.__resizeListeners__ = [];
					if (attachEvent) {
						element.__resizeTrigger__ = element;
						element.attachEvent('onresize', resizeListener);
					}
					else {
						if (getComputedStyle(element).position == 'static') element.style.position = 'relative';
						var obj = element.__resizeTrigger__ = document.createElement('object'); 
						obj.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1;');
						obj.__resizeElement__ = element;
						obj.onload = objectLoad;
						obj.type = 'text/html';
						if (isIE) element.appendChild(obj);
						obj.data = 'about:blank';
						if (!isIE) element.appendChild(obj);
					}
				}
				element.__resizeListeners__.push(fn);
			};
			
			window.removeResizeListener = function(element, fn){
				element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
				if (!element.__resizeListeners__.length) {
					if (attachEvent) element.detachEvent('onresize', resizeListener);
					else {
						element.__resizeTrigger__.contentDocument.defaultView.removeEventListener('resize', resizeListener);
						element.__resizeTrigger__ = !element.removeChild(element.__resizeTrigger__);
					}
				}
			}
		})();
	}

	if (!String.stripFormat) {
		String.prototype.stripFormat = function() {
			return this.replace(/\<(i|b|em|small|strong|mark|del|ins|sub|sup|class)\>/,'').replace(/\<\/(i|b|em|small|strong|mark|del|ins|sub|sup|class)\>/,'');
		};
	}

	if (!$.fn.HTML2SVG) {
		$.fn.HTML2SVG = function(text,delfirst) {
			var isIE = navigator.userAgent.match(/Trident/);
			this.each(function() {
				var convertedText = widget_chart.getFormattedText(text);
				if (convertedText.search(/^\<tspan/) < 0) convertedText = '<tspan>' + convertedText + '</tspan>';
				var elem = $(this);
				if (delfirst) elem.empty();
				if (isIE) {
					convertedText = convertedText.replace(/\<tspan[^\>]*\>/g,'').replace(/\<\/tspan\>/g,'');
					elem.text(convertedText);
				} else {
					elem.html(convertedText);
				}
			});
		};
	}
	
	if (!$.fn.visibilityChanged) {
		(function ($) {
			var defaults = {
				callback: function () { },
				runOnLoad: true,
				frequency: 500,
				previousVisibility : null
			};

			var methods = {};
			methods.checkVisibility = function (element, options) {
				if (jQuery.contains(document, element[0])) {
					var previousVisibility = options.previousVisibility;
					var isVisible = element.is(':visible');
					options.previousVisibility = isVisible;
					if (previousVisibility === null) {
						if (options.runOnLoad) {
							options.callback(element, isVisible);
						}
					} else if (previousVisibility !== isVisible) {
						options.callback(element, isVisible);
					}

					setTimeout(function() {
						methods.checkVisibility(element, options);
					}, options.frequency);
				} 
			};

			$.fn.visibilityChanged = function (options) {
				var settings = $.extend({}, defaults, options);
				return this.each(function () {
					methods.checkVisibility($(this), settings);
				});
			};
		})(jQuery);
	}
	
	if (!$.fn.getCoords) {
		(function ($) {

			$.fn.getCoords = function () { // crossbrowser version
				var box = this[0].getBoundingClientRect();

				var body = document.body;
				var docEl = document.documentElement;

				var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
				var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

				var clientTop = docEl.clientTop || body.clientTop || 0;
				var clientLeft = docEl.clientLeft || body.clientLeft || 0;

				var top  = box.top +  scrollTop - clientTop;
				var left = box.left + scrollLeft - clientLeft;

				return { top: Math.round(top), left: Math.round(left) };
			}
		})(jQuery);
	}
	
	if (!Object.entries)
	  Object.entries = function( obj ){
		var ownProps = Object.keys( obj ),
			i = ownProps.length,
			resArray = new Array(i); // preallocate the Array
		while (i--)
		  resArray[i] = [ownProps[i], obj[ownProps[i]]];

		return resArray;
	};
	
	if (!$.fn.draggable)
		return [ftui.config.basedir + "lib/jquery-ui.min.js"];
}

var widget_chart = {
	instance : 0,
	pendingUpdateRequests : [], // needed to overcome multi refresh problem with popup windows before first appearance
	initialized : [],
	LOGTYPE : 'console',
	logtext : '',
	gBCaps : undefined,
	
	doLog: function(func,info,level) { // print log commands to console if DEBUG is set
		if (widget_chart.LOGTYPE == 'console') {
			if (ftui.config.DEBUG && info) ftui.log(level?level:1,"Function: "+func+' > '+info);
		} else {
			if (ftui.config.DEBUG && info) widget_chart.logtext = widget_chart.logtext + '\n' + info;
		}
	},
	showLog: function(elem) {
		elem.parent().attr({'style':elem.parent().attr('style')+'; overflow: scroll; height:100%'});
		var logwin = widget_chart.createElem('svg');
		for(var i=0,il=widget_chart.logtext.length,ilast=0,y=10; i<il; i++) {
			if (widget_chart.logtext[i] == '\n') {
				var text = widget_chart.createElem('text').attr({'y':y+'px'});
				text.text(widget_chart.logtext.substring(ilast,i));
				logwin.append(text);
				y+=20;
				ilast = i+1;
			}
		}
		logwin.attr({'x':'10px','style':'overflow:scroll; height:'+y+'px; width:100%'});
		elem.after(logwin);
		logwin.show();
	},
	createElem: function(elem) { // create new graphic svg element
		return $(document.createElementNS('http://www.w3.org/2000/svg', elem));
	},
	createElemFrag: function(elem) { // create new graphic svg element
		return $(document.createDocumentFragment('http://www.w3.org/2000/svg', elem));
	},
	isIE: function() {
		var isIE = false;
		if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) {
			isIE = true;
		}
		return isIE;
	},
	fontNameToUnicode: function(name) {
		var FONT_AWESOME = {"fa-500px":"\uf26e","fa-adjust":"\uf042","fa-adn":"\uf170","fa-align-center":"\uf037","fa-align-justify":"\uf039","fa-align-left":"\uf036","fa-align-right":"\uf038","fa-amazon":"\uf270","fa-ambulance":"\uf0f9","fa-anchor":"\uf13d","fa-android":"\uf17b","fa-angellist":"\uf209","fa-angle-double-down":"\uf103","fa-angle-double-left":"\uf100","fa-angle-double-right":"\uf101","fa-angle-double-up":"\uf102","fa-angle-down":"\uf107","fa-angle-left":"\uf104","fa-angle-right":"\uf105","fa-angle-up":"\uf106","fa-apple":"\uf179","fa-archive":"\uf187","fa-area-chart":"\uf1fe","fa-arrow-circle-down":"\uf0ab","fa-arrow-circle-left":"\uf0a8","fa-arrow-circle-o-down":"\uf01a","fa-arrow-circle-o-left":"\uf190","fa-arrow-circle-o-right":"\uf18e","fa-arrow-circle-o-up":"\uf01b","fa-arrow-circle-right":"\uf0a9","fa-arrow-circle-up":"\uf0aa","fa-arrow-down":"\uf063","fa-arrow-left":"\uf060","fa-arrow-right":"\uf061","fa-arrow-up":"\uf062","fa-arrows":"\uf047","fa-arrows-alt":"\uf0b2","fa-arrows-h":"\uf07e","fa-arrows-v":"\uf07d","fa-asterisk":"\uf069","fa-at":"\uf1fa","fa-automobile":"\uf1b9","fa-backward":"\uf04a","fa-balance-scale":"\uf24e","fa-ban":"\uf05e","fa-bank":"\uf19c","fa-bar-chart":"\uf080","fa-bar-chart-o":"\uf080","fa-barcode":"\uf02a","fa-bars":"\uf0c9","fa-battery-0":"\uf244","fa-battery-1":"\uf243","fa-battery-2":"\uf242","fa-battery-3":"\uf241","fa-battery-4":"\uf240","fa-battery-empty":"\uf244","fa-battery-full":"\uf240","fa-battery-half":"\uf242","fa-battery-quarter":"\uf243","fa-battery-three-quarters":"\uf241","fa-bed":"\uf236","fa-beer":"\uf0fc","fa-behance":"\uf1b4","fa-behance-square":"\uf1b5","fa-bell":"\uf0f3","fa-bell-o":"\uf0a2","fa-bell-slash":"\uf1f6","fa-bell-slash-o":"\uf1f7","fa-bicycle":"\uf206","fa-binoculars":"\uf1e5","fa-birthday-cake":"\uf1fd","fa-bitbucket":"\uf171","fa-bitbucket-square":"\uf172","fa-bitcoin":"\uf15a","fa-black-tie":"\uf27e","fa-bold":"\uf032","fa-bolt":"\uf0e7","fa-bomb":"\uf1e2","fa-book":"\uf02d","fa-bookmark":"\uf02e","fa-bookmark-o":"\uf097","fa-briefcase":"\uf0b1","fa-btc":"\uf15a","fa-bug":"\uf188","fa-building":"\uf1ad","fa-building-o":"\uf0f7","fa-bullhorn":"\uf0a1","fa-bullseye":"\uf140","fa-bus":"\uf207","fa-buysellads":"\uf20d","fa-cab":"\uf1ba","fa-calculator":"\uf1ec","fa-calendar":"\uf073","fa-calendar-check-o":"\uf274","fa-calendar-minus-o":"\uf272","fa-calendar-o":"\uf133","fa-calendar-plus-o":"\uf271","fa-calendar-times-o":"\uf273","fa-camera":"\uf030","fa-camera-retro":"\uf083","fa-car":"\uf1b9","fa-caret-down":"\uf0d7","fa-caret-left":"\uf0d9","fa-caret-right":"\uf0da","fa-caret-square-o-down":"\uf150","fa-caret-square-o-left":"\uf191","fa-caret-square-o-right":"\uf152","fa-caret-square-o-up":"\uf151","fa-caret-up":"\uf0d8","fa-cart-arrow-down":"\uf218","fa-cart-plus":"\uf217","fa-cc":"\uf20a","fa-cc-amex":"\uf1f3","fa-cc-diners-club":"\uf24c","fa-cc-discover":"\uf1f2","fa-cc-jcb":"\uf24b","fa-cc-mastercard":"\uf1f1","fa-cc-paypal":"\uf1f4","fa-cc-stripe":"\uf1f5","fa-cc-visa":"\uf1f0","fa-certificate":"\uf0a3","fa-chain":"\uf0c1","fa-chain-broken":"\uf127","fa-check":"\uf00c","fa-check-circle":"\uf058","fa-check-circle-o":"\uf05d","fa-check-square":"\uf14a","fa-check-square-o":"\uf046","fa-chevron-circle-down":"\uf13a","fa-chevron-circle-left":"\uf137","fa-chevron-circle-right":"\uf138","fa-chevron-circle-up":"\uf139","fa-chevron-down":"\uf078","fa-chevron-left":"\uf053","fa-chevron-right":"\uf054","fa-chevron-up":"\uf077","fa-child":"\uf1ae","fa-chrome":"\uf268","fa-circle":"\uf111","fa-circle-o":"\uf10c","fa-circle-o-notch":"\uf1ce","fa-circle-thin":"\uf1db","fa-clipboard":"\uf0ea","fa-clock-o":"\uf017","fa-clone":"\uf24d","fa-close":"\uf00d","fa-cloud":"\uf0c2","fa-cloud-download":"\uf0ed","fa-cloud-upload":"\uf0ee","fa-cny":"\uf157","fa-code":"\uf121","fa-code-fork":"\uf126","fa-codepen":"\uf1cb","fa-coffee":"\uf0f4","fa-cog":"\uf013","fa-cogs":"\uf085","fa-columns":"\uf0db","fa-comment":"\uf075","fa-comment-o":"\uf0e5","fa-commenting":"\uf27a","fa-commenting-o":"\uf27b","fa-comments":"\uf086","fa-comments-o":"\uf0e6","fa-compass":"\uf14e","fa-compress":"\uf066","fa-connectdevelop":"\uf20e","fa-contao":"\uf26d","fa-copy":"\uf0c5","fa-copyright":"\uf1f9","fa-creative-commons":"\uf25e","fa-credit-card":"\uf09d","fa-crop":"\uf125","fa-crosshairs":"\uf05b","fa-css3":"\uf13c","fa-cube":"\uf1b2","fa-cubes":"\uf1b3","fa-cut":"\uf0c4","fa-cutlery":"\uf0f5","fa-dashboard":"\uf0e4","fa-dashcube":"\uf210","fa-database":"\uf1c0","fa-dedent":"\uf03b","fa-delicious":"\uf1a5","fa-desktop":"\uf108","fa-deviantart":"\uf1bd","fa-diamond":"\uf219","fa-digg":"\uf1a6","fa-dollar":"\uf155","fa-dot-circle-o":"\uf192","fa-download":"\uf019","fa-dribbble":"\uf17d","fa-dropbox":"\uf16b","fa-drupal":"\uf1a9","fa-edit":"\uf044","fa-eject":"\uf052","fa-ellipsis-h":"\uf141","fa-ellipsis-v":"\uf142","fa-empire":"\uf1d1","fa-envelope":"\uf0e0","fa-envelope-o":"\uf003","fa-envelope-square":"\uf199","fa-eraser":"\uf12d","fa-eur":"\uf153","fa-euro":"\uf153","fa-exchange":"\uf0ec","fa-exclamation":"\uf12a","fa-exclamation-circle":"\uf06a","fa-exclamation-triangle":"\uf071","fa-expand":"\uf065","fa-expeditedssl":"\uf23e","fa-external-link":"\uf08e","fa-external-link-square":"\uf14c","fa-eye":"\uf06e","fa-eye-slash":"\uf070","fa-eyedropper":"\uf1fb","fa-facebook":"\uf09a","fa-facebook-f":"\uf09a","fa-facebook-official":"\uf230","fa-facebook-square":"\uf082","fa-fast-backward":"\uf049","fa-fast-forward":"\uf050","fa-fax":"\uf1ac","fa-feed":"\uf09e","fa-female":"\uf182","fa-fighter-jet":"\uf0fb","fa-file":"\uf15b","fa-file-archive-o":"\uf1c6","fa-file-audio-o":"\uf1c7","fa-file-code-o":"\uf1c9","fa-file-excel-o":"\uf1c3","fa-file-image-o":"\uf1c5","fa-file-movie-o":"\uf1c8","fa-file-o":"\uf016","fa-file-pdf-o":"\uf1c1","fa-file-photo-o":"\uf1c5","fa-file-picture-o":"\uf1c5","fa-file-powerpoint-o":"\uf1c4","fa-file-sound-o":"\uf1c7","fa-file-text":"\uf15c","fa-file-text-o":"\uf0f6","fa-file-video-o":"\uf1c8","fa-file-word-o":"\uf1c2","fa-file-zip-o":"\uf1c6","fa-files-o":"\uf0c5","fa-film":"\uf008","fa-filter":"\uf0b0","fa-fire":"\uf06d","fa-fire-extinguisher":"\uf134","fa-firefox":"\uf269","fa-flag":"\uf024","fa-flag-checkered":"\uf11e","fa-flag-o":"\uf11d","fa-flash":"\uf0e7","fa-flask":"\uf0c3","fa-flickr":"\uf16e","fa-floppy-o":"\uf0c7","fa-folder":"\uf07b","fa-folder-o":"\uf114","fa-folder-open":"\uf07c","fa-folder-open-o":"\uf115","fa-font":"\uf031","fa-fonticons":"\uf280","fa-forumbee":"\uf211","fa-forward":"\uf04e","fa-foursquare":"\uf180","fa-frown-o":"\uf119","fa-futbol-o":"\uf1e3","fa-gamepad":"\uf11b","fa-gavel":"\uf0e3","fa-gbp":"\uf154","fa-ge":"\uf1d1","fa-gear":"\uf013","fa-gears":"\uf085","fa-genderless":"\uf22d","fa-get-pocket":"\uf265","fa-gg":"\uf260","fa-gg-circle":"\uf261","fa-gift":"\uf06b","fa-git":"\uf1d3","fa-git-square":"\uf1d2","fa-github":"\uf09b","fa-github-alt":"\uf113","fa-github-square":"\uf092","fa-gittip":"\uf184","fa-glass":"\uf000","fa-globe":"\uf0ac","fa-google":"\uf1a0","fa-google-plus":"\uf0d5","fa-google-plus-square":"\uf0d4","fa-google-wallet":"\uf1ee","fa-graduation-cap":"\uf19d","fa-gratipay":"\uf184","fa-group":"\uf0c0","fa-h-square":"\uf0fd","fa-hacker-news":"\uf1d4","fa-hand-grab-o":"\uf255","fa-hand-lizard-o":"\uf258","fa-hand-o-down":"\uf0a7","fa-hand-o-left":"\uf0a5","fa-hand-o-right":"\uf0a4","fa-hand-o-up":"\uf0a6","fa-hand-paper-o":"\uf256","fa-hand-peace-o":"\uf25b","fa-hand-pointer-o":"\uf25a","fa-hand-rock-o":"\uf255","fa-hand-scissors-o":"\uf257","fa-hand-spock-o":"\uf259","fa-hand-stop-o":"\uf256","fa-hdd-o":"\uf0a0","fa-header":"\uf1dc","fa-headphones":"\uf025","fa-heart":"\uf004","fa-heart-o":"\uf08a","fa-heartbeat":"\uf21e","fa-history":"\uf1da","fa-home":"\uf015","fa-hospital-o":"\uf0f8","fa-hotel":"\uf236","fa-hourglass":"\uf254","fa-hourglass-1":"\uf251","fa-hourglass-2":"\uf252","fa-hourglass-3":"\uf253","fa-hourglass-end":"\uf253","fa-hourglass-half":"\uf252","fa-hourglass-o":"\uf250","fa-hourglass-start":"\uf251","fa-houzz":"\uf27c","fa-html5":"\uf13b","fa-i-cursor":"\uf246","fa-ils":"\uf20b","fa-image":"\uf03e","fa-inbox":"\uf01c","fa-indent":"\uf03c","fa-industry":"\uf275","fa-info":"\uf129","fa-info-circle":"\uf05a","fa-inr":"\uf156","fa-instagram":"\uf16d","fa-institution":"\uf19c","fa-internet-explorer":"\uf26b","fa-intersex":"\uf224","fa-ioxhost":"\uf208","fa-italic":"\uf033","fa-joomla":"\uf1aa","fa-jpy":"\uf157","fa-jsfiddle":"\uf1cc","fa-key":"\uf084","fa-keyboard-o":"\uf11c","fa-krw":"\uf159","fa-language":"\uf1ab","fa-laptop":"\uf109","fa-lastfm":"\uf202","fa-lastfm-square":"\uf203","fa-leaf":"\uf06c","fa-leanpub":"\uf212","fa-legal":"\uf0e3","fa-lemon-o":"\uf094","fa-level-down":"\uf149","fa-level-up":"\uf148","fa-life-bouy":"\uf1cd","fa-life-buoy":"\uf1cd","fa-life-ring":"\uf1cd","fa-life-saver":"\uf1cd","fa-lightbulb-o":"\uf0eb","fa-line-chart":"\uf201","fa-link":"\uf0c1","fa-linkedin":"\uf0e1","fa-linkedin-square":"\uf08c","fa-linux":"\uf17c","fa-list":"\uf03a","fa-list-alt":"\uf022","fa-list-ol":"\uf0cb","fa-list-ul":"\uf0ca","fa-location-arrow":"\uf124","fa-lock":"\uf023","fa-long-arrow-down":"\uf175","fa-long-arrow-alt-down":"\uf309","fa-long-arrow-left":"\uf177","fa-long-arrow-alt-left":"\uf30a","fa-long-arrow-right":"\uf178","fa-long-arrow-alt-right":"\uf30b","fa-long-arrow-up":"\uf176","fa-long-arrow-alt-up":"\uf30c","fa-magic":"\uf0d0","fa-magnet":"\uf076","fa-mail-forward":"\uf064","fa-mail-reply":"\uf112","fa-mail-reply-all":"\uf122","fa-male":"\uf183","fa-map":"\uf279","fa-map-marker":"\uf041","fa-map-o":"\uf278","fa-map-pin":"\uf276","fa-map-signs":"\uf277","fa-mars":"\uf222","fa-mars-double":"\uf227","fa-mars-stroke":"\uf229","fa-mars-stroke-h":"\uf22b","fa-mars-stroke-v":"\uf22a","fa-maxcdn":"\uf136","fa-meanpath":"\uf20c","fa-medium":"\uf23a","fa-medkit":"\uf0fa","fa-meh-o":"\uf11a","fa-mercury":"\uf223","fa-microphone":"\uf130","fa-microphone-slash":"\uf131","fa-minus":"\uf068","fa-minus-circle":"\uf056","fa-minus-square":"\uf146","fa-minus-square-o":"\uf147","fa-mobile":"\uf10b","fa-mobile-phone":"\uf10b","fa-money":"\uf0d6","fa-moon-o":"\uf186","fa-mortar-board":"\uf19d","fa-motorcycle":"\uf21c","fa-mouse-pointer":"\uf245","fa-music":"\uf001","fa-navicon":"\uf0c9","fa-neuter":"\uf22c","fa-newspaper-o":"\uf1ea","fa-object-group":"\uf247","fa-object-ungroup":"\uf248","fa-odnoklassniki":"\uf263","fa-odnoklassniki-square":"\uf264","fa-opencart":"\uf23d","fa-openid":"\uf19b","fa-opera":"\uf26a","fa-optin-monster":"\uf23c","fa-outdent":"\uf03b","fa-pagelines":"\uf18c","fa-paint-brush":"\uf1fc","fa-paper-plane":"\uf1d8","fa-paper-plane-o":"\uf1d9","fa-paperclip":"\uf0c6","fa-paragraph":"\uf1dd","fa-paste":"\uf0ea","fa-pause":"\uf04c","fa-paw":"\uf1b0","fa-paypal":"\uf1ed","fa-pencil":"\uf040","fa-pencil-square":"\uf14b","fa-pencil-square-o":"\uf044","fa-phone":"\uf095","fa-phone-square":"\uf098","fa-photo":"\uf03e","fa-picture-o":"\uf03e","fa-pie-chart":"\uf200","fa-pied-piper":"\uf1a7","fa-pied-piper-alt":"\uf1a8","fa-pinterest":"\uf0d2","fa-pinterest-p":"\uf231","fa-pinterest-square":"\uf0d3","fa-plane":"\uf072","fa-play":"\uf04b","fa-play-circle":"\uf144","fa-play-circle-o":"\uf01d","fa-plug":"\uf1e6","fa-plus":"\uf067","fa-plus-circle":"\uf055","fa-plus-square":"\uf0fe","fa-plus-square-o":"\uf196","fa-power-off":"\uf011","fa-print":"\uf02f","fa-puzzle-piece":"\uf12e","fa-qq":"\uf1d6","fa-qrcode":"\uf029","fa-question":"\uf128","fa-question-circle":"\uf059","fa-quote-left":"\uf10d","fa-quote-right":"\uf10e","fa-ra":"\uf1d0","fa-random":"\uf074","fa-rebel":"\uf1d0","fa-recycle":"\uf1b8","fa-reddit":"\uf1a1","fa-reddit-square":"\uf1a2","fa-refresh":"\uf021","fa-registered":"\uf25d","fa-remove":"\uf00d","fa-renren":"\uf18b","fa-reorder":"\uf0c9","fa-repeat":"\uf01e","fa-reply":"\uf112","fa-reply-all":"\uf122","fa-retweet":"\uf079","fa-rmb":"\uf157","fa-road":"\uf018","fa-rocket":"\uf135","fa-rotate-left":"\uf0e2","fa-rotate-right":"\uf01e","fa-rouble":"\uf158","fa-rss":"\uf09e","fa-rss-square":"\uf143","fa-rub":"\uf158","fa-ruble":"\uf158","fa-rupee":"\uf156","fa-safari":"\uf267","fa-save":"\uf0c7","fa-scissors":"\uf0c4","fa-search":"\uf002","fa-search-minus":"\uf010","fa-search-plus":"\uf00e","fa-sellsy":"\uf213","fa-send":"\uf1d8","fa-send-o":"\uf1d9","fa-server":"\uf233","fa-share":"\uf064","fa-share-alt":"\uf1e0","fa-share-alt-square":"\uf1e1","fa-share-square":"\uf14d","fa-share-square-o":"\uf045","fa-shekel":"\uf20b","fa-sheqel":"\uf20b","fa-shield":"\uf132","fa-ship":"\uf21a","fa-shirtsinbulk":"\uf214","fa-shopping-cart":"\uf07a","fa-sign-in":"\uf090","fa-sign-out":"\uf08b","fa-signal":"\uf012","fa-simplybuilt":"\uf215","fa-sitemap":"\uf0e8","fa-skyatlas":"\uf216","fa-skype":"\uf17e","fa-slack":"\uf198","fa-sliders":"\uf1de","fa-slideshare":"\uf1e7","fa-smile-o":"\uf118","fa-soccer-ball-o":"\uf1e3","fa-sort":"\uf0dc","fa-sort-alpha-asc":"\uf15d","fa-sort-alpha-desc":"\uf15e","fa-sort-amount-asc":"\uf160","fa-sort-amount-desc":"\uf161","fa-sort-asc":"\uf0de","fa-sort-desc":"\uf0dd","fa-sort-down":"\uf0dd","fa-sort-numeric-asc":"\uf162","fa-sort-numeric-desc":"\uf163","fa-sort-up":"\uf0de","fa-soundcloud":"\uf1be","fa-space-shuttle":"\uf197","fa-spinner":"\uf110","fa-spoon":"\uf1b1","fa-spotify":"\uf1bc","fa-square":"\uf0c8","fa-square-o":"\uf096","fa-stack-exchange":"\uf18d","fa-stack-overflow":"\uf16c","fa-star":"\uf005","fa-star-half":"\uf089","fa-star-half-empty":"\uf123","fa-star-half-full":"\uf123","fa-star-half-o":"\uf123","fa-star-o":"\uf006","fa-steam":"\uf1b6","fa-steam-square":"\uf1b7","fa-step-backward":"\uf048","fa-step-forward":"\uf051","fa-stethoscope":"\uf0f1","fa-sticky-note":"\uf249","fa-sticky-note-o":"\uf24a","fa-stop":"\uf04d","fa-street-view":"\uf21d","fa-strikethrough":"\uf0cc","fa-stumbleupon":"\uf1a4","fa-stumbleupon-circle":"\uf1a3","fa-subscript":"\uf12c","fa-subway":"\uf239","fa-suitcase":"\uf0f2","fa-sun-o":"\uf185","fa-superscript":"\uf12b","fa-support":"\uf1cd","fa-table":"\uf0ce","fa-tablet":"\uf10a","fa-tachometer":"\uf0e4","fa-tag":"\uf02b","fa-tags":"\uf02c","fa-tasks":"\uf0ae","fa-taxi":"\uf1ba","fa-television":"\uf26c","fa-tencent-weibo":"\uf1d5","fa-terminal":"\uf120","fa-text-height":"\uf034","fa-text-width":"\uf035","fa-th":"\uf00a","fa-th-large":"\uf009","fa-th-list":"\uf00b","fa-thumb-tack":"\uf08d","fa-thumbs-down":"\uf165","fa-thumbs-o-down":"\uf088","fa-thumbs-o-up":"\uf087","fa-thumbs-up":"\uf164","fa-ticket":"\uf145","fa-times":"\uf00d","fa-times-circle":"\uf057","fa-times-circle-o":"\uf05c","fa-tint":"\uf043","fa-toggle-down":"\uf150","fa-toggle-left":"\uf191","fa-toggle-off":"\uf204","fa-toggle-on":"\uf205","fa-toggle-right":"\uf152","fa-toggle-up":"\uf151","fa-trademark":"\uf25c","fa-train":"\uf238","fa-transgender":"\uf224","fa-transgender-alt":"\uf225","fa-trash":"\uf1f8","fa-trash-o":"\uf014","fa-tree":"\uf1bb","fa-trello":"\uf181","fa-tripadvisor":"\uf262","fa-trophy":"\uf091","fa-truck":"\uf0d1","fa-try":"\uf195","fa-tty":"\uf1e4","fa-tumblr":"\uf173","fa-tumblr-square":"\uf174","fa-turkish-lira":"\uf195","fa-tv":"\uf26c","fa-twitch":"\uf1e8","fa-twitter":"\uf099","fa-twitter-square":"\uf081","fa-umbrella":"\uf0e9","fa-underline":"\uf0cd","fa-undo":"\uf0e2","fa-university":"\uf19c","fa-unlink":"\uf127","fa-unlock":"\uf09c","fa-unlock-alt":"\uf13e","fa-unsorted":"\uf0dc","fa-upload":"\uf093","fa-usd":"\uf155","fa-user":"\uf007","fa-user-md":"\uf0f0","fa-user-plus":"\uf234","fa-user-secret":"\uf21b","fa-user-times":"\uf235","fa-users":"\uf0c0","fa-venus":"\uf221","fa-venus-double":"\uf226","fa-venus-mars":"\uf228","fa-viacoin":"\uf237","fa-video-camera":"\uf03d","fa-vimeo":"\uf27d","fa-vimeo-square":"\uf194","fa-vine":"\uf1ca","fa-vk":"\uf189","fa-volume-down":"\uf027","fa-volume-off":"\uf026","fa-volume-up":"\uf028","fa-warning":"\uf071","fa-wechat":"\uf1d7","fa-weibo":"\uf18a","fa-weixin":"\uf1d7","fa-whatsapp":"\uf232","fa-wheelchair":"\uf193","fa-wifi":"\uf1eb","fa-wikipedia-w":"\uf266","fa-windows":"\uf17a","fa-won":"\uf159","fa-wordpress":"\uf19a","fa-wrench":"\uf0ad","fa-xing":"\uf168","fa-xing-square":"\uf169","fa-y-combinator":"\uf23b","fa-y-combinator-square":"\uf1d4","fa-yahoo":"\uf19e","fa-yc":"\uf23b","fa-yc-square":"\uf1d4","fa-yelp":"\uf1e9","fa-yen":"\uf157","fa-youtube":"\uf167","fa-youtube-play":"\uf16a","fa-youtube-square":"\uf166"};
		var FONT_OPENAUTOMATION = {"oa-weather_winter":"\ue600","oa-weather_wind_speed":"\ue601","oa-weather_wind_directions_w":"\ue602","oa-weather_wind_directions_sw":"\ue603","oa-weather_wind_directions_se":"\ue604","oa-weather_wind_directions_s":"\ue605","oa-weather_wind_directions_nw":"\ue606","oa-weather_wind_directions_ne":"\ue607","oa-weather_wind_directions_n":"\ue608","oa-weather_wind_directions_e":"\ue609","oa-weather_wind":"\ue60a","oa-weather_thunderstorm":"\ue60b","oa-weather_sunset":"\ue60c","oa-weather_sunrise":"\ue60d","oa-weather_sun":"\ue60e","oa-weather_summer":"\ue60f","oa-weather_storm":"\ue610","oa-weather_station_quadra":"\ue611","oa-weather_station":"\ue612","oa-weather_snow_light":"\ue613","oa-weather_snow_heavy":"\ue614","oa-weather_snow":"\ue615","oa-weather_rain_meter":"\ue616","oa-weather_rain_light":"\ue617","oa-weather_rain_heavy":"\ue618","oa-weather_rain_gauge":"\ue619","oa-weather_rain":"\ue61a","oa-weather_pollen":"\ue61b","oa-weather_moonset":"\ue61c","oa-weather_moonrise":"\ue61d","oa-weather_moon_phases_8":"\ue61e","oa-weather_moon_phases_7_half":"\ue61f","oa-weather_moon_phases_6":"\ue620","oa-weather_moon_phases_5_full":"\ue621","oa-weather_moon_phases_4":"\ue622","oa-weather_moon_phases_3_half":"\ue623","oa-weather_moon_phases_2":"\ue624","oa-weather_moon_phases_1_new":"\ue625","oa-weather_light_meter":"\ue626","oa-weather_humidity":"\ue627","oa-weather_frost":"\ue628","oa-weather_directions":"\ue629","oa-weather_cloudy_light":"\ue62a","oa-weather_cloudy_heavy":"\ue62b","oa-weather_cloudy":"\ue62c","oa-weather_barometric_pressure":"\ue62d","oa-weather_baraometric_pressure":"\ue62e","oa-vent_ventilation_level_manual_m":"\ue62f","oa-vent_ventilation_level_automatic":"\ue630","oa-vent_ventilation_level_3":"\ue631","oa-vent_ventilation_level_2":"\ue632","oa-vent_ventilation_level_1":"\ue633","oa-vent_ventilation_level_0":"\ue634","oa-vent_ventilation_control":"\ue635","oa-vent_ventilation":"\ue636","oa-vent_used_air":"\ue637","oa-vent_supply_air":"\ue638","oa-vent_exhaust_air":"\ue639","oa-vent_bypass":"\ue63a","oa-vent_ambient_air":"\ue63b","oa-user_ext_away":"\ue63c","oa-user_away":"\ue63d","oa-user_available":"\ue63e","oa-time_timer":"\ue63f","oa-time_statistic":"\ue640","oa-time_note":"\ue641","oa-time_manual_mode":"\ue642","oa-time_graph":"\ue643","oa-time_eco_mode":"\ue644","oa-time_clock":"\ue645","oa-time_calendar":"\ue646","oa-time_automatic":"\ue647","oa-text_min":"\ue648","oa-text_max":"\ue649","oa-temp_windchill":"\ue64a","oa-temp_temperature_min":"\ue64b","oa-temp_temperature_max":"\ue64c","oa-temp_temperature":"\ue64d","oa-temp_outside":"\ue64e","oa-temp_inside":"\ue64f","oa-temp_frost":"\ue650","oa-temp_control":"\ue651","oa-status_standby":"\ue652","oa-status_open":"\ue653","oa-status_night":"\ue654","oa-status_locked":"\ue655","oa-status_frost":"\ue656","oa-status_comfort":"\ue657","oa-status_away_2":"\ue658","oa-status_away_1":"\ue659","oa-status_available":"\ue65a","oa-status_automatic":"\ue65b","oa-secur_smoke_detector":"\ue65c","oa-secur_open":"\ue65d","oa-secur_locked":"\ue65e","oa-secur_heat_protection":"\ue65f","oa-secur_frost_protection":"\ue660","oa-secur_encoding":"\ue661","oa-secur_alarm":"\ue662","oa-scene_x-mas":"\ue663","oa-scene_workshop":"\ue664","oa-scene_wine_cellar":"\ue665","oa-scene_washing_machine":"\ue666","oa-scene_visit_guests":"\ue667","oa-scene_toilet_alternat":"\ue668","oa-scene_toilet":"\ue669","oa-scene_terrace":"\ue66a","oa-scene_swimming":"\ue66b","oa-scene_summerhouse":"\ue66c","oa-scene_stove":"\ue66d","oa-scene_storeroom":"\ue66e","oa-scene_stairs":"\ue66f","oa-scene_sleeping_alternat":"\ue670","oa-scene_sleeping":"\ue671","oa-scene_shower":"\ue672","oa-scene_scene":"\ue673","oa-scene_sauna":"\ue674","oa-scene_robo_lawnmower":"\ue675","oa-scene_pool":"\ue676","oa-scene_party":"\ue677","oa-scene_office":"\ue678","oa-scene_night":"\ue679","oa-scene_microwave_oven":"\ue67a","oa-scene_making_love_clean":"\ue67b","oa-scene_making_love":"\ue67c","oa-scene_livingroom":"\ue67d","oa-scene_laundry_room_fem":"\ue67e","oa-scene_laundry_room":"\ue67f","oa-scene_keyboard":"\ue680","oa-scene_hall":"\ue681","oa-scene_garden":"\ue682","oa-scene_gaming":"\ue683","oa-scene_fitness":"\ue684","oa-scene_dressing_room":"\ue685","oa-scene_dishwasher":"\ue686","oa-scene_dinner":"\ue687","oa-scene_day":"\ue688","oa-scene_cubby":"\ue689","oa-scene_cooking":"\ue68a","oa-scene_cockle_stove":"\ue68b","oa-scene_clothes_dryer":"\ue68c","oa-scene_cleaning":"\ue68d","oa-scene_cinema":"\ue68e","oa-scene_childs_room":"\ue68f","oa-scene_bathroom":"\ue690","oa-scene_bath":"\ue691","oa-scene_baking_oven":"\ue692","oa-scene_baby":"\ue693","oa-sani_water_tap":"\ue694","oa-sani_water_hot":"\ue695","oa-sani_water_cold":"\ue696","oa-sani_supply_temp":"\ue697","oa-sani_sprinkling":"\ue698","oa-sani_solar_temp":"\ue699","oa-sani_solar":"\ue69a","oa-sani_return_temp":"\ue69b","oa-sani_pump":"\ue69c","oa-sani_irrigation":"\ue69d","oa-sani_heating_temp":"\ue69e","oa-sani_heating_manual":"\ue69f","oa-sani_heating_automatic":"\ue6a0","oa-sani_heating":"\ue6a1","oa-sani_garden_pump":"\ue6a2","oa-sani_floor_heating":"\ue6a3","oa-sani_earth_source_heat_pump":"\ue6a4","oa-sani_domestic_waterworks":"\ue6a5","oa-sani_buffer_temp_up":"\ue6a6","oa-sani_buffer_temp_down":"\ue6a7","oa-sani_buffer_temp_all":"\ue6a8","oa-sani_boiler_temp":"\ue6a9","oa-phone_ring_out":"\ue6aa","oa-phone_ring_in":"\ue6ab","oa-phone_ring":"\ue6ac","oa-phone_missed_out":"\ue6ad","oa-phone_missed_in":"\ue6ae","oa-phone_dial":"\ue6af","oa-phone_call_out":"\ue6b0","oa-phone_call_in":"\ue6b1","oa-phone_call_end_out":"\ue6b2","oa-phone_call_end_in":"\ue6b3","oa-phone_call_end":"\ue6b4","oa-phone_call":"\ue6b5","oa-phone_answersing":"\ue6b6","oa-message_tendency_upward":"\ue6b7","oa-message_tendency_steady":"\ue6b8","oa-message_tendency_downward":"\ue6b9","oa-message_socket_on_off":"\ue6ba","oa-message_socket_ch_3":"\ue6bb","oa-message_socket_ch":"\ue6bc","oa-message_socket":"\ue6bd","oa-message_service":"\ue6be","oa-message_presence_disabled":"\ue6bf","oa-message_presence":"\ue6c0","oa-message_ok":"\ue6c1","oa-message_medicine":"\ue6c2","oa-message_mail_open":"\ue6c3","oa-message_mail":"\ue6c4","oa-message_light_intensity":"\ue6c5","oa-message_garbage":"\ue6c6","oa-message_attention":"\ue6c7","oa-measure_water_meter":"\ue6c8","oa-measure_voltage":"\ue6c9","oa-measure_power_meter":"\ue6ca","oa-measure_power":"\ue6cb","oa-measure_photovoltaic_inst":"\ue6cc","oa-measure_current":"\ue6cd","oa-measure_battery_100":"\ue6ce","oa-measure_battery_75":"\ue6cf","oa-measure_battery_50":"\ue6d0","oa-measure_battery_25":"\ue6d1","oa-measure_battery_0":"\ue6d2","oa-light_wire_system_2":"\ue6d3","oa-light_wire_system_1":"\ue6d4","oa-light_wall_3":"\ue6d5","oa-light_wall_2":"\ue6d6","oa-light_wall_1":"\ue6d7","oa-light_uplight":"\ue6d8","oa-light_stairs":"\ue6d9","oa-light_pendant_light_round":"\ue6da","oa-light_pendant_light":"\ue6db","oa-light_party":"\ue6dc","oa-light_outdoor":"\ue6dd","oa-light_office_desk":"\ue6de","oa-light_office":"\ue6df","oa-light_mirror":"\ue6e0","oa-light_light_dim_100":"\ue6e1","oa-light_light_dim_90":"\ue6e2","oa-light_light_dim_80":"\ue6e3","oa-light_light_dim_70":"\ue6e4","oa-light_light_dim_60":"\ue6e5","oa-light_light_dim_50":"\ue6e6","oa-light_light_dim_40":"\ue6e7","oa-light_light_dim_30":"\ue6e8","oa-light_light_dim_20":"\ue6e9","oa-light_light_dim_10":"\ue6ea","oa-light_light_dim_00":"\ue6eb","oa-light_light":"\ue6ec","oa-light_led_stripe_rgb":"\ue6ed","oa-light_led_stripe":"\ue6ee","oa-light_led":"\ue6ef","oa-light_floor_lamp":"\ue6f0","oa-light_fairy_lights":"\ue6f1","oa-light_downlight":"\ue6f2","oa-light_dinner_table":"\ue6f3","oa-light_diffused":"\ue6f4","oa-light_control":"\ue6f5","oa-light_ceiling_light":"\ue6f6","oa-light_cabinet":"\ue6f7","oa-it_wireless_dcf77":"\ue6f8","oa-it_wifi":"\ue6f9","oa-it_television":"\ue6fa","oa-it_telephone":"\ue6fb","oa-it_smartphone":"\ue6fc","oa-it_server":"\ue6fd","oa-it_satellite_dish_heating":"\ue6fe","oa-it_satellite_dish":"\ue6ff","oa-it_router":"\ue700","oa-it_remote":"\ue701","oa-it_radio":"\ue702","oa-it_pc":"\ue703","oa-it_network":"\ue704","oa-it_net":"\ue705","oa-it_nas":"\ue706","oa-it_internet":"\ue707","oa-it_fax":"\ue708","oa-it_camera":"\ue709","oa-fts_window_roof_shutter":"\ue70a","oa-fts_window_roof_open_2":"\ue70b","oa-fts_window_roof_open_1":"\ue70c","oa-fts_window_roof":"\ue70d","oa-fts_window_louvre_open":"\ue70e","oa-fts_window_louvre":"\ue70f","oa-fts_window_2w_tilt_r":"\ue710","oa-fts_window_2w_tilt_lr":"\ue711","oa-fts_window_2w_tilt_l_open_r":"\ue712","oa-fts_window_2w_tilt_l":"\ue713","oa-fts_window_2w_tilt":"\ue714","oa-fts_window_2w_open_r":"\ue715","oa-fts_window_2w_open_lr":"\ue716","oa-fts_window_2w_open_l_tilt_r":"\ue717","oa-fts_window_2w_open_l":"\ue718","oa-fts_window_2w_open":"\ue719","oa-fts_window_2w":"\ue71a","oa-fts_window_1w_tilt":"\ue71b","oa-fts_window_1w_open":"\ue71c","oa-fts_window_1w":"\ue71d","oa-fts_sunblind":"\ue71e","oa-fts_sliding_gate":"\ue71f","oa-fts_shutter_up":"\ue720","oa-fts_shutter_manual":"\ue721","oa-fts_shutter_down":"\ue722","oa-fts_shutter_automatic":"\ue723","oa-fts_shutter_100":"\ue724","oa-fts_shutter_90":"\ue725","oa-fts_shutter_80":"\ue726","oa-fts_shutter_70":"\ue727","oa-fts_shutter_60":"\ue728","oa-fts_shutter_50":"\ue729","oa-fts_shutter_40":"\ue72a","oa-fts_shutter_30":"\ue72b","oa-fts_shutter_20":"\ue72c","oa-fts_shutter_10":"\ue72d","oa-fts_shutter":"\ue72e","oa-fts_light_dome_open":"\ue72f","oa-fts_light_dome":"\ue730","oa-fts_garage_door_100":"\ue731","oa-fts_garage_door_90":"\ue732","oa-fts_garage_door_80":"\ue733","oa-fts_garage_door_70":"\ue734","oa-fts_garage_door_60":"\ue735","oa-fts_garage_door_50":"\ue736","oa-fts_garage_door_40":"\ue737","oa-fts_garage_door_30":"\ue738","oa-fts_garage_door_20":"\ue739","oa-fts_garage_door_10":"\ue73a","oa-fts_garage":"\ue73b","oa-fts_door_slide_open_m":"\ue73c","oa-fts_door_slide_open":"\ue73d","oa-fts_door_slide_m":"\ue73e","oa-fts_door_slide_2w_open_r":"\ue73f","oa-fts_door_slide_2w_open_lr":"\ue740","oa-fts_door_slide_2w_open_l":"\ue741","oa-fts_door_slide_2w":"\ue742","oa-fts_door_slide":"\ue743","oa-fts_door_open":"\ue744","oa-fts_door":"\ue745","oa-fts_blade_z_sun":"\ue746","oa-fts_blade_z":"\ue747","oa-fts_blade_s_sun":"\ue748","oa-fts_blade_s":"\ue749","oa-fts_blade_arc_sun":"\ue74a","oa-fts_blade_arc_close_100":"\ue74b","oa-fts_blade_arc_close_50":"\ue74c","oa-fts_blade_arc_close_00":"\ue74d","oa-fts_blade_arc":"\ue74e","oa-edit_sort":"\ue74f","oa-edit_settings":"\ue750","oa-edit_save":"\ue751","oa-edit_paste":"\ue752","oa-edit_open":"\ue753","oa-edit_expand":"\ue754","oa-edit_delete":"\ue755","oa-edit_cut":"\ue756","oa-edit_copy":"\ue757","oa-edit_collapse":"\ue758","oa-control_zoom_out":"\ue759","oa-control_zoom_in":"\ue75a","oa-control_x":"\ue75b","oa-control_standby":"\ue75c","oa-control_return":"\ue75d","oa-control_reboot":"\ue75e","oa-control_plus":"\ue75f","oa-control_outside_on_off":"\ue760","oa-control_on_off":"\ue761","oa-control_minus":"\ue762","oa-control_home":"\ue763","oa-control_centr_arrow_up_right":"\ue764","oa-control_centr_arrow_up_left":"\ue765","oa-control_centr_arrow_up":"\ue766","oa-control_centr_arrow_right":"\ue767","oa-control_centr_arrow_left":"\ue768","oa-control_centr_arrow_down_right":"\ue769","oa-control_centr_arrow_down_left":"\ue76a","oa-control_centr_arrow_down":"\ue76b","oa-control_building_s_og":"\ue76c","oa-control_building_s_kg":"\ue76d","oa-control_building_s_eg":"\ue76e","oa-control_building_s_dg":"\ue76f","oa-control_building_s_all":"\ue770","oa-control_building_outside":"\ue771","oa-control_building_og":"\ue772","oa-control_building_modern_s_okg_og":"\ue773","oa-control_building_modern_s_okg_eg":"\ue774","oa-control_building_modern_s_okg_dg":"\ue775","oa-control_building_modern_s_okg_all":"\ue776","oa-control_building_modern_s_og":"\ue777","oa-control_building_modern_s_kg":"\ue778","oa-control_building_modern_s_eg":"\ue779","oa-control_building_modern_s_dg":"\ue77a","oa-control_building_modern_s_all":"\ue77b","oa-control_building_modern_s_2og_og2":"\ue77c","oa-control_building_modern_s_2og_og1":"\ue77d","oa-control_building_modern_s_2og_kg":"\ue77e","oa-control_building_modern_s_2og_eg":"\ue77f","oa-control_building_modern_s_2og_dg":"\ue780","oa-control_building_modern_s_2og_all":"\ue781","oa-control_building_kg":"\ue782","oa-control_building_filled":"\ue783","oa-control_building_empty":"\ue784","oa-control_building_eg":"\ue785","oa-control_building_dg":"\ue786","oa-control_building_control":"\ue787","oa-control_building_all":"\ue788","oa-control_building_2_s_kg":"\ue789","oa-control_building_2_s_eg":"\ue78a","oa-control_building_2_s_dg":"\ue78b","oa-control_building_2_s_all":"\ue78c","oa-control_arrow_upward":"\ue78d","oa-control_arrow_up_right":"\ue78e","oa-control_arrow_up_left":"\ue78f","oa-control_arrow_up":"\ue790","oa-control_arrow_turn_right":"\ue791","oa-control_arrow_turn_left":"\ue792","oa-control_arrow_rightward":"\ue793","oa-control_arrow_right":"\ue794","oa-control_arrow_leftward":"\ue795","oa-control_arrow_left":"\ue796","oa-control_arrow_downward":"\ue797","oa-control_arrow_down_right":"\ue798","oa-control_arrow_down_left":"\ue799","oa-control_arrow_down":"\ue79a","oa-control_all_on_off":"\ue79b","oa-control_4":"\ue79c","oa-control_3":"\ue79d","oa-control_2":"\ue79e","oa-control_1":"\ue79f","oa-audio_volume_mute":"\ue7a0","oa-audio_volume_mid":"\ue7a1","oa-audio_volume_low":"\ue7a2","oa-audio_volume_high":"\ue7a3","oa-audio_stop":"\ue7a4","oa-audio_sound":"\ue7a5","oa-audio_shuffle":"\ue7a6","oa-audio_rew":"\ue7a7","oa-audio_repeat":"\ue7a8","oa-audio_rec":"\ue7a9","oa-audio_playlist":"\ue7aa","oa-audio_play":"\ue7ab","oa-audio_pause":"\ue7ac","oa-audio_mic_mute":"\ue7ad","oa-audio_mic":"\ue7ae","oa-audio_loudness":"\ue7af","oa-audio_headphone":"\ue7b0","oa-audio_ff":"\ue7b1","oa-audio_fade":"\ue7b2","oa-audio_eq":"\ue7b3","oa-audio_eject":"\ue7b4","oa-audio_audio":"\ue7b5"};
		var FONT_FHEMSVG = {"fs-user_unknown":"\ue600","fs-usb_stick":"\ue601","fs-usb":"\ue602","fs-unlock":"\ue603","fs-unknown":"\ue604","fs-temperature_humidity":"\ue605","fs-taster_ch6_6":"\ue606","fs-taster_ch6_5":"\ue607","fs-taster_ch6_4":"\ue608","fs-taster_ch6_3":"\ue609","fs-taster_ch6_2":"\ue60a","fs-taster_ch6_1":"\ue60b","fs-taster_ch_aus_rot .path1":"\ue60c","fs-taster_ch_aus_rot .path2":"\ue60d","fs-taster_ch_aus_rot .path3":"\ue60e","fs-taster_ch_aus_rot .path4":"\ue60f","fs-taster_ch_aus_rot .path5":"\ue610","fs-taster_ch_aus_rot .path6":"\ue611","fs-taster_ch_an_gruen .path1":"\ue612","fs-taster_ch_an_gruen .path2":"\ue613","fs-taster_ch_an_gruen .path3":"\ue614","fs-taster_ch_an_gruen .path4":"\ue615","fs-taster_ch_an_gruen .path5":"\ue616","fs-taster_ch_2":"\ue617","fs-taster_ch_1":"\ue618","fs-taster_ch":"\ue619","fs-taster":"\ue61a","fs-system_fhem_update":"\ue61b","fs-system_fhem_reboot":"\ue61c","fs-system_fhem":"\ue61d","fs-system_backup":"\ue61e","fs-socket_timer":"\ue61f","fs-security_password":"\ue620","fs-security":"\ue621","fs-sdcard":"\ue622","fs-scc_868":"\ue623","fs-sani_heating_timer":"\ue624","fs-sani_heating_level_100":"\ue625","fs-sani_heating_level_90":"\ue626","fs-sani_heating_level_80":"\ue627","fs-sani_heating_level_70":"\ue628","fs-sani_heating_level_60":"\ue629","fs-sani_heating_level_50":"\ue62a","fs-sani_heating_level_40":"\ue62b","fs-sani_heating_level_30":"\ue62c","fs-sani_heating_level_20":"\ue62d","fs-sani_heating_level_10":"\ue62e","fs-sani_heating_level_0":"\ue62f","fs-sani_heating_calendar":"\ue630","fs-sani_heating_boost":"\ue631","fs-sani_floor_heating_off":"\ue632","fs-sani_floor_heating_neutral":"\ue633","fs-RPi .path1":"\ue634","fs-RPi .path2":"\ue635","fs-RPi .path3":"\ue636","fs-RPi .path4":"\ue637","fs-RPi .path5":"\ue638","fs-RPi .path6":"\ue639","fs-RPi .path7":"\ue63a","fs-RPi .path8":"\ue63b","fs-RPi .path9":"\ue63c","fs-RPi .path10":"\ue63d","fs-RPi .path11":"\ue63e","fs-RPi .path12":"\ue63f","fs-RPi .path13":"\ue640","fs-RPi .path14":"\ue641","fs-RPi .path15":"\ue642","fs-RPi .path16":"\ue643","fs-RPi .path17":"\ue644","fs-RPi .path18":"\ue645","fs-RPi .path19":"\ue646","fs-RPi .path20":"\ue647","fs-RPi .path21":"\ue648","fs-remote_control":"\ue649","fs-refresh":"\ue64a","fs-recycling":"\ue64b","fs-rc_YELLOW .path1":"\ue64c","fs-rc_YELLOW .path2":"\ue64d","fs-rc_WEB":"\ue64e","fs-rc_VOLUP":"\ue64f","fs-rc_VOLPLUS":"\ue650","fs-rc_VOLMINUS":"\ue651","fs-rc_VOLDOWN":"\ue652","fs-rc_VIDEO":"\ue653","fs-rc_USB":"\ue654","fs-rc_UP":"\ue655","fs-rc_TVstop":"\ue656","fs-rc_TV":"\ue657","fs-rc_TEXT":"\ue658","fs-rc_templatebutton":"\ue659","fs-rc_SUB":"\ue65a","fs-rc_STOP":"\ue65b","fs-rc_SHUFFLE":"\ue65c","fs-rc_SETUP":"\ue65d","fs-rc_SEARCH":"\ue65e","fs-rc_RIGHT":"\ue65f","fs-rc_REWred":"\ue660","fs-rc_REW":"\ue661","fs-rc_REPEAT":"\ue662","fs-rc_RED .path1":"\ue663","fs-rc_RED .path2":"\ue664","fs-rc_REC .path1":"\ue665","fs-rc_REC .path2":"\ue666","fs-rc_RADIOred":"\ue667","fs-rc_RADIO":"\ue668","fs-rc_PREVIOUS":"\ue669","fs-rc_POWER":"\ue66a","fs-rc_PLUS":"\ue66b","fs-rc_PLAYgreen":"\ue66c","fs-rc_PLAY":"\ue66d","fs-rc_PAUSEyellow":"\ue66e","fs-rc_PAUSE":"\ue66f","fs-rc_OPTIONS":"\ue670","fs-rc_OK":"\ue671","fs-rc_NEXT":"\ue672","fs-rc_MUTE":"\ue673","fs-rc_MINUS":"\ue674","fs-rc_MENU":"\ue675","fs-rc_MEDIAMENU":"\ue676","fs-rc_LEFT":"\ue677","fs-rc_INFO":"\ue678","fs-rc_HOME":"\ue679","fs-rc_HELP":"\ue67a","fs-rc_HDMI":"\ue67b","fs-rc_GREEN .path1":"\ue67c","fs-rc_GREEN .path2":"\ue67d","fs-rc_FFblue":"\ue67e","fs-rc_FF":"\ue67f","fs-rc_EXIT":"\ue680","fs-rc_EPG":"\ue681","fs-rc_EJECT":"\ue682","fs-rc_DOWN":"\ue683","fs-rc_dot":"\ue684","fs-rc_BLUE .path1":"\ue685","fs-rc_BLUE .path2":"\ue686","fs-rc_BLANK":"\ue687","fs-rc_BACK":"\ue688","fs-rc_AV":"\ue689","fs-rc_AUDIO":"\ue68a","fs-rc_9":"\ue68b","fs-rc_8":"\ue68c","fs-rc_7":"\ue68d","fs-rc_6":"\ue68e","fs-rc_5":"\ue68f","fs-rc_4":"\ue690","fs-rc_3":"\ue691","fs-rc_2":"\ue692","fs-rc_1":"\ue693","fs-rc_0":"\ue694","fs-people_sensor":"\ue695","fs-outside_socket":"\ue696","fs-motion_detector":"\ue697","fs-message_socket_unknown":"\ue698","fs-message_socket_on2":"\ue699","fs-message_socket_off2":"\ue69a","fs-message_socket_off":"\ue69b","fs-message_socket_enabled":"\ue69c","fs-message_socket_disabled":"\ue69d","fs-max_wandthermostat":"\ue69e","fs-max_heizungsthermostat":"\ue69f","fs-lock":"\ue6a0","fs-light_toggle":"\ue6a1","fs-light_question .path1":"\ue6a2","fs-light_question .path2":"\ue6a3","fs-light_question .path3":"\ue6a4","fs-light_question .path4":"\ue6a5","fs-light_question .path5":"\ue6a6","fs-light_question .path6":"\ue6a7","fs-light_outdoor":"\ue6a8","fs-light_on-for-timer":"\ue6a9","fs-light_off-for-timer":"\ue6aa","fs-light_exclamation .path1":"\ue6ab","fs-light_exclamation .path2":"\ue6ac","fs-light_exclamation .path3":"\ue6ad","fs-light_exclamation .path4":"\ue6ae","fs-light_exclamation .path5":"\ue6af","fs-light_exclamation .path6":"\ue6b0","fs-light_dim_up":"\ue6b1","fs-light_dim_down":"\ue6b2","fs-light_ceiling_off":"\ue6b3","fs-light_ceiling":"\ue6b4","fs-lan_rs485":"\ue6b5","fs-it_remote_folder .path1":"\ue6b6","fs-it_remote_folder .path2":"\ue6b7","fs-it_remote_folder .path3":"\ue6b8","fs-it_remote_folder .path4":"\ue6b9","fs-it_remote_folder .path5":"\ue6ba","fs-it_remote_folder .path6":"\ue6bb","fs-it_remote_folder .path7":"\ue6bc","fs-it_remote_folder .path8":"\ue6bd","fs-it_remote_folder .path9":"\ue6be","fs-it_remote_folder .path10":"\ue6bf","fs-it_remote_folder .path11":"\ue6c0","fs-it_remote_folder .path12":"\ue6c1","fs-it_remote_folder .path13":"\ue6c2","fs-it_remote_folder .path14":"\ue6c3","fs-it_remote_folder .path15":"\ue6c4","fs-it_remote_folder .path16":"\ue6c5","fs-it_remote_folder .path17":"\ue6c6","fs-it_remote_folder .path18":"\ue6c7","fs-it_remote_folder .path19":"\ue6c8","fs-it_remote_folder .path20":"\ue6c9","fs-it_remote_folder .path21":"\ue6ca","fs-it_i-net":"\ue6cb","fs-it_hue_bridge .path1":"\ue6cc","fs-it_hue_bridge .path2":"\ue6cd","fs-it_hue_bridge .path3":"\ue6ce","fs-it_hue_bridge .path4":"\ue6cf","fs-it_hue_bridge .path5":"\ue6d0","fs-it_hue_bridge .path6":"\ue6d1","fs-it_hue_bridge .path7":"\ue6d2","fs-it_hue_bridge .path8":"\ue6d3","fs-it_hue_bridge .path9":"\ue6d4","fs-it_hue_bridge .path10":"\ue6d5","fs-it_hue_bridge .path11":"\ue6d6","fs-it_hue_bridge .path12":"\ue6d7","fs-it_hue_bridge .path13":"\ue6d8","fs-it_hue_bridge .path14":"\ue6d9","fs-it_hue_bridge .path15":"\ue6da","fs-it_hue_bridge .path16":"\ue6db","fs-it_hue_bridge .path17":"\ue6dc","fs-it_hue_bridge .path18":"\ue6dd","fs-it_hue_bridge .path19":"\ue6de","fs-it_hue_bridge .path20":"\ue6df","fs-it_hue_bridge .path21":"\ue6e0","fs-it_hue_bridge .path22":"\ue6e1","fs-it_hue_bridge .path23":"\ue6e2","fs-IR":"\ue6e3","fs-Icon_Fisch":"\ue6e4","fs-humidity":"\ue6e5","fs-hue_bridge .path1":"\ue6e6","fs-hue_bridge .path2":"\ue6e7","fs-hue_bridge .path3":"\ue6e8","fs-hue_bridge .path4":"\ue6e9","fs-hue_bridge .path5":"\ue6ea","fs-hue_bridge .path6":"\ue6eb","fs-hue_bridge .path7":"\ue6ec","fs-hue_bridge .path8":"\ue6ed","fs-hue_bridge .path9":"\ue6ee","fs-hue_bridge .path10":"\ue6ef","fs-hue_bridge .path11":"\ue6f0","fs-hue_bridge .path12":"\ue6f1","fs-hue_bridge .path13":"\ue6f2","fs-hue_bridge .path14":"\ue6f3","fs-hue_bridge .path15":"\ue6f4","fs-hue_bridge .path16":"\ue6f5","fs-hue_bridge .path17":"\ue6f6","fs-hue_bridge .path18":"\ue6f7","fs-hue_bridge .path19":"\ue6f8","fs-hue_bridge .path20":"\ue6f9","fs-hue_bridge .path21":"\ue6fa","fs-hue_bridge .path22":"\ue6fb","fs-hue_bridge .path23":"\ue6fc","fs-hourglass":"\ue6fd","fs-hm-tc-it-wm-w-eu":"\ue6fe","fs-hm-dis-wm55":"\ue6ff","fs-hm-cc-rt-dn":"\ue700","fs-hm_lan":"\ue701","fs-hm_keymatic":"\ue702","fs-hm_ccu":"\ue703","fs-general_ok":"\ue704","fs-general_low":"\ue705","fs-general_aus_fuer_zeit":"\ue706","fs-general_aus":"\ue707","fs-general_an_fuer_zeit":"\ue708","fs-general_an":"\ue709","fs-garden_socket":"\ue70a","fs-fts_window_1wbb_open":"\ue70b","fs-fts_shutter_updown":"\ue70c","fs-fts_door_tilt":"\ue70d","fs-fts_door_right_open":"\ue70e","fs-fts_door_right":"\ue70f","fs-frost":"\ue710","fs-floor":"\ue711","fs-dustbin":"\ue712","fs-dreambox":"\ue713","fs-dog_silhouette":"\ue714","fs-DIN_rail_housing .path1":"\ue715","fs-DIN_rail_housing .path2":"\ue716","fs-DIN_rail_housing .path3":"\ue717","fs-DIN_rail_housing .path4":"\ue718","fs-DIN_rail_housing .path5":"\ue719","fs-DIN_rail_housing .path6":"\ue71a","fs-DIN_rail_housing .path7":"\ue71b","fs-DIN_rail_housing .path8":"\ue71c","fs-DIN_rail_housing .path9":"\ue71d","fs-DIN_rail_housing .path10":"\ue71e","fs-DIN_rail_housing .path11":"\ue71f","fs-DIN_rail_housing .path12":"\ue720","fs-DIN_rail_housing .path13":"\ue721","fs-DIN_rail_housing .path14":"\ue722","fs-DIN_rail_housing .path15":"\ue723","fs-DIN_rail_housing .path16":"\ue724","fs-DIN_rail_housing .path17":"\ue725","fs-DIN_rail_housing .path18":"\ue726","fs-DIN_rail_housing .path19":"\ue727","fs-DIN_rail_housing .path20":"\ue728","fs-DIN_rail_housing .path21":"\ue729","fs-DIN_rail_housing .path22":"\ue72a","fs-DIN_rail_housing .path23":"\ue72b","fs-DIN_rail_housing .path24":"\ue72c","fs-DIN_rail_housing .path25":"\ue72d","fs-DIN_rail_housing .path26":"\ue72e","fs-DIN_rail_housing .path27":"\ue72f","fs-DIN_rail_housing .path28":"\ue730","fs-DIN_rail_housing .path29":"\ue731","fs-DIN_rail_housing .path30":"\ue732","fs-DIN_rail_housing .path31":"\ue733","fs-DIN_rail_housing .path32":"\ue734","fs-DIN_rail_housing .path33":"\ue735","fs-DIN_rail_housing .path34":"\ue736","fs-DIN_rail_housing .path35":"\ue737","fs-DIN_rail_housing .path36":"\ue738","fs-DIN_rail_housing .path37":"\ue739","fs-DIN_rail_housing .path38":"\ue73a","fs-DIN_rail_housing .path39":"\ue73b","fs-DIN_rail_housing .path40":"\ue73c","fs-DIN_rail_housing .path41":"\ue73d","fs-DIN_rail_housing .path42":"\ue73e","fs-DIN_rail_housing .path43":"\ue73f","fs-DIN_rail_housing .path44":"\ue740","fs-DIN_rail_housing .path45":"\ue741","fs-DIN_rail_housing .path46":"\ue742","fs-DIN_rail_housing .path47":"\ue743","fs-DIN_rail_housing .path48":"\ue744","fs-DIN_rail_housing .path49":"\ue745","fs-day_night":"\ue746","fs-cul_usb":"\ue747","fs-cul_cul":"\ue748","fs-cul_868":"\ue749","fs-cul":"\ue74a","fs-christmas_tree":"\ue74b","fs-building_security":"\ue74c","fs-building_outside":"\ue74d","fs-building_carport_socket":"\ue74e","fs-building_carport_light":"\ue74f","fs-building_carport":"\ue750","fs-bluetooth":"\ue751","fs-batterie":"\ue752","fs-bag":"\ue753","fs-ampel_rot .path1":"\ue754","fs-ampel_rot .path2":"\ue755","fs-ampel_gruen .path1":"\ue756","fs-ampel_gruen .path2":"\ue757","fs-ampel_gelb .path1":"\ue758","fs-ampel_gelb .path2":"\ue759","fs-ampel_aus":"\ue75a","fs-alarm_system_password":"\ue75b","fs-access_keypad_2":"\ue75c","fs-access_keypad_1":"\ue75d"};
		//helper code for retrieving glyph information for FONT_AWESOME, not needed for normal operation
		
		/*var faCheatsLoaded = false;

		if (faPage === undefined) {
			var faPage = document.createElement("div");
			$(faPage).load('http://fortawesome.github.io/Font-Awesome/cheatsheet/ div.col-md-4.col-sm-6', function( response, status, xhr ) {
				for (var i=0, ll=faPage.childNodes.length; i<ll; i++) {
					var tc = faPage.childNodes[i].textContent;
					if (tc.indexOf('fa') >=0) {
						tc = tc.replace(/ /g, '');
						lines = tc.split('\n');
						sname = lines[3];
						sglyph = "\\u" + lines[5].substring(4, lines[5].indexOf(';'));
						FONT_AWESOME[sname]=sglyph;
					}
				}
				faCheatsLoaded = true;
			});
		} else
		{
			faCheatsLoaded = true;
		}
		
		waitForFaUnicodes();
		
		function waitForFaUnicodes() {
			setTimeout(function(){
				if (!faCheatsLoaded) {
					waitForFaUnicodes();
				}else{
					console.log(JSON.stringify(FONT_AWESOME));
				}
			},100);
		}*/

		var glyphs = name.split(' ');
		var ret = "";
		for (var i=0, ll=glyphs.length; i<ll; i++) {
			ret += (name.indexOf('fa-')>=0)?FONT_AWESOME[glyphs[i]]:(name.indexOf('fs-')>=0)?FONT_FHEMSVG[glyphs[i]]:FONT_OPENAUTOMATION[glyphs[i]];
		}
		return(ret);
	},
	precision: function(a) { // calculate number of fractional digits
		var s = a + "",
		d = s.indexOf('.') + 1;
		return !d ? 0 : s.length - d;
	},
	unescapeData: function(par) {
		if ($.isArray(par)) {
			$.each(par, function(ind,val) {
				window.unescape(val);
			});
		} else {
			window.unescape(par);
		}
	},
	checkAllData: function(obj,elem,dev,par,init) { // helper function to allow different parameters to be entered in 'device:reading' format
		var data = elem.data();
		$.each(Object.entries(data), function(ind,val) {
			if (init) {
				var values = $.isArray(val[1])?val[1]:[val[1]];
				switch(val[0]) {
					case 'style':
					case 'maxvalue':
					case 'minvalue':
					case 'maxvalue_sec':
					case 'minvalue_sec':
						$.each(values,function(i,v){							
							elem.data(val[0]+'#internal#'+i,v); // add additional data value with extension '#internal' (need to allow updates)
							if (!$.isArray(v) && elem.isDeviceReading(val[0]+'#internal#'+i)) {
								obj.addReading(elem, val[0]+'#internal#'+i); // trace new reading with extension '#internal##num'
							} else { // no device:reading setting, remove additional data value
								elem.removeData(val[0]+'#internal#'+i);
							}
						});
						break;
					case 'cliprange': // take special care for date strings to distinguish from 'device:reading' format
						$.each(values,function(i,v){
							var isValidDeviceReading = false;
							if (typeof v == 'string') {
								var drary = v.split(':');
								isValidDeviceReading = ftui.deviceStates[drary[0]]!==undefined;
							}
							elem.data(val[0]+'#internal#'+i,v); // add additional data value with extension '#internal' (need to allow updates)
							if (isValidDeviceReading && elem.isDeviceReading(val[0]+'#internal#'+i)) {
								obj.addReading(elem, val[0]+'#internal#'+i); // trace new reading with extension '#internal##num'
							} else { // no device:reading setting, remove additional data value
								elem.removeData(val[0]+'#internal#'+i);
							}
						});
						break;
				}
			} else if (val[0].search(/#internal#/) > -1) {
				var index = parseInt(val[0].split('#')[val[0].split('#').length-1]);
				var key = val[0].split('#')[0];
				switch(key) {
					case 'style':
					case 'maxvalue':
					case 'minvalue':
					case 'maxvalue_sec':
					case 'cliprange':
					case 'minvalue_sec':
						if (elem.isDeviceReading(val[0])) {
							var newval = elem.getReading(val[0]).val;
							var values = $.isArray(elem.data(key))?elem.data(key):[elem.data(key)];
							if ((index < values.length) && (values[index] != newval)) {
								values[index] = newval;
								elem.data(key,values);
								if (data.done && data.baseDone) widget_chart.refresh(elem,'start');
							}
						}
						break;
				}
			}
		});
	},
	generateGradient: function(min,max,mingraph,maxgraph,style,instance,k) { // helper function to allow self defined gradients with absolute positioning
		var defs = $(document).find('body').children('svg');
		if (defs.length <= 0) defs = $(document).find('body').children().first();
		var offset;
		var mingr = (style&&style.length&&style[0]=='fill')?Math.min(min,mingraph):mingraph;
		var maxgr = maxgraph;
		var scale = (max-min)/(maxgr-mingr);
		var y1 = (mingr===Infinity||maxgr===-Infinity)?0:0-(max-maxgr)/(max-min)*scale*100;
		var y2 = (mingr===Infinity||maxgr===-Infinity)?100:100+(mingr-min)/(max-min)*scale*100;
		var grID = instance+'_'+(k+1); // gradient ID, assuming that there are not more than 10000 instances of chart widgets per page.
		var styledef, styledeftext;
		var newdef = '<svg class="dyndefs" style="position: absolute; height: 0px;"><defs><linearGradient id="gr_ftui'+(grID)+'" x1="0%" y1="'+y1+'%" x2="0%" y2="'+y2+'%">';

		var type = style[0];
		var cstyle = style.slice(1);
		$.each(cstyle, function(ind,val) {
			if ($.isArray(val)) val.push(ind); // adding initial as sorting parameter order to be sure that equqal data values are kept in initial order
		});
		cstyle.sort(function(a,b) {
			if (parseFloat(a[0]) < parseFloat(b[0])) {
				return 1;
			} else if (parseFloat(a[0]) > parseFloat(b[0])) {
				return -1;
			}

			if (parseFloat(a[3]) < parseFloat(b[3])) { // both data values are equal, check for initial sorting
				return 1;
			} else if (parseFloat(a[3]) > parseFloat(b[3])) {
				return -1;
			}

			return (0);
		});

		$.each(cstyle, function(ind,val) {
			if ($.isArray(val) && val.length>2) {
				offset = ((max-val[0])/(max-min)*100)+"%";
				newdef += '<stop offset="'+offset+'" style="stop-color:'+val[1]+'; stop-opacity:'+val[2]+'"></stop>';
			}
		});
		newdef += '</linearGradient></defs></svg>';

		var existing = $(document).find('[id="gr_ftui'+(grID)+'"]'); // check if there are existing dynamic gradients
		if (existing.length > 0) { // there is already a gradient with same instance and slot existing, replace
			existing.parent().parent().replaceWith(newdef);
		} else {
			defs.first().before($(newdef)); // add definition of new gradient to existing ones
		}

		existing = $(document).find('head').find('[id="style_gr_ftui'+(grID)+'"]')
		styledeftext = ' {stroke:none; fill:url(#gr_ftui'+grID+');}';
		if (type=='fill') {
			styledef = 'fill {stroke-width: 2px; fill:url(#gr_ftui'+grID+'); stroke:url(#gr_ftui'+grID+');}'
		} else {
			styledef = ' {fill: none; stroke:url(#gr_ftui'+grID+'); stroke-width: '+type+'px}';
		}
		
		if (existing.length > 0) { // there is already a style for gradients with same instance and slot existing, replace
			existing.replaceWith($('<style id="style_gr_ftui'+grID+'" type="text/css"></style>').text('.ftui.l'+grID+styledef+' text.ftui.l'+grID+styledeftext));
		} else {
			$(document).find('head').append($('<style id="style_gr_ftui'+grID+'" type="text/css"></style>').text('.ftui.l'+grID+styledef+' text.ftui.l'+grID+styledeftext));
		}

		return 'ftui l'+(grID)+((type=='fill')?'fill':'');
	},
	getStyleRuleValue: function(res, style, selector) { // helper function for getting style values
		res.attr('class',selector.replace('.',' ')); // make sure the given class is already used so that we get the right information
		//var elem = (FirstChar =='#') ?  document.getElementById(Remaining) : document.getElementsByClassName(Remaining)[0];
		//console.log(selector, style, $(selector.replace(' ','.')).css(style), window.getComputedStyle(elem,null).getPropertyValue(style));
		//ret = window.getComputedStyle(elem,null).getPropertyValue(style).indexOf('#');
		var ret = res.css(style);
		return ret;
	},
	scaleStroke: function(container, style, scale) { // helper function to scale stroke values while keeping dash settings reasonable
		var styleV = widget_chart.getStyleRuleValue(container, 'stroke-width', style);
		var strk = scale * ((styleV)?parseFloat(styleV.split('px')):1);
		var dashArray;
		styleV = widget_chart.getStyleRuleValue(container, 'stroke-dasharray', style);
		if (styleV && styleV!='none') {
			var dashA = styleV.split(',');
			for(var i=0, ll=dashA.length; i<ll; i++) {
				dashA[i] = parseFloat(dashA[i].split('px'))*scale+'px';
			}
			dashArray = dashA.join(',');
		}
		return {stroke:strk, dash:dashArray};
	},
	getBrowserCaps: function() { // helper function to find out browser capabilities
		if (widget_chart.gBCaps) return widget_chart.gBCaps;
		
		if (!window.getComputedStyle) {
			return false;
		}

		var el = document.createElement('p'), 
			has3D,
			transforms = {
				'webkitTransform':'-webkit-transform',
				'OTransform':'-o-transform',
				'msTransform':'-ms-transform',
				'MozTransform':'-moz-transform',
				'transform':'transform'
			};

		// Add it to the body to get the computed style.
		document.body.insertBefore(el, null);

		var pref='transform';
		var svg_transform_needed = false // needed to overcome transform issues with IE11 on SVG elements
		for (var t in transforms) {
			if (el.style[t] !== undefined) {
				el.style[t] = "translate3d(1px,1px,1px)";
				has3D = window.getComputedStyle(el).getPropertyValue(transforms[t]);
				if (transforms[t] != 'transform') {pref = transforms[t];}
			}
		}

		var result = (has3D !== undefined && has3D.length > 0 && has3D !== "none" && pref != '-ms-transform');
		if (pref == '-ms-transform') svg_transform_needed = true;
		if (pref === undefined && result) {pref = 'transform';}
		document.body.removeChild(el);

		// Hack for problem in IE11 with transform of SVG elements
		var doSVGTransformCorrection = function(elem) {
			if (this.svg_transform_needed) {
				elem.find("[style*='translateX']").each(function() {
					var transform = $(this).attr('style').replace(/.*translateX/,"translateX").replace(/translateX\(/,"");
					var transformx = 'translate('+transform.substr(0,transform.search(/px\)/))+',0)';
					$(this).attr('transform',transformx);
				});
			}
		}
		
		widget_chart.gBCaps = {'result':result,'svg_transform_needed':svg_transform_needed,'doSVGTransformCorrection':doSVGTransformCorrection,'prefix':pref.replace('transform','')};

		return widget_chart.gBCaps;
	},
	getTransformedPoint: function(data,svgbase,point,special) { // helper function to transform 3D point in 2D view
		//if (!data.DDD.Active) return point;
		var left = (data.getGraphLeft());
		var width = data.graphWidth/100*data.basewidth;
		var top = data.topOffset;
		var height = data.graphHeight/100*data.baseheight;

		var dummy = $('<div class="base" style="background:none; position:absolute">'+
			'<div class="baseforDDD">'+
			'<div class="baseRotation">'+
			'<div class="baseArea">'+
			'<div class="handle" id="nw" style="background:none; height:1px; width:1px; position:absolute; left:'+point.x+'px; top:'+point.y+'px"></div>'+
			'</div>'+
			'</div>'+
			'</div>'+
			'</div>');

		var attrval = {style:data.DDD.prefix+'transform:'+data.DDD.String.Scale+'; position:absolute'};
		if (!special) dummy.find('div.baseforDDD').attr(attrval);
		attrval = {style:data.DDD.String.Rot+'; '+data.DDD.String.Trans(point.z,0,data.DDD,data.xStrTO,data.yStrTO)+'; position:absolute'};
		dummy.find('div.baseRotation').attr(attrval);
		attrval = {style:'; left:'+left+'px; width:'+width+'px; top:'+top+'px; height:'+height+'px; position:absolute'};
		dummy.find('div.baseArea').attr(attrval);
		dummy.appendTo($(svgbase)).css("width",data.width || data.defaultWidth).css("height",data.height || data.defaultHeight).css("transform","translateX(-50%)").css("left","50%");
		var po = {x:dummy.find("[id*='nw']").offset().left-dummy.offset().left,y:dummy.find("[id*='nw']").offset().top-dummy.offset().top};
		dummy.remove();
		return po;
	},
	getCoordinates: function(data,svgbase,type) { // helper function to get points for 3D Bounding box
		var left = 0;
		var width = data.basewidth;
		var top = 0;
		var height = data.baseheight;

		var dummy = $('<div class="base" style="background:none; position:absolute">'+
			'<div class="baseforDDD">'+
			'<div class="baseRotation">'+
			'<div class="baseArea">'+
				'<div class="handle" id="nw" style="background:none; height:1px; width:1px; position:absolute; left:0; top:0"></div>'+
				'<div class="handle" id="ne" style="background:none; height:1px; width:1px; position:absolute; right:0; top:0"></div>'+
				'<div class="handle" id="sw" style="background:none; height:1px; width:1px; position:absolute; left:0; bottom:0"></div>'+
				'<div class="handle" id="se" style="background:none; height:1px; width:1px; position:absolute; right:0; bottom:0"></div>'+
			'</div>'+
			'</div>'+
			'</div>'+
			'</div>');
		var attrval;
		switch(type) {
			case 'back_trans':
				attrval = {style:data.DDD.String.Rot+'; '+data.DDD.String.Trans(data.DDD.Width(data.nGraphs-1),data.nGraphs,data.DDD,data.xStrTO,data.yStrTO)+'; position:absolute'};
				dummy.find('div.baseRotation').attr(attrval);
				break;
			case 'front_trans':
				attrval = {style:data.DDD.String.Rot+'; '+data.DDD.String.Trans(0,0,data.DDD,data.xStrTO,data.yStrTO)+'; position:absolute'};
				dummy.find('div.baseRotation').attr(attrval);
				break;
		}

		attrval = {style:'; left:'+left+'px; width:'+width+'px; top:'+top+'px; height:'+height+'px; position:absolute'};
		dummy.find('div.baseArea').attr(attrval);
		dummy.appendTo($(svgbase)).css("width",data.width || data.defaultWidth).css("height",data.height || data.defaultHeight).css("transform","translateX(-50%)").css("left","50%");

		left = Math.min(dummy.find("[id*='nw']").offset().left,dummy.find("[id*='ne']").offset().left,dummy.find("[id*='sw']").offset().left,dummy.find("[id*='se']").offset().left);
		top = Math.min(dummy.find("[id*='nw']").offset().top,dummy.find("[id*='ne']").offset().top,dummy.find("[id*='sw']").offset().top,dummy.find("[id*='se']").offset().top);
		var right = Math.max(dummy.find("[id*='nw']").offset().left,dummy.find("[id*='ne']").offset().left,dummy.find("[id*='sw']").offset().left,dummy.find("[id*='se']").offset().left);
		var bottom = Math.max(dummy.find("[id*='nw']").offset().top,dummy.find("[id*='ne']").offset().top,dummy.find("[id*='sw']").offset().top,dummy.find("[id*='se']").offset().top);
		dummy.remove();

		var ret = {left:left,top:top,right:right,bottom:bottom};
		//console.log(ret);
		return ret;
	},
	getDDDBox: function(data,svgbase) { // helper function to get 3D bounding box
		var tDummy = widget_chart.createElem('line');
		tDummy.attr('style','.axes');

		var bO = widget_chart.getCoordinates(data,svgbase,'back_orig');
		var bT = widget_chart.getCoordinates(data,svgbase,'back_trans');
		var fO = widget_chart.getCoordinates(data,svgbase,'front_orig');
		var fT = widget_chart.getCoordinates(data,svgbase,'front_trans');
		
		var boxO = {left:Math.min(bO.left,fO.left),top:Math.min(bO.top,fO.top),right:Math.max(bO.right,fO.right),bottom:Math.max(bO.bottom,fO.bottom)};
		var boxT = {left:Math.min(bT.left,fT.left),top:Math.min(bT.top,fT.top),right:Math.max(bT.right,fT.right),bottom:Math.max(bT.bottom,fT.bottom)};
		data.DDD.scaleX = (boxO.right-boxO.left)/(boxT.right-boxT.left);
		data.DDD.scaleY = (boxO.bottom-boxO.top)/(boxT.bottom-boxT.top);
		data.DDD.shiftY = data.DDD.scaleY*(boxO.top-boxT.top);
		data.DDD.shiftX = data.DDD.scaleX*(boxO.left-boxT.left);
	},
	getTextSizePixels: function(elem,text,style) { // helper function to calculate the text size of a string in pixels for given style
		if (!this.sList) this.sList = [];
		if (!this.sList[style]) {
			var tDummy = widget_chart.createElem('text').text('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz');
			tDummy.attr({'class':style,'style':'box-sizing: border-box'});
			elem.append(tDummy);
			var ret = {'width':$(tDummy)[0].getBoundingClientRect().width,'height':$(tDummy)[0].getBoundingClientRect().height};
			tDummy.remove();
			this.sList[style] = {'width':ret.width/52, 'height':ret.height};
		}
		return {'width':this.sList[style].width*text.length,'height':this.sList[style].height};
	},
	transformMatrix: function(ary,matrix) { // helper function for 'manual' 3D transformation
		var ret = [];
		for (var row=0, lrow=ary.length; row<lrow; row++) {
			ret[row] = 0;
			for (var col=0, lcol=matrix[row].length; col<lcol; col++) {
				ret[row] += ary[col]*matrix[row][col];
			}
		}
		return ret;
	},
	rotateX: function(ary,alpha) { // helper function for 'manual' 3D transformation (rotate round X-Axis)
		var na = alpha*Math.PI/180;
		var matrix = [];
		matrix[0] = [1,0,0,0];
		matrix[1] = [0,Math.cos(na),-Math.sin(na),0];
		matrix[2] = [0,Math.sin(na),Math.cos(na),0];
		matrix[3] = [0,0,0,1];
		return widget_chart.transformMatrix(ary,matrix);
	},
	rotateY: function(ary,alpha) { // helper function for 'manual' 3D transformation (rotate round Y-Axis)
		var na = alpha*Math.PI/180;
		var matrix = [];
		matrix[0] = [Math.cos(na),0,Math.sin(na),0];
		matrix[1] = [0,1,0,0];
		matrix[2] = [-Math.sin(na),0,Math.cos(na),0];
		matrix[3] = [0,0,0,1];
		return widget_chart.transformMatrix(ary,matrix);
	},
	rotateZ: function(ary,alpha) { // helper function for 'manual' 3D transformation (rotate round Z-Axis)
		var na = alpha*Math.PI/180;
		var matrix = [];
		matrix[0] = [Math.cos(na),-Math.sin(na),0,0];
		matrix[1] = [Math.sin(na),Math.cos(na),0,0];
		matrix[2] = [0,0,1,0];
		matrix[3] = [0,0,0,1];
		return widget_chart.transformMatrix(ary,matrix);
	},
	scalePoint: function(ary,sx,sy,sz) { // helper function for 'manual' 3D transformation (scale point in 3D)
		ary[0]*=sx;
		ary[1]*=sy;
		ary[2]*=sz;
		return(ary);
	},
	projectPlane: function(ary,dist) { // helper function for 'manual' 3D transformation (do projection in a plane with certain distance from viewpoint)
		var matrix = [];
		var pt = ary;
		matrix[0] = [1,0,0,0];
		matrix[1] = [0,1,0,0];
		matrix[2] = [0,0,1,0];
		matrix[3] = [0,0,-1/dist,1];
		pt = widget_chart.transformMatrix(pt,matrix);
		pt[0]/=pt[3];
		pt[1]/=pt[3];
		return pt;
	},
	computeControlPoints4: function(p1, p2, p3) { // helper function for calculation of control points for SVG splines used in interpolated plots
		var dx1 = p1.x - p2.x;
		var dy1 = p1.y - p2.y;
		var dx2 = p2.x - p3.x;
		var dy2 = p2.y - p3.y;
		
		var l1 = Math.sqrt(dx1*dx1 + dy1*dy1);
		var l2 = Math.sqrt(dx2*dx2 + dy2*dy2);
		
		var m1 = {x: (p1.x + p2.x) / 2.0, y: (p1.y + p2.y) / 2.0};
		var m2 = {x: (p2.x + p3.x) / 2.0, y: (p2.y + p3.y) / 2.0};

		var dxm = (m1.x - m2.x);
		var dym = (m1.y - m2.y);
		
		var k = (((l1+l2)!==0)?l2 / (l1+l2):0);
		var cm = {x: m2.x + dxm*k, y: m2.y + dym*k};
		var tx = p2.x - cm.x;
		var ty = p2.y - cm.y;

		var cp1 = {x: m1.x + tx, y: m1.y + ty};
		var cp2 = {x: m2.x + tx, y: m2.y + ty};
		
		return {p1:cp1, p2:cp2};
	},
	computeControlPoints3: function(arg) { // calculation of control points for SVG splines used in interpolated plots
		var n = arg.length;
		var nc = 1;

		var cx = {p1:[], p2:[]};
		var cy = {p1:[], p2:[]};
		var disconnected_inner, disconnected_outer;

		for (var i=0, leni=n-1; i<leni ; i++)
		{
			var iloc = 0;
			var lK=[];
			for (var ii=i-nc, lenii=i+nc+1; ii<=lenii; ii++)
			{
				var icorr = Math.max(0,Math.min(ii,n-1));
				disconnected_outer = (arg[i][5] && arg[i][5]==true);
				disconnected_inner =  (arg[icorr][5] && arg[icorr][5]==true);
				if (disconnected_outer) {
					lK[iloc] = {x: parseFloat(arg[i][0]), y:parseFloat(arg[i][1])};
					iloc = iloc+1;
				} else if (disconnected_inner) {
					lK[iloc] = {x: parseFloat(arg[i][0]), y:parseFloat(arg[i][1])};
					iloc = iloc+1;
				} else {
					lK[iloc] = {x: parseFloat(arg[icorr][0]), y:parseFloat(arg[icorr][1])};
					iloc = iloc+1;
				}
			}
			
			var re = widget_chart.computeControlPoints4(lK[0], lK[1], lK[2]);	
			cx.p1[i] = re.p2.x;
			cy.p1[i] = re.p2.y;

			re = widget_chart.computeControlPoints4(lK[1], lK[2], lK[3]);
			cx.p2[i] = re.p1.x;
			cy.p2[i] = re.p1.y;	
		}
		return {cx:cx, cy:cy};
	},
	getYTicksBase: function(min,max) { // helper function for automatic calculation of yticks
		var ydiff=(max!=min)?max-min:(max>0)?max:1;
		var p=parseInt(Math.log10(ydiff));
		var yr = parseInt((ydiff)/Math.pow(10,p)+0.5);
		var yrt=[0.2, 0.4, 0.6, 1, 1, 1.5, 2, 2, 2, 2];
		var yt = yrt[Math.max(0,yr-1)]*Math.pow(10,p);
		return yt;
	},
	processLogproxyCorrection: function(bds,ptsin,style,scalex,scaley,elem) { // helper function for logproxy mode to take care of space for text
		var oxl=0, oxr=0, oyt=0;
		for (var i=0, il=ptsin.length; i<il; i++) {
			var pts = ptsin[i];
			if (pts[2]) {
				oyt = widget_chart.getTextSizePixels(elem,pts[3],style).height*scaley;
				switch (pts[2]) {
					case 'start':
						oxr = widget_chart.getTextSizePixels(elem,pts[3],style).width*scalex;
						oxl = 0;
						break;
					case 'middle':
						oxl = widget_chart.getTextSizePixels(elem,pts[3],style).width*scalex/2;
						oxr = widget_chart.getTextSizePixels(elem,pts[3],style).width*scalex/2;
						break;
					case 'end':
						oxr = 0;
						oxl = widget_chart.getTextSizePixels(elem,pts[3],style).width*scalex;
						break;
				}
			}
			bds.minx = Math.min(bds.minx,isNaN(pts[0])?bds.minx:parseFloat(pts[0])-oxl);
			bds.maxx = Math.max(bds.maxx,isNaN(pts[0])?bds.maxx:parseFloat(pts[0])+oxr);
			bds.miny = Math.min(bds.miny,isNaN(pts[1])?bds.miny:parseFloat(pts[1])-oyt);
			bds.maxy = Math.max(bds.maxy,isNaN(pts[1])?bds.maxy:parseFloat(pts[1])+oyt);
		}
	},
	processLogproxyData: function(bds,pts_str,pts) { // transfer objects to display in case of logproxy mode to "normal" points array
		var closed = false;
		var ip = 0;
		var isave = 0;

		for (var i=0, il=pts_str.length; i<il; i++) {
			var params = pts_str[i].split(' ');
			bds.minx = Math.min(bds.minx,isNaN(params[1])?bds.minx:parseFloat(params[1]));
			bds.maxx = Math.max(bds.maxx,isNaN(params[1])?bds.maxx:parseFloat(params[1]));
			bds.miny = Math.min(bds.miny,isNaN(params[2])?bds.miny:parseFloat(params[2]));
			bds.maxy = Math.max(bds.maxy,isNaN(params[2])?bds.maxy:parseFloat(params[2]));
			
			switch (params[0]) {
				case ';c':
					closed = true;
					isave = ip;
					break;
				case ';p':
					pts[ip]=[parseFloat(params[1]),parseFloat(params[2])];
					ip++;
					break;
				case ';t':
					pts[ip]=[parseFloat(params[1]),parseFloat(params[2]),params[3],params[4]];
					ip++;
					break;
				case ';':
					break;
				default:
					break;
			}
		}
	},
	getFuncVal: function(funcIn,inAry,mindate) { // helper function to calculate variable parts of header from plot data
		var func = funcIn.replace(/[0-9]/g,''); // derive the function from the overall function string (max1 gets max)
		var indexs = funcIn.match(/\d+/g); // check if there is a number at the end of the function (setting the index over all curve values)
		var index;
		func = func.replace(/All/,''); // index is already correct for 'All' just replace the All by nothing
		if (indexs === null) {index = -1;} else {index = indexs[0];}
		var tstart = ftui.dateFromString(mindate);
		var tx = new Date(tstart);

		var fVal = function(index, ary) {
			var res = [Number.POSITIVE_INFINITY,Number.NEGATIVE_INFINITY,0,0,0,Number.POSITIVE_INFINITY,Number.NEGATIVE_INFINITY,''];
			var len = index>0?Math.min(index-1,ary.length-1):ary.length-1;
			var ipts = 0;
			for (var k=(index==-1)?0:len; k<=len; k++) {
				for (var i=0, il=ary[k].length; i<il; i++) {
					ipts++;
					if (ary[k][i][1] < res[0]) res[0]=ary[k][i][1];
					if (ary[k][i][1] > res[1]) res[1]=ary[k][i][1];
					res[2]+=ary[k][i][1];
					if (i==ary[k].length-1) res[4]=ary[k][i][1];
					if (ary[k][i][0] < res[5]) res[5]=ary[k][i][0];
					if (ary[k][i][0] > res[6]) res[6]=ary[k][i][0];
					if (i==ary[k].length-1) res[7]=ary[k][i][0];
				}
			}
			if (ipts > 0) res[2]/=ipts;
			res[3]=ipts;
			tx.setMinutes(tstart.getMinutes() + res[5]);		
			res[5] = tx.ddmm() + ' ' + tx.hhmm();
			tx = new Date(tstart);
			tx.setMinutes(tstart.getMinutes() + res[6]);		
			res[6] = tx.ddmm() + ' ' + tx.hhmm();
			tx = new Date(tstart);
			tx.setMinutes(tstart.getMinutes() + res[7]);		
			res[7] = tx.ddmm() + ' ' + tx.hhmm();
			return res;
		};

		var ret;
		switch(func) {
			case 'min':
				ret = fVal(index,inAry)[0];
				break;
			case 'max':
				ret = fVal(index,inAry)[1];
				break;
			case 'avg':
				ret = fVal(index,inAry)[2];
				break;
			case 'cnt':
				ret = fVal(index,inAry)[3];
				break;
			case 'currval':
				ret = fVal(index,inAry)[4];
				break;
			case 'mindate':
				ret = fVal(index,inAry)[5];
				break;
			case 'maxdate':
				ret = fVal(index,inAry)[6];
				break;
			case 'currdate':
				ret = fVal(index,inAry)[7];
				break;
			case 'lastraw':
				ret = fVal(index,inAry)[8];
				break;
		}
		return ret;
	},
	parseForTitle: function(pstr, pts, mindate) { // helper function to parse variable parts in header string
		var ret = "";
		var input = pstr;

		var parts = input.split(/\$data/);
		for (var i=0, il=parts.length; i<il; i++) {
			if (parts[i].search(/\{/) > -1) {
				var func = parts[i].replace(/\{/,'').replace(/\}.*/,''); // get function out of $data{function} definition
				ret+=widget_chart.getFuncVal(func,pts,mindate);
			}
			ret+=parts[i].replace(/\{.*\}/,''); // add remaining text
		}
		
		// now all $data{...} parts are replaced by the calculated values lets do evaluation of regular expressions by eval()
		var reteval = "";
		var parts = ret.split(/\$eval/)
		for (var i=0, il=parts.length; i<il; i++) {
			if (parts[i].search(/\(/) > -1) {
				var func = parts[i].replace(/\(/,''); // get function out of $data{function} definition
				func = func.substring(0,func.lastIndexOf(')'));
				reteval+=eval(func);
			}
			reteval+=parts[i].replace(/\(.*\)/,''); // add remaining text
		}
		
		return reteval;
	},
	processCSSpecial: function(cs,data) { // helper function to parse for special parts in columnspec
		var cs_out=cs;
		var occurrences = cs.match(/\$Chart\(.*?\)/g);
		if (occurrences) {
			$.each(occurrences, function (index,value) {
				var func = value.replace(/\$Chart\(/,'').replace(/\)/,'');
				var calc = data[func];
				cs_out = cs_out.replace(value,calc);
			});
		}
		return cs_out;
	},
	getSVGPoints: function (argin, data, minin, xmaxin, ptype, closed, uaxis) { // function for generation of strings for d attribute in SVG paths for different plot types
		if (argin.length < 1) return; // empty array, nothing to do
		var arg = [];
		var res = [];
		var proxy = false;
		var i,l;

		if (ptype.indexOf('_proxy')>0) {proxy = true; closed = false;}

		var min = data.transD2W([0,minin],uaxis)[1];
		var xmax = data.transD2W([xmaxin,0],uaxis)[0];

		for (i=0, l=argin.length; i<l; i++) { // transform values to fit into graphics coordinate system
			if (argin[i][1]==-Infinity) argin[i][1] = minin;
			arg[i] = data.transD2W(argin[i],uaxis);
			arg[i][1]=arg[i][1];
			for (var ii=2, iil=argin[i].length; ii<iil; ii++) arg[i][ii] = argin[i][ii]; // in case of logproxy mode there might be more parameters in the array e.g. for text
		}
		
		var xval;
		var cp,cx,cy;
		var first;
		var disconnected;
		var ptc = ptype.substring(0,Math.max(0,ptype.indexOf('_proxy')>0?ptype.indexOf('_proxy'):ptype.length)).split('-');
		var subtype = (ptc.length && ptc.length > 1)?ptc[1]:'';
		var start = subtype.search('start')>-1?true:false;
		var end = subtype.search('end')>-1?true:false;
		var type = ptc[0];
		
		switch (type) {
			case 'lines':
				first = true;
				for (i=0,l=arg.length;i<l;i++) {
					disconnected =  arg[i][5] && arg[i][5]==true;
					if(arg[i] && !arg[i][3]) {// if there is a third parameter, this point is a text and not a line
						if (first) {
							res.push("M" + arg[i][0] + "," + (closed?min:arg[i][1]) + " L");
							first = false;
						}
						if (disconnected) {
							res.push("M" + arg[i][0] + "," + arg[i][1] + " L");
						} else {
							res.push(arg[i][0]+","+arg[i][1]);
						}
					}
				}
				if (!proxy) res.push("L" + arg[arg.length-1][0] + "," + (closed?min + " Z":arg[arg.length-1][1]));
				break;
			case 'steps':
				res.push("M" + arg[0][0] + "," + (closed?min:arg[0][1]) + " L");
				for (i=0,l=arg.length-1;i<l;i++) {
					disconnected =  arg[i][5] && arg[i][5]==true;
					if(arg[i]) {
						if (disconnected) {
							res.push("M" + arg[i][0] + "," + arg[i][1] + " L");
							res.push(arg[i+1][0] + ',' + arg[i][1]);
						} else {
							res.push(arg[i][0]+","+arg[i][1]);
							if (!(arg[i+1][5] && arg[i+1][5]==true))res.push(arg[i+1][0] + ',' + arg[i][1]); // only add point if next one is connected
						}
					}
				}
				res.push("L" + arg[arg.length-1][0] + "," + (closed?min + " Z":arg[arg.length-1][1]));
				break;
			case 'fsteps':
				res.push("M" + arg[0][0] + "," + (closed?min:arg[0][1]) + " L");
				for (i=0,l=arg.length-1;i<l;i++) {
					disconnected =  arg[i][5] && arg[i][5]==true;
					if(arg[i]) {
						if (disconnected) {
							res.push("M" + arg[i][0] + "," + arg[i][1] + " L");
							res.push(arg[i][0] + ',' + arg[i+1][1]);
						} else {
							res.push(arg[i][0]+","+arg[i][1]);
							if (!(arg[i+1][5] && arg[i+1][5]==true)) res.push(arg[i][0] + ',' + arg[i+1][1]); // only add point if next one is connected
						}
					}
				}
				res.push(arg[arg.length-1][0] + ',' + arg[arg.length-1][1]);
				res.push("L" + arg[arg.length-1][0] + "," + (closed?min + " Z":arg[arg.length-1][1]));
				break;
			case 'histeps':
				if (arg.length > 1) {
					res.push("M" + Math.max(arg[0][0],(3*arg[0][0]-arg[1][0])/2) + "," + (closed?min:arg[0][1]) + " L");
					res.push(Math.max(arg[0][0],(3*arg[0][0]-arg[1][0])/2) + "," + (arg[0][1]));
					res.push((arg[0][0]+arg[1][0])/2 + "," + (arg[0][1]));
					var dcfound = false;
					for (i=1,l=arg.length-1;i<l;i++) {
						disconnected =  arg[i][5] && arg[i][5]==true;
						if(arg[i]) {
							if (disconnected) {
								res.push("M" + Math.max(arg[i][0],(3*arg[i][0]-arg[1+1][0])/2) + ',' + arg[i][1] + "L");
								dcfound = true;
							} else {
								xval = (arg[i-1][0]+arg[i][0])/2;
								res.push(xval + ',' + arg[i][1]);
								if (!(arg[i+1][5] && arg[i+1][5]==true)) {	// next point is not a disconnected point, normal behaviour
									xval = (arg[i][0]+arg[i+1][0])/2;
									res.push(xval + ',' + arg[i][1]);
								} else { 									// next point is a disconnected point, just use current point as x value
									xval = arg[i][0];
									res.push(xval + ',' + arg[i][1]);
								}
							}
						}
					}
					res.push((arg[arg.length-2][0]+arg[arg.length-1][0])/2 + "," + arg[arg.length-1][1]);
					res.push(arg[arg.length-1][0] + "," + arg[arg.length-1][1]);
					res.push("L" + arg[arg.length-1][0] + "," + (closed?min + " Z":arg[arg.length-1][1]));
				} else {
					res.push("M 0," + (closed?min:arg[0][1]) + " L");
					res.push(" 0," + arg[0][1]);
					res.push(xmax + "," + arg[0][1]);
					res.push(xmax + "," + (closed?min+" Z":arg[0][1]));
				}
				break;
			case 'bars':
				res.push("M" + arg[0][0] + "," + (closed?min:arg[0][1]) + " L");
				var step = arg[arg.length-1][0]-arg[0][0];
				for (i=1,l=arg.length;i<l;i++) {
					var diff = (arg[i-1][0]-arg[i][0]);
					if (diff<0) diff=-diff;
					if (diff<step && diff!==0) step=diff;
				}
				step = step*0.4;
				for (i=0,l=arg.length;i<l;i++) {
					disconnected =  arg[i][5] && arg[i][5]==true;
					if(arg[i]) {
						if (disconnected) {
						} else {
							if (!(arg[i][5] && arg[i][5]==true)) {	// next point is not a disconnected point, normal behaviour
								xval = end?(arg[i][0]-2*step):(start?(arg[i][0]):(arg[i][0]-step));
								res.push(xval + ',' + min);
								res.push(xval + ',' + arg[i][1]);
								xval = end?(arg[i][0]):(start?(arg[i][0]+2*step):(arg[i][0]+step));
								res.push(xval + ',' + arg[i][1]);
								res.push(xval + ',' + min);
							} else {
								
							}
						}
					}
				}
				res.push("L" + arg[arg.length-1][0] + "," + (closed?min + " Z":arg[arg.length-1][1]));
				break;
			case 'ibars':
				if (arg.length > 1) {
					res.push("M" + arg[0][0] + "," + (closed?min:arg[0][1]) + " L");
					res.push((arg[0][0]+arg[1][0])/2 + "," + (closed?min:arg[0][1]));
					for (i=1,l=arg.length-1;i<l;i++) {
						if(arg[i]) {
							xval = end?arg[i-1][0]:(start?arg[i][0]:(arg[i-1][0]+arg[i][0])/2);
							res.push(xval + ',' + min);
							res.push(xval + ',' + arg[i][1]);
							xval = end?arg[i][0]:(start?arg[i+1][0]:(arg[i][0]+arg[i+1][0])/2);
							res.push(xval + ',' + arg[i][1]);
							res.push(xval + ',' + min);
						}
					}
					res.push((end?arg[arg.length-2][0]:(start?arg[arg.length-1][0]:(arg[arg.length-2][0]+arg[arg.length-1][0])/2)) + "," + arg[arg.length-1][1]);
					res.push(arg[arg.length-1][0] + "," + arg[arg.length-1][1]);
					res.push("L" + arg[arg.length-1][0] + "," + (closed?min + " Z":arg[arg.length-1][1]));
				} else {
					res.push("M 0," + min + " L");
					res.push(" 0," + arg[0][1]);
					res.push(xmax + "," + arg[0][1]);
					res.push(xmax + "," + min + (closed?" Z":""));
				}
				break;
			case 'cubic':
				cp = widget_chart.computeControlPoints3(arg);
				cx = cp.cx;
				cy = cp.cy;
				first = true;
				for (i=0,l=arg.length-1;i<l;i++) {
					disconnected =  arg[i][5] && arg[i][5]==true;
					if(arg[i] && !arg[i][3]) {
						if (first) {
							res.push("M" + arg[i][0] + "," + (closed?min:arg[i][1]) + " L");
							res.push(arg[i][0] + ", " + arg[i][1] + " C");
							first = false;
						}
						if (disconnected) {
							res.push(" M " + arg[i][0] + ", " + arg[i][1] + " C ");
						} else {
							if (arg[i+1][5] && arg[i+1][5]==true) {
								res.push(" L " + arg[i][0] + "," + arg[i][1]);
							} else {
								res.push(cx.p1[i] + ", " + cy.p1[i] + ", " + cx.p2[i] + ", " + cy.p2[i] + ", " + arg[i+1][0] + ", " + arg[i+1][1] + " ");
							}
						}
					}
				}
				if (!proxy) res.push("L" + arg[arg.length-1][0] + "," + (closed?min + " Z":arg[arg.length-1][1]));
				break;
			case 'quadratic':
				cp = widget_chart.computeControlPoints3(arg);
				cx = cp.cx;
				cy = cp.cy;
				first = true;
				for (i=0,l=arg.length-1;i<l;i++) {
					disconnected =  arg[i][5] && arg[i][5]==true;
					if(arg[i] && !arg[i][3]) {
						if (first) {
							res.push("M " + arg[i][0] + "," + (closed?min:arg[i][1]) + " L ");
							res.push(arg[i][0] + ", " + arg[i][1] + " Q ");
							first = false;
						}
						if (disconnected) {
							res.push("M " + arg[i][0] + ", " + arg[i][1]);
						} else {
							if (arg[i+1][5] && arg[i+1][5]==true) {
								res.push(" L " + arg[i][0] + "," + arg[i][1]);
							} else if ((i>0 && (arg[i-1][5] && arg[i-1][5]==true))) {
								res.push(" L " + arg[i][0] + "," + arg[i][1] + " Q ");
							} else {
								res.push(cx.p2[i] + ", " + cy.p2[i] + ", " + arg[i+1][0] + ", " + arg[i+1][1]+ " ");
							}
						}
					}
				}
				if (!proxy) res.push("L" + arg[arg.length-1][0] + "," + (closed?min + " Z":arg[arg.length-1][1]));
				break;
			case 'quadraticSmooth':
				first = true;
				for (i=0,l=arg.length-1;i<l;i++) {
					disconnected =  arg[i][5] && arg[i][5]==true;
					if(arg[i] && !arg[i][3]) {
						if (first) {
							res.push("M " + arg[i][0] + "," + (closed?min:arg[i][1]) + " L ");
							res.push(arg[i][0] + ", " + arg[i][1] + " T ");
							first = false;
						}
						if (disconnected) {
							res.push("M" + arg[i][0] + "," + arg[i][1] + " L ");
							res.push(arg[i][0] + ", " + arg[i][1]);
						} else {
							if (arg[i+1][5] && arg[i+1][5]==true) {
								res.push(" L " + arg[i][0] + "," + arg[i][1]);
							} else if ((i>0 && (arg[i-1][5] && arg[i-1][5]==true))) {
								res.push(arg[i][0] + ", " + arg[i][1] + " L ");
								res.push(arg[i][0] + ", " + arg[i][1] + " T ");
								res.push(((arg[i][0]+arg[i+1][0])/2) + ", " + ((arg[i][1]+arg[i+1][1])/2) + " ");
							} else {
								res.push(((arg[i][0]+arg[i+1][0])/2) + ", " + ((arg[i][1]+arg[i+1][1])/2) + " ");
							}
						}
					}
				}
				res.push("L" + arg[arg.length-1][0] + "," + (closed?min + " Z":arg[arg.length-1][1]));
				break;
		}
		return res.join(' ');
	},
	scaleValues: function(pointsarray, k, data) { // helper function to scale all values in a data array
		var uaxis;
		uaxis = widget_chart.getArrayValue(data.uaxis,k,'primary');
		var AI = data.getAxisIndex(uaxis);
		var yscale = (data.isPrimary(uaxis))?data.yLimits[AI].primary.scaleY:data.yLimits[AI].secondary.scaleY;
		var yshift = (data.isPrimary(uaxis))?data.yLimits[AI].primary.shiftY:data.yLimits[AI].secondary.shiftY;
		for (var i=0,ll=pointsarray[k].length; i<ll; i++) {
			pointsarray[k][i][1] = pointsarray[k][i][1]*yscale-yshift;
		}
	},
	getValuesPolar: function(data,values,pointsarray) { // helper function for calculation of positions and values for crosshair cursor
		var index = 0;
		var angles = [];
		var k, kl, i, il, uaxis;
		for (k=0,kl=pointsarray.length; k<kl; k++) {
			uaxis = widget_chart.getArrayValue(data.uaxis,k,'primary');
			var AI = data.getAxisIndex(uaxis);
			angles[k] = [];
			for (i=0,il=pointsarray[k].length; i<il; i++) {
				angles[k][i] = Math.atan2((pointsarray[k][i][1]+data.yLimits[AI].primary.shiftY)/data.yLimits[AI].primary.scaleY,pointsarray[k][i][0]+data.minx);
			}
		}
		var dang = Math.PI/180;
		for (i=-Math.PI, il=Math.PI; i<=il; i+=dang) {
			var ik = 0;
			for (k=0,kl=pointsarray.length; k<kl; k++) {
				var minang = 2*Math.PI;
				if (pointsarray[k][0].length <= 3) { // only take into account non text points
					index = -1;
					for (var ii=0, iil=pointsarray[k].length; ii<iil; ii++) {
						if (Math.abs(i-angles[k][ii])<minang) {
							minang = Math.abs(i-angles[k][ii]);
							index=ii;
						}
					}
					var ind = parseInt(i/Math.PI*180+180);
					if (values[ind]===undefined) values[ind] = [];
					values[ind][ik] = [];
					values[ind][ik][0] = pointsarray[k][index][0];
					values[ind][ik][1] = pointsarray[k][index][1];
					values[ind][ik][2] = parseInt((Math.sqrt(Math.pow(pointsarray[k][index][0]+data.minx,2)+Math.pow((pointsarray[k][index][1]+data.yLimits[AI].primary.shiftY)/data.yLimits[AI].primary.scaleY,2))*100)+0.5)/100;
					ik++;
				}
			}
		}
	},
	getValues: function (x,y,left,data,values,pointsarray) { // helper function for calculation of positions and values for crosshair cursor
		var width = data.graphArea.width;
		var xrange = data.xrange;
		if (width > 0) {
			var xval=parseInt((x-left)/width*xrange);
			var index=0;
			var val;
			for (var k=0,l=pointsarray.length; k<l; k++) {
				if (pointsarray[k] && pointsarray[k].length > 0) {
					for (var i=0,ll=pointsarray[k].length; i<ll; i++) {
						if (pointsarray[k][i][0]>xval) {
							index=i;
							break;
						}
					}
					if (index>0 && index<pointsarray[k].length) {
						if ((xval-pointsarray[k][index-1][0])>(pointsarray[k][index][0]-xval)) {
							val=[pointsarray[k][index][0]/xrange*width+left,pointsarray[k][index][1]];
							if (pointsarray[k][index][2]) val[2] = pointsarray[k][index][2];
						} else {
							val=[pointsarray[k][index-1][0]/xrange*width+left,pointsarray[k][index-1][1]];
							if (pointsarray[k][index-1][2]) val[2] = pointsarray[k][index-1][2];
						}
					} else {
						if (xval < pointsarray[k][0][0]) {
							val=[pointsarray[k][0][0]/xrange*width+left,pointsarray[k][0][1]];
							if (pointsarray[k][0][2]) val[2] = pointsarray[k][0][2];
						} else {
							val=[pointsarray[k][pointsarray[k].length-1][0]/xrange*width+left,pointsarray[k][pointsarray[k].length-1][1]];
							if (pointsarray[k][pointsarray[k].length-1][2]) val[2] = pointsarray[k][pointsarray[k].length-1][2];
						}
					}
					values[k]=val;
					var uaxis = widget_chart.getArrayValue(data.uaxis,k,'primary');
					var AI = data.getAxisIndex(uaxis);
					var ytk = (data.isPrimary(uaxis))?data.yLimits[AI].primary.yticks:data.yLimits[AI].secondary.yticks;
					var scl = (data.isPrimary(uaxis))?data.yLimits[AI].primary.scaleY:data.yLimits[AI].secondary.scaleY;
					var sft = (data.isPrimary(uaxis))?data.yLimits[AI].primary.shiftY:data.yLimits[AI].secondary.shiftY;
					if ($.isArray(ytk) && $.isArray(ytk[0])) {
						var indx = ytk.length;
						for (var iytk=0,liytk=ytk.length; iytk<liytk; iytk++) if (val[1] <= ytk[iytk][0]*scl-sft) {indx = iytk;break;}
						values[k][2]=ytk[Math.max(0,Math.min(ytk.length-1,indx))][1];
					}
				}
			}
		}
	},
	setArrayValue: function(array,valIn,i) { // helper function for setting a certain index in an array
		if ($.isArray(array)) {array[Math.min(i,array.length-1)]=valIn;} else if (array !== undefined) {array=valIn;}
		return array;
	},
	getArrayValue: function(array,i,defVal) { // helper function for getting a certain index in an array
		var rVal;
		if ($.isArray(array)) {rVal = array[Math.min(i,array.length-1)];} else if (array !== undefined) {rVal = array;} else {rVal = defVal;}
		return rVal;
	},
	getDynamicStyle: function(style) {
		var ret = '';
		if ($.isArray(style) && style[0].search(/graphbase/)>=0) {
			$.each(style, function(index, value) {
				if (value.search(/style/)>=0) ret = value.search(':')>=0?value.split(':')[1]:'';
			});
			return ret;
		} else {
			return style;
		}
	},
	getArrayLength: function(array) {
		var n=0;
		if ($.isArray(array)) {
			n = array.length;
		} else {
			if (array) n=1;
		}
		return n;
	},
	joinGraphs: function(slot,actGr,actGrStr,newGr,newGrStr,i,i_last) { // helper function to join graphs when columnspec is array (e.g. for filling between two graphs)
		var mergepoints = [];
		if (i>i_last) { // actual index is greater than previous one, append array
			if (actGr[slot] && actGr[slot].length > 0) mergepoints = [actGr[slot][actGr[slot].length-1],newGr[newGr.length-1]];
			actGr[slot] = (i_last == -1)?newGr.clone():actGr[slot].concat(mergepoints).concat(newGr.clone(true));
			actGrStr[slot] = (!actGrStr[slot])?newGrStr.clone():actGrStr[slot].concat(newGrStr.clone(true));
		} else { // actual index is smaller than previous one, prepend array
			if (actGr[slot] && actGr[slot].length > 0) mergepoints = [newGr[newGr.length-1],actGr[slot][actGr[slot].length-1]];
			actGr[slot] = (i_last == -1)?newGr.clone():newGr.concat(mergepoints).concat(actGr[slot].clone(true));
			actGrStr[slot] = (!actGrStr[slot])?newGrStr.clone():newGrStr.concat(actGrStr[slot].clone(true));
		}
		
		return i;
	},
	getnGraphs: function(data) {
		var nGraphs = 0;
		nGraphs = Math.max(nGraphs,widget_chart.getArrayLength(data.logdevice));
		nGraphs = Math.max(nGraphs,widget_chart.getArrayLength(data.logfile));
		nGraphs = Math.max(nGraphs,widget_chart.getArrayLength(data.columnspec));
		nGraphs = Math.max(nGraphs,widget_chart.getArrayLength(data.ptype));
		nGraphs = Math.max(nGraphs,widget_chart.getArrayLength(data.uaxis));
		nGraphs = Math.max(nGraphs,widget_chart.getArrayLength(data.legend));
		nGraphs = Math.max(nGraphs,widget_chart.getArrayLength(data.style));
		nGraphs = Math.max(nGraphs,widget_chart.getArrayLength(data.graphsshown));
		nGraphs = Math.max(nGraphs,widget_chart.getArrayLength(data.cursorshown));
		return nGraphs;
	},
	getDateTimeNumberString: function(date,format) { // generate Date/Time String according to format given
		var tf = [];
		var ts = [];
		var aret = [];
		var strRet = '';
		var strSub = '';
		var is=0, ie=0, i=0, iarr=0, il;
		var datatype = '';

		while (is < format.length) {
			strSub = format.substring(is)+'.';
			ie = strSub.search(/[\-\.\/ \:\,\\]/)+is; // search for next separator
			if (ie==-1) ie = format.length;
			tf[i] = format.substring(is,ie);
			ts[i] = format.substring(ie,ie+1);
			if (ts[i]=='\\') ts[i] = '';
			is = ie+1;
			i++;
			//if (i> 3) break;
		}

		if (typeof(date.getMonth === 'function')) datatype = 'Date';
		if (typeof(date) === 'number') datatype = 'number';
		for (i=0,il=tf.length; i<il; i++) {
			switch (datatype) {
			  case 'Date':
				switch (tf[i]) {
					case 'LF':	// Line Break
						aret[iarr] = strRet;
						strRet = '';
						iarr++;
						break;
					case 'mm':
						strRet = strRet + date.mm();
						break;
					case 'hh':
						strRet = strRet + date.hh();
						break;
					case 'dd':
						strRet = strRet + date.dd();
						break;
					case 'MMMM':
						strRet = strRet + date.MMMM();
						break;
					case 'MMM':
						strRet = strRet + date.MMM();
						break;
					case 'MM':
						strRet = strRet + date.MM();
						break;
					case 'eeee':
						strRet = strRet + date.eeee();
						break;
					case 'eee':
						strRet = strRet + date.eee();
						break;
					case 'ee':
						strRet = strRet + date.ee();
						break;
					case 'yy':
						strRet = strRet + date.yy();
						break;
					case 'yyyy':
						strRet = strRet + date.yyyy();
						break;
					default:
						strRet = strRet + tf[i];
						break;
				}
				break;
				
			  case 'number':
			    if (tf[i].search(/#+/)>=0) { // number formatting string
					var pre = tf[i].length;
					var post = 0;
					if (tf[i+1] && tf[i+1].search(/#+/)>=0) { // there is format information for precision
						i++;
						post = tf[i].length;
						var s = date.toFixed(post);
						if (ts[i-1]) s = s.replace(/[\.\,\:]/,ts[i-1]);
						strRet = strRet + s;
					} else {
						strRet = strRet + date.toPrecision(pre);
					}
				} else {
					switch (tf[i]) {
						case 'LF':	// Line Break
							aret[iarr] = strRet;
							strRet = '';
							iarr++;
							break;
						default:
							strRet = strRet + tf[i];
							break;
					}
				}
				break;
			}
			if (i<il-1) strRet += ts[i];
		}
		aret[iarr] = strRet;
		return aret;
	},
	moveto: function(elem,x,y,duration,fonend) { // helper function for smooth movement graphical elements of the chart (used for cursor)
		var xact = elem.attr("x");
		var yact = elem.attr("y");
		if (xact === undefined) {xact = x; elem.attr({'x':x});}
		if (yact === undefined) {yact = y; elem.attr({'y':y});}
		
		elem.attr({'x':x});
		elem.attr({'y':y});
		//console.log('in Values: ',xact,yact,x,y);
		if (Math.abs(xact-x)>10 || Math.abs(yact-y)>10) {
			animateMovement(elem,parseFloat(xact),parseFloat(yact),parseFloat(x),parseFloat(y),duration/10);
		}
		
		function animateMovement(sel, cx, cy, mx, my, steps, istep) { // recursively called function for animating position change for SVG
			if (istep === undefined) istep=0; // initialize counter
			if(istep <= steps) {
				sel.attr("x", cx+(mx-cx)/steps*istep);
				sel.attr("y", cy+(my-cy)/steps*istep);
			
				istep++;
				setTimeout(function(){ animateMovement(sel,cx,cy,mx,my,steps,istep);},10);
			} else {
				fonend(sel.attr('x'),sel.attr('y'));
			}
		}
	},
	movetoLine: function(etype,elem,x1,y1,x2,y2,duration,fonend) { // helper function to move the cursor line smoothly
		var x1act = elem.attr("x1");
		var y1act = elem.attr("y1");
		var x2act = elem.attr("x2");
		var y2act = elem.attr("y2");
		if (x1act === undefined) {x1act = x1; elem.attr({'x1':x1});}
		if (y1act === undefined) {y1act = y1; elem.attr({'y1':y1});}
		if (x2act === undefined) {x2act = x2; elem.attr({'x2':x2});}
		if (y2act === undefined) {y2act = y2; elem.attr({'y2':y2});}
		
		if (parseFloat(x1act)==parseFloat(x1) && 
			parseFloat(y1act)==parseFloat(y1) && 
			parseFloat(x2act)==parseFloat(x2) && 
			parseFloat(y2act)==parseFloat(y2) ||
			(etype != 'mousemove' && etype != 'touchmove')){ // no move event no animation.
			elem.attr({'x1':x1,'x2':x2,'y1':y1,'y2':y2});
			return;
		}
		
		elem.attr({'x1':x1});
		elem.attr({'y1':y1});
		elem.attr({'x2':x2});
		elem.attr({'y2':y2});

		var data = elem.parents("[class^=basesvg]").parent().data();
		if (Math.abs(x1act-x1)>10 || Math.abs(y1act-y1)>10 || Math.abs(x2act-x2)>10 || Math.abs(y2act-y2)>10) {
			if (data.timers.running) {
				data.timers.running = false;
				clearTimeout(data.timers.id);
				data.timers.running = true;
				animateMovementLine(elem,data,parseFloat(x1act),parseFloat(y1act),parseFloat(x1),parseFloat(y1),parseFloat(x2act),parseFloat(y2act),parseFloat(x2),parseFloat(y2),duration/10);
			} else {
				data.timers.running = true;
				animateMovementLine(elem,data,parseFloat(x1act),parseFloat(y1act),parseFloat(x1),parseFloat(y1),parseFloat(x2act),parseFloat(y2act),parseFloat(x2),parseFloat(y2),duration/10);
			}
		}
		
		function animateMovementLine(sel, data, c1x, c1y, m1x, m1y, c2x, c2y, m2x, m2y, steps, istep) { // recursively called function for animating position change for SVG
			if (istep === undefined) istep=0; // initialize counter
			if (istep <= steps) {
				sel.attr("x1", c1x+(m1x-c1x)/steps*istep);
				sel.attr("y1", c1y+(m1y-c1y)/steps*istep);
				sel.attr("x2", c2x+(m2x-c2x)/steps*istep);
				sel.attr("y2", c2y+(m2y-c2y)/steps*istep);
				//console.log('normal',c1x+(m1x-c1x)/steps*istep,istep,instance,data.timers.id);
				istep++;
				data.timers.id = setTimeout(function(){ animateMovementLine(sel,data,c1x,c1y,m1x,m1y,c2x,c2y,m2x,m2y,steps,istep);},10);
			} else {
				//console.log('end',c1x+(m1x-c1x)/steps*istep,steps,instance,data.timers.id);
				data.timers.running = false;
				fonend(sel.attr('x1'),sel.attr('y1'),sel.attr('x2'),sel.attr('y2'));
			}
		}
	},
	getDaysAgo: function (inStr, data) { // helper function to check date strings
		var dStr = inStr;
		var doRounding = false;
		var now, ddiff;
		data.xclassifier = '';
		if ($.isNumeric(dStr)) return (!data.nofulldays)?parseInt(dStr):parseFloat(dStr);
		var classifier = ($.isNumeric(dStr))?'':dStr.charAt(dStr.length-1);	// check if last character of input string for 'd','D','w','W','m','M','y','Y'
		if (new RegExp("[hHdDwWmMyY]").test(classifier) && dStr!='now') {dStr=dStr.slice(0,dStr.length-1);}
		if (new RegExp("[HDWMY]").test(classifier)) {classifier = classifier.toLowerCase(); doRounding = true;} // check if capital letter and set rounding flag
		data.xclassifier = classifier;
		if ($.isNumeric(dStr)) { // check if string is a number and not a date string
			switch(classifier) {
				case 'h': // number counts in hours
					if (!doRounding) {
						now = new Date();
						var hours = parseInt(dStr);
						var minutes = (parseFloat(dStr) - hours)*60;
						ddiff = widget_chart.dateDiff(new Date(now.getFullYear(),now.getMonth(),now.getDate(),now.getHours(),now.getMinutes(),0,0), new Date(now.getFullYear(),now.getMonth(),now.getDate(),hours,minutes,0,0), 'd');
					} else {
						ddiff = parseFloat(dStr)/24;
						if (!data.nofulldays) ddiff = parseInt(ddiff);
					}
					return ddiff;
				case 'd': // number counts in days
					ddiff = parseFloat(dStr);
					if (!data.nofulldays) ddiff = parseInt(ddiff);
					return ddiff;
				case 'w': // number counts in weeks
					now = new Date();
					ddiff = widget_chart.dateDiff(new Date(now.getFullYear(),now.getMonth(),doRounding?now.getDate()-7*(parseFloat(dStr)+1)+(6-now.getDay()):now.getDate()-7*(parseFloat(dStr)+1),now.getHours(),now.getMinutes(),0,0), new Date(now.getFullYear(),now.getMonth(),now.getDate(),0,0,0,0), 'd');
					if (!data.nofulldays) ddiff = parseInt(ddiff-((ddiff>0)?0:1)); // correction for change from positive to negative values
					return ddiff;
				case 'm': // number counts in months
					now = new Date();
					ddiff = widget_chart.dateDiff(new Date(now.getFullYear(),now.getMonth()-dStr-(doRounding?0:1),doRounding?1:now.getDate()+1,0,0,0,0), new Date(now.getFullYear(),now.getMonth(),now.getDate(),now.getHours(),now.getMinutes(),0,0), 'd');
					if (!data.nofulldays) ddiff = parseInt(ddiff-((ddiff>0)?0:1)); // correction for change from positive to negative values
					return ddiff;
				case 'y': // number counts in years
					now = new Date();
					ddiff = widget_chart.dateDiff(new Date(now.getFullYear()-dStr-(doRounding?0:1),doRounding?0:now.getMonth(),doRounding?1:now.getDate()+1,0,0,0,0), new Date(now.getFullYear(),now.getMonth(),now.getDate(),now.getHours(),now.getMinutes(),0,0), 'd');
					if (!data.nofulldays) ddiff = parseInt(ddiff-((ddiff>0)?0:1)); // correction for change from positive to negative values
					return ddiff;
			}
		}
		if (dStr.charAt(dStr.length-1)!='Z') dStr = dStr+'Z';	// correction if necessary to avoid interpretation of non Zulu times
		var ds = new Date(dStr);
		if (dStr == "nowZ") { // set date to current minute
			now = new Date();
			ddiff = widget_chart.dateDiff(new Date(now.getFullYear(),now.getMonth(),now.getDate(),now.getHours(),now.getMinutes(),0,0), new Date(now.getFullYear(),now.getMonth(),now.getDate(),0,0,0,0), 'd');
			if (!data.nofulldays) ddiff = parseInt(ddiff);
			return ddiff;
		} else if (isNaN(ds.getMonth())) { // date string is not valid
			return 'NaN';
		} else {
			now = new Date();
			ddiff = widget_chart.dateDiff(ds, new Date(now.getFullYear(),now.getMonth(),now.getDate(),-now.getTimezoneOffset()/60-now.stdTimezoneOffset()/60,0,0,0), 'd');
			if (!data.nofulldays) ddiff = parseInt(ddiff+(ddiff<0?-0.5:0.5));
			return ddiff;
		}
	},
	dateDiff: function (dfrom,dto,selector){ // helper function for calculation of date differences
		//dfrom: Startdatum als String, "" fuer das aktuelle Datum/Zeit oder Date-Object
		//dto:   Enddatum als String, "" fuer das aktuelle Datum/Zeit  oder Date-Object
		//selctor: 'ms' Millisekunden, 's' Sekunden, 'm' Minuten, 'h' Stunden,
		// 'd' tage, 'w' wochen, 'y' ganze Jahre
		var dfy,dy;
		var osl = {ms:1,s:1000,m:60000,h:3600000,d:86400000,w:604800000,y:-1};
		var df = typeof(dfrom)=="object" ? dfrom : dfrom==="" ? new Date() : new Date(dfrom);
		var dt = typeof(dto)=="object" ? new Date(dto) : dto==="" ? new Date() : new Date(dto);
		var sl = osl[selector] || 1;
		var sz= sl >= osl.d ? (df.getTimezoneOffset()-dt.getTimezoneOffset())*60000 : 0;
		//console.log(dt.getTime(),df.getTime(),sz,sl,(dt.getTime() - df.getTime() +sz)/sl);
		if(sl > 0) return (dt.getTime() - df.getTime() +sz)/sl;
		else {
			dfy = df.getFullYear();
			dy = dt.getFullYear() - dfy;
			dt.setFullYear(dfy);
			return (dt.getTime() < df.getTime()) ? dy -1 : dy;
		}
	},
	formatTicksText: function(text,fix,unit,format) { // helper function for correct formatting of axis ticks
		if (format) {
			return widget_chart.getDateTimeNumberString(parseFloat(text),format)+unit;
		} else {
			return ((fix>-1 && fix<=20) ? parseFloat(text.toFixed(fix)) : text)+unit;
		}
	},
	getFormattedText: function(txt) { // helper function to generate svg text element with html formatting possibilities
		var outtext = String(txt);
		
		outtext = outtext.replace(/\<i\>/g,'<tspan style="font-style: italic">');
		outtext = outtext.replace(/\<\/i\>/g,'</tspan>');
		outtext = outtext.replace(/\<b\>/g,'<tspan style="font-weight: bold">');
		outtext = outtext.replace(/\<\/b\>/g,'</tspan>');
		outtext = outtext.replace(/\<em\>/g,'<tspan style="font-style: italic">');
		outtext = outtext.replace(/\<\/em\>/g,'</tspan>');
		outtext = outtext.replace(/\<small\>/g,'<tspan style="font-size: small">');
		outtext = outtext.replace(/\<\/small\>/g,'</tspan>');
		outtext = outtext.replace(/\<strong\>/g,'<tspan style="font-style: bold">');
		outtext = outtext.replace(/\<\/strong\>/g,'</tspan>');
		outtext = outtext.replace(/\<mark\>/g,'<tspan style="">');
		outtext = outtext.replace(/\<\/mark\>/g,'</tspan>');
		outtext = outtext.replace(/\<del\>/g,'<tspan style="text-decoration: line-through">');
		outtext = outtext.replace(/\<\/del\>/g,'</tspan>');
		outtext = outtext.replace(/\<ins\>/g,'<tspan style="text-decoration: underline">');
		outtext = outtext.replace(/\<\/ins\>/g,'</tspan>');
		outtext = outtext.replace(/\<sub\>/g,'<tspan dy="0.3em" style="font-size: smaller">');
		outtext = outtext.replace(/\<\/sub\>/g,'<tspan dy=-0.3em> </tspan></tspan>');
		outtext = outtext.replace(/\<sup\>/g,'<tspan dy="-0.3em" style="font-size: smaller">');
		outtext = outtext.replace(/\<\/sup\>/g,'<tspan dy=0.3em> </tspan></tspan>');
		outtext = outtext.replace(/\<class=.[^>]*\>/g,function(x) {
			var cls = x.replace('<class=','').replace('>','');
			return '<tspan class="'+cls+'">';
		});
		outtext = outtext.replace('</class>','</tspan>');

		return outtext;
	},
	getTextObjectSize: function(elem,obj_str) { // helper function to get size of svg text objects
		if (!obj_str) return 0;
		var inner = $(widget_chart.getFormattedText(obj_str));
		var el = $('<svg>'+widget_chart.getFormattedText(obj_str)+'</svg>').attr('class',inner.attr('class'));
		elem.parent().append(el);
		var ret = el.children()[0].getBoundingClientRect();
		el.remove();
		return ret;
	},
	generateWrappedHeader: function (elem,data,fontsize) { // helper function to generate header svg text objects with wrapping
		if (!data.title) return;

		var tabsize = 4*widget_chart.getTextSizePixels(elem,'0',('caption'+(data.title_class?' '+data.title_class:''))).width;
		var headstr = widget_chart.parseForTitle(data.title,data.pointsarray,data.mindate).replace(/\\n/g,' \n ').replace(/  \\n/g,' \n').replace(/\\n  /g,'\\n '); // make sure that \n is surrounded by spaces
		var headstr = widget_chart.parseForTitle(data.title,data.pointsarray,data.mindate).replace(/\\t/g,' \t ').replace(/  \\t/g,' \t').replace(/\\t  /g,'\\t '); // make sure that \t is surrounded by spaces
		var headparts = headstr.split(' ');
		var has_tabs = (headstr.search(/\t/)>-1);
		var text_anchor = has_tabs?'left':'middle'; // if text contains tabs orientation should start left
		var text_position = has_tabs?'0':'50%'; // if text countains tabs orientation should start left
		var text_left = has_tabs?parseInt(text_position):0;
		var ilines = 1;
		var headstr_part = '';
		var temp_obj = '';
		data.title_object = '';
		$.each(headparts, function(ind,val) { // loop through all words in header to allow wrapping when width increases width of chart area

			temp_obj = '<text style="white-space: pre;" class="'+('caption'+(data.title_class?' '+data.title_class:''))+'" x='+text_position+' y="'+((fontsize)*ilines+data.margin)+'px'+'" text-anchor='+text_anchor+'>'+headstr_part+'</text>';
			var tpart_size = headstr_part!=''?widget_chart.getTextObjectSize(elem,temp_obj.replace(headstr_part,headstr_part+val)):0;
			if ((tpart_size.width+text_left) > data.basewidth || val=='\\n' || val=='\t') { // size too big, create new line
				data.title_object += temp_obj;
				if (val=='\t') {
					text_position = parseInt(text_position)+(parseInt(tpart_size.width/tabsize)*tabsize+tabsize);
					text_left = has_tabs?parseInt(text_position):0;
					headstr_part = val.replace('\t','')+((val=='\t')?'':' ');
				} else {
					ilines++;
					headstr_part = val.replace('\\n','')+((val=='\\n')?'':' ');
					text_position = has_tabs?'0':'50%'; // if text countains tabs orientation should start left
					text_left = has_tabs?parseInt(text_position):0;
				}
			} else {
				headstr_part += val+' ';
			}
		});

		if (headstr_part.length > 0) { // there is a rest after last line break that needs to be added
			temp_obj = '<text style="white-space: pre;" class="'+('caption'+(data.title_class?' '+data.title_class:''))+'" x='+text_position+' y="'+((fontsize)*ilines+data.margin)+'px'+'" text-anchor='+text_anchor+'>'+headstr_part+'</text>';
			data.title_object += temp_obj;
			data.title_lines = ilines; // already counted ilines up;
		} else {
			data.title_lines = ilines-1;
		}
		
		data.title_object = widget_chart.getFormattedText(data.title_object);
	},
	roundXticks: function(round_in, x, xrange, startdate, asize) { // helper function to support correct xtick positions (rounded time values)
		var xret = x;
		var round;

		var actdate = new Date();
		actdate.setTime(startdate.getTime() + x*60*1000); // non rounded date according to input
		var ydays = (actdate.isLeapYear()?366:365)+1; // be sure to round to right number of days for actual year

		if (round_in == 'auto') {
			if (xrange/60/24 <= 2) { // less than 2 days, do rounding on hour base
				round = 'h';
			} else if (xrange/60/24/7 <= 2) { // less than 2 weeks, do rounding on day base
				round = 'd';
			} else if (xrange/60/24/ydays*12 < 2) { // less than 2 months, do rounding on week base
				round = 'w';
			} else if (xrange/60/24/ydays < 1.5) { // less than 1.5 years, do rounding on month base
				round = 'm';
			} else { // do rounding on year base
				round = 'y';
			}
		} else {
			round = round_in;
		}

		switch(round) {
			case 'h': // rounding to hours
				var xstart = startdate.getMinutes(); // correction needed to be sure that minutes inside full hour are skipped
				xret = parseInt((x)/60+0.5)*60-xstart; // correct xret to closest number of minutes to closest hour since start date/time
				break;
			case 'd': // rounding to days
				var xstart = startdate.getMinutes()+startdate.getHours()*60; // correction needed to be sure that hours inside full day are skipped
				xret = parseInt(x/60/24+0.5)*60*24-xstart; // correct xret to number of minutes to closest day since start date/time
				break;
			case 'w': // rounding to weeks
				if (asize == 7) {
					var xstart = startdate.getMinutes()+startdate.getHours()*60+startdate.getDay()*60*24; // correction needed to be sure that hours inside full day are skipped
				} else if (asize == 3.5) {
					var xstart = startdate.getMinutes()+startdate.getHours()*60+startdate.getDay()/2*60*24; // correction needed to be sure that hours inside full day are skipped
				}
				xret = parseInt(x/60/24/asize+0.5)*60*24*asize-xstart; // correct xret to number of minutes to closest first day of week since start date/time					
				break;
			case 'm': // rounding to months
				var xstart = startdate.getMinutes()+startdate.getHours()*60; // correction needed to be sure that hours inside full day are skipped
				if (actdate.getDate()<actdate.myGetDaysInMonth()/2) actdate.setTime(actdate.getTime()-actdate.getDate()*24*60*60*1000); // be sure to search for closest 1st of month
				var startmonth = (startdate.getDate()<startdate.myGetDaysInMonth()/2)?startdate.getMonth():startdate.getMonth()+1;
				var mdays = actdate.getDaysInMonthSum(startmonth); // number of full days since start time of full months lying before unrounded date plus 1 so first of next month
				xret = parseInt(x/60/24/mdays+0.5)*60*24*(mdays)-xstart; // correct xret to number of minutes to closest first day of month since start date/time
				break;
			case 'y': // rounding to years
				var xstart = startdate.getMinutes()+startdate.getHours()*60; // correction needed to be sure that hours inside full day are skipped				
				xret = parseInt(x/60/24/ydays+0.5)*60*24*ydays-xstart;
				break;
		}
		return xret;
	},
	checkClipping: function (settings,value) {
		if (!settings.min && !settings.max) return true;
		var check = function (setting,val,type) {
			if (!setting || !setting.dates) return 0;
			var valdate = ftui.dateFromString(val);
			switch(setting.timeref) {
				case 'd':
					var clipdate = ftui.dateFromString(valdate.getFullYear()+'-'+(valdate.getMonth()+1)+'-'+valdate.getDate()+' '+setting.dates[1]+':'+setting.dates[2]+':00');
					break;
				case 'm':
					var clipdate = ftui.dateFromString(valdate.getFullYear()+'-'+(valdate.getMonth()+1)+'-'+setting.dates[1]+' '+setting.dates[2]+':'+setting.dates[3]+':00');
					break;
				case 'y':
					var clipdate = ftui.dateFromString(valdate.getFullYear()+'-'+setting.dates[1]+'-'+setting.dates[2]+' '+setting.dates[3]+':'+setting.dates[4]+':00');
					break;
				default:
					var clipdate = ftui.dateFromString(setting.dates[1]+'-'+setting.dates[2]+'-'+setting.dates[3]+' '+setting.dates[4]+':'+setting.dates[5]+':00');
					break;
			}
			return ftui.diffMinutes(valdate,clipdate);
		}
		
		if (settings.min && (check(settings.min,value) > 0)) return false;
		if (settings.min && (check(settings.max,value) < 0)) return false;
		return true;
	},
	getClipPath: function(data,offset,elem,mode) { // helper function for setting clipping for shfit and scale animation
		var cp = '<path d="';
		var zBack = (data.DDD.Setting[0] && data.DDD.Setting[0]<0)?data.DDD.BackplaneZ(data.DDD,data.nGraphs):0;
		var zFore = (data.DDD.Setting[0] && data.DDD.Setting[0]<0)?0:data.DDD.BackplaneZ(data.DDD,data.nGraphs);
		var x0 = data.getGraphLeft();
		var x1 = x0 + data.graphWidth/100*data.basewidth/data.DDD.scaleX-(offset?offset:0);
		x0 -= (offset?offset:0);
		if (mode==1) { // used for graphs, take into account y min and max and care for 3D transformation
			var y0 = widget_chart.getTransformedPoint(data,elem,{x:0,y:0,z:zFore},true).y;;
			var y1 = widget_chart.getTransformedPoint(data,elem,{x:0,y:data.graphArea.height,z:zBack},true).y;
			var y2 = widget_chart.getTransformedPoint(data,elem,{x:data.graphArea.width,y:data.graphArea.height,z:zBack},true).y;
			var y3 = widget_chart.getTransformedPoint(data,elem,{x:data.graphArea.width,y:0,z:zFore},true).y;
		} else if (mode==2) { // cursor clip path
			var y0 = widget_chart.getTransformedPoint(data,elem,{x:0,y:0,z:zFore},true).y;;
			var y1 = widget_chart.getTransformedPoint(data,elem,{x:0,y:data.graphArea.height,z:zFore},true).y;
			var y2 = widget_chart.getTransformedPoint(data,elem,{x:data.graphArea.width,y:data.graphArea.height,z:zFore},true).y;
			var y3 = widget_chart.getTransformedPoint(data,elem,{x:data.graphArea.width,y:0,z:zFore},true).y;
			x0 = -1000000;
			x1 = 1000000;
		} else if (mode==3) { // x-axis clip path, keep a bit of non clipped space on the right and left side.
			var y0 = 0;
			var y1 = 1000000;
			var y2 = 1000000;
			var y3 = 0;
			x0 -= 0;//(data.graphArea.left-data.chartArea.left);
			x1 += 0;//((data.chartArea.left+data.chartArea.width)-(data.graphArea.left+data.graphArea.width));
		} else { // text, lines clip path
			var y0 = 0;
			var y1 = 1000000;
			var y2 = 1000000;
			var y3 = 0;
		}
		cp += 'M'+x0+','+y0;
		cp += ' L'+x0+','+y1;
		cp += ' '+x1+','+y2;
		cp += ' '+x1+','+y3;
		cp += ' '+x0+','+y0;
		cp += ' Z"'+' style=""></path>';
		return cp;
	},
	getClipSettings: function(cliprange_in) {
		var clipsettings = {};
		
		if (cliprange_in && cliprange_in != '') {
			var cliprange = $.isArray(cliprange_in)?cliprange_in:cliprange_in.split(',');
			var cr = [];
			cr[0] = (cliprange.length && cliprange.length>0)?cliprange[0]:cliprange;
			cr[1] = (cliprange.length && cliprange.length>1)?cliprange[1]:cliprange;

			var parse = function (val) {
				var ret = {};
				var m = val.match(/(\d+):(\d+).*/);
				if (m) {ret.type='rel'; ret.timeref='d'; ret.dates=m;} // only hour and minutes are given, -> relative clipping per day
				var m = val.match(/(\d+)[_\s](\d+):(\d+).*/);
				if (m) {ret.type='rel'; ret.timeref='m'; ret.dates=m;} // day, hour and minutes are given, -> relative clipping per month
				var m = val.match(/(\d+)-(\d+)[_\s](\d+):(\d+).*/);
				if (m) {ret.type='rel'; ret.timeref='y'; ret.dates=m;} // month day, hour and minutes are given, -> relative clipping per year
				var m = val.match(/(\d+)-(\d+)-(\d+)[_\s](\d+):(\d+).*/);
				if (m) {ret.type='abs'; ret.timeref=''; ret.dates=m;} // fully specified date including year -> absolute clipping, no repetition
				return ret;
			}
			clipsettings.min = parse(cr[0]);
			if (cr[0] != cr[1]) clipsettings.max = parse(cr[1]);
		}
		return clipsettings;
	},
	getXTOffset: function(x,xold,time,timeformat,xtext_offset) { // helper function to get possible shifts of text written to x-Axis (if time text is given as days, months, years)
		if (!timeformat) return 0;
		var diff = x-xold;
		if (diff < (24*60)) diff = 0;
		if (timeformat=='' || timeformat.search('mm')>-1 || timeformat.search('hh')>-1) { // time text will contain minutes or hours so no automatic shift should be done
			diff = 0;
		} else if (timeformat.search('dd')>-1 || timeformat.search('ee')>-1) { // time text will contain days, in case of auto shift we have an offset of half a day
			diff =  24*60/2;
		} else if (timeformat.search('MM')>-1) { // time text will contain months, in case of auto shift we have an offset of half a month
			diff =  time.myGetDaysInMonth()*24*60/2;
		} else if (timeformat.search('yy')>-1) { // time text will contain years, in case of auto shift we have an offset of half a month
			diff =  (time.isLeapYear()?366:365)*24*60/2;
		}

		var offset = xtext_offset?((xtext_offset=='auto')?diff:xtext_offset):0;
		return offset;
	},
	doShowHideGridlines: function(data,elem) { // helper function to toggle gridline display when axis string is clicked
		var cyclicSum = function(arrayW,ind1,ind2) {
			var ret=0;
			if (ind2>=ind1) {
				ret = arrayW.sum(ind1,ind2);
			} else if (ind1>ind2) {
				ret = arrayW.sum(ind1,arrayW.length-1) + arrayW.sum(0,ind2);
			}
			return ret;
		};
		
		var changeYAxes = function(data,el,uaxis,yticks,index) { // move major y Axis closest to chart area and shift the others accordingly
			elem.find('line.'+yticks+uaxis+'-'+index).show();
			if (!data.show_both_axes) {
				elem.find("[class^='yaxis "+((uaxis!='secondary')?"secondary":"primary")+"']").hide();
				elem.find("[class^='yaxis "+((uaxis!='secondary')?"primary":"secondary")+"']").show();
			}
			$.each(data.yLimits, function(ind,val){
				var el = elem.find('[class*=yaxis_'+uaxis+'-'+ind+']'); // find object fitting to actual yaxis slot
				if (el.length > 0) {
					var axisPar = (uaxis!='secondary')?val.primary:val.secondary;
					var xshift = (axisPar.yticks_prio)?0:((uaxis!='secondary')?-(data.unusedYAxesVisible?cyclicSum(data.textWidth_prim,index,ind-1):0):(data.unusedYAxesVisible?cyclicSum(data.textWidth_sec,index,ind-1):0));
					var opacity = data.unusedYAxesVisible?1:((uaxis!='secondary')?(ind==index?1:0):(ind==index?1:0));
					var style = el.attr('style');
					style = data.unusedYAxesVisible?style.replace(/translateX\(.*\)/,'translateX('+xshift+'px)'):style.replace(/opacity\:.*\;/,'opacity:'+opacity+';');
					el.attr('style',style);
				}
			});
		};
		
		elem.find('line.yticks').hide();
		$.each(data.yLimits, function(ind,val) {
			if (this.primary.yticks_prio) changeYAxes(data,elem,'primary','yticks.',ind);
			if (this.secondary.yticks_prio) changeYAxes(data,elem,'secondary','yticks.',ind);
		});
		
		widget_chart.getBrowserCaps().doSVGTransformCorrection(elem);

	},
	resetTime: function(event) {
		var elem = $(event.delegateTarget);
		var baseobject = elem.closest("[class^=basesvg]").parent();
		var data = baseobject.data();
		
		if (data.iZoom === undefined || data.iZoom < 0) return;
		
		data.daysago_start_old = data.daysago_start;
		data.daysago_end_old = data.daysago_end;
		data.daysago_start = data.daysago_start_list[data.iZoom];
		data.daysago_end = data.daysago_end_list[data.iZoom];
		
		data.iZoom--;
		if (data.iZoom<0) data.iZoom = 0;
		
		baseobject.data(data);

		widget_chart.zoomTimeAnimated(baseobject,0,20,function(){
			if (data.iZoom == 0) data.nofulldays = data.nofulldays_old;
		});

		return;
	},
	zoomTime: function(event) {
		var elem = $(event.delegateTarget);
		var baseobject = elem.closest("[class^=basesvg]").parent();
		var data = baseobject.data();
		var xleft = elem.data('xleft');
		var xright = elem.data('xright');
		
		if (!xleft.getDate) return;
		if (!xright.getDate) return;

		if (data.iZoom === undefined || data.iZoom < 0) {
			data.iZoom = 0;
			data.daysago_start_list = [];
			data.daysago_end_list = [];
		} else {
			data.iZoom++;
		}

		data.daysago_start_list[data.iZoom] = data.daysago_start;
		data.daysago_start_old = data.daysago_start;
		data.daysago_start = xleft.getDateStringFHEM();

		data.daysago_end_list[data.iZoom] = data.daysago_end;
		data.daysago_end_old = data.daysago_end;
		data.daysago_end = xright.getDateStringFHEM();
		
		data.nofulldays_old = data.nofulldays;
		data.nofulldays = true;
		
		baseobject.data(data);

		widget_chart.zoomTimeAnimated(baseobject,0,20,function(){});

		return;
	},
	zoomTimeAnimated: function(elem,index,steps,callback) {
		var data = elem.data();
		data.offsetX = 0; // offset for shifting arbitrarily due to mousemove and touchmove handling
		data.scaleX = 1; // scale for scaling arbitrarily due to mousemove and touchmove handling
		data.scaleDeltaX = 0; // scale for scaling arbitrarily due to mousemove and touchmove handling
		
		var days_start_old = widget_chart.getDaysAgo(data.daysago_start_old,data);
		var days_start = widget_chart.getDaysAgo(data.daysago_start,data);
		var days_end_old = widget_chart.getDaysAgo(data.daysago_end_old,data);
		var days_end = widget_chart.getDaysAgo(data.daysago_end,data);


		setTimeout(function() {
			if (index <= steps) {
				var ds = days_start_old*(steps-index)/steps+days_start*index/steps;
				var de = days_end_old*(steps-index)/steps+days_end*index/steps;
				var scl = (days_end_old - days_start_old)/(de - ds);
				var dlt = -(days_start_old-ds)*scl*24*60;					// new delta in minutes
				dlt = dlt/data.xrange*data.basewidth*data.graphWidth/100-data.getGraphLeft()*(scl-1);	// new delta in pixels

				widget_chart.shiftXContent(elem,data.offsetX,scl,dlt,data)
				index++;
				widget_chart.zoomTimeAnimated(elem,index,steps,callback);
			} else {
				widget_chart.refresh(elem,'start reset',0);
				callback();
				var theDoc = (data.popup)?elem:$(document);
				theDoc.find("[class^=basesvg]").each(function() {
					if ($(this).parent().is(':visible')) {
						if (($(this).parent().data().scrollgroup == data.scrollgroup) && data.scrollgroup!==undefined && data.instance!=$(this).parent().data().instance && $(this).parent().data().baseDone) {
							$(this).parent().data('daysago_start',data.daysago_start);
							$(this).parent().data('daysago_end',data.daysago_end);
							widget_chart.refresh($(this).parent(),'start reset',0);
						}
					}
				});
			}
		},2000/steps);

	},
	showHideGridlines: function(event) { // helper function to prepare for toggle gridline display when axis string is clicked
		var elem = $(event.delegateTarget);
		var data = elem.closest("[class^=basesvg]").parent().data();
		var isPrimary = (elem.attr('class').search('primary')>-1);
		var AI = parseInt(elem.attr('class').replace(/.*-/,''));
		$.each(data.yLimits, function(ind,val){
			this.primary.yticks_prio = false;
			this.secondary.yticks_prio = false;
		});

		if (!data.unusedYAxesVisible) { // we need to find the next axis of the selected type and display this axis
			var elaxes = elem.parent()
			elaxes.find("[class*="+elem.attr('class').replace(/.*yaxis/,'yaxis').replace(/-.*/,'')+"]").each(function() {
				if ($(this).css('opacity') == 1) AI = parseInt($(this).attr('class').replace(/.*-/,'')) // find currently visible axis
			});
			if (elaxes.find("[class*="+elem.attr('class').replace(/.*yaxis/,'yaxis').replace(/-.*/,'-'+parseInt(AI+1))+"]").length > 0) { // there is an axis with higher AI, take this one
				AI++;
			} else { // no axis with higher index, take lowest one
				var xs = elaxes.find("[class*="+elem.attr('class').replace(/.*yaxis/,'yaxis').replace(/-.*/,'')+"]");
				var AI = Infinity;
				xs.each(function() {
					var aindex = parseInt($(this).attr('class').replace(/.*-/,''));
					if (aindex < AI) AI = aindex;
				});
				if (AI == Infinity) AI = 0;
			}
			
			if (AI > data.yLimits.length-1) AI = 0;
		}

		if (isPrimary) {
			data.yLimits[AI].primary.yticks_prio = true;
		} else {
			data.yLimits[AI].secondary.yticks_prio = true;			
		}

		widget_chart.doShowHideGridlines(data,elem.closest("[class^=basesvg]").parent());
	},
	shiftXContent: function(_baseobject,_currentDistance,_currentScale,_currentScaleDelta,_data,noprop) {
		if (!_data.DDD || !_data.graphArea) return;
		var scale = _currentScale;
		var offset = _currentScaleDelta;
		var subobject = _baseobject.find("[id=baseforDDD]");
		_data.startXMove = _currentDistance;
		_data.offsetX = _currentDistance;
		_data.scaleX = _currentScale;
		_data.scaleDeltaX = _currentScaleDelta;

		var transform2position = function(e,d,o) {
			if (e.attr('x1')) { // line
				if (e.attr('x1_orig') === undefined) e.attr({'x1_orig':e.attr('x1')});
				if (e.attr('x2_orig') === undefined) e.attr({'x2_orig':e.attr('x2')});
				var x1 = parseInt(e.attr('x1_orig')||e.attr('x_orig'));
				var x2 = parseInt(e.attr('x2_orig')||e.attr('x_orig'));
				x1 = x1*d.scaleX+d.offsetX+o;
				x2 = x2*d.scaleX+d.offsetX+o;
				e.attr({'x1':x1,'x2':x2});
			} else if (e.attr('x')) { // point
				if (e.attr('x_orig') === undefined) e.attr({'x_orig':e.attr('x')});
				var x = parseInt(e.attr('x1_orig')||e.attr('x_orig'));
				x = x*d.scaleX+d.offsetX+o;
				e.attr({'x':x});
			}
		}

		var distance = _currentDistance + offset;
		subobject.find("svg.chart-primsec").find("g.graph-parent").css(_data.DDD.prefix+'transform','translate('+distance+'px, 0px)'+' scale('+scale+',1)');
		subobject.find("g.text.xaxis").children().each(function() {transform2position($(this),_data,offset);});
		subobject.find("g.chart-gridlines").find("line.xticks").each(function() {transform2position($(this),_data,offset);});

		var distance = _currentDistance-_data.graphArea.width*scale + offset;
		var subobject = _baseobject.find("[id=baseforDDD-previous]");
		subobject.find("svg.chart-primsec").find("g.graph-parent").css(_data.DDD.prefix+'transform','translate('+distance+'px, 0px)'+' scale('+scale+',1)');
		subobject.find("g.text.xaxis").children().each(function() {transform2position($(this),_data,-_data.graphArea.width*scale+offset);});
		subobject.find("g.chart-gridlines").find("line.xticks").each(function() {transform2position($(this),_data,-_data.graphArea.width*scale+offset);});

		var distance = _currentDistance+_data.graphArea.width*scale + offset;
		var subobject = _baseobject.find("[id=baseforDDD-next]");
		subobject.find("svg.chart-primsec").find("g.graph-parent").css(_data.DDD.prefix+'transform','translate('+distance+'px, 0px)'+' scale('+scale+',1)');
		subobject.find("g.text.xaxis").children().each(function() {transform2position($(this),_data,_data.graphArea.width*scale+offset);});
		subobject.find("g.chart-gridlines").find("line.xticks").each(function() {transform2position($(this),_data,_data.graphArea.width*scale+offset);});
		
		// check if other charts are in the same scrollgroup and shift them as well
		if (!noprop) {
			var theDoc = (_data.popup)?_baseobject:$(document);
			theDoc.find("[class^=basesvg]").each(function() {
				if ($(this).parent().is(':visible')) {
					var data = $(this).parent().data();
					if ((data.scrollgroup == _data.scrollgroup) && _data.scrollgroup!==undefined && _data.instance!=data.instance && data.baseDone) {
						widget_chart.shiftXContent($(this),_currentDistance,_currentScale,_currentScaleDelta,data,true);
					}
				}
			});
		}
	},
	detectSwipe: function(target,remove) { // helper function to handle swipe and pinch events
		var maxTime = 1000, // allow movement if < 1000 ms (1 sec)
		startX = 0,
		startXMove = 0,
		startScaleX = 1,
		startTime = 0,
		lastTap = 0,
		scaling = false,
		pinchDist = 0,
		timeout,
		startTouches = [],
		startLeftOffset = [],
		touch = "ontouchend" in document,
		startEvent = (touch) ? 'touchstart' : 'mousedown',
		moveEvent = (touch) ? 'touchmove' : 'mousemove',
		pinchEvent = (touch) ? 'gestureend' : '',
		endEvent = (touch) ? 'touchend' : 'mouseup';
		var e = false;
		
		target.on(startEvent, function(_e){
			if (!_e.originalEvent.touches) { // no 2 finger gestures are suppoprted, simulate it.
				if (!e) e = {timeStamp:_e.timeStamp, delegateTarget:_e.delegateTarget, preventDefault:_e.preventDefault, ctrlKey:_e.ctrlKey, stopPropagation:_e.stopPropagation, originalEvent:{touches:[]}};
				e.ctrlKey = _e.ctrlKey;
				e.originalEvent.touches[0] = {
					pageX:_e.originalEvent.touches ? _e.originalEvent.touches[0].pageX : _e.pageX,
					pageY:_e.originalEvent.touches ? _e.originalEvent.touches[0].pageY : _e.pageY};
				e.originalEvent.touches[1] = {
					pageX:(_e.originalEvent.touches ? _e.originalEvent.touches[0].pageX : _e.pageX)-100,
					pageY:(_e.originalEvent.touches ? _e.originalEvent.touches[0].pageY : _e.pageY)-100};
				e.timeStamp = _e.timeStamp;
			} else {
				e = _e;
			}
			//console.log("Start Event",e);
			// prevent image drag (Firefox)
			var baseobject = $(e.delegateTarget).parents("[class^=basesvg]").parent();
			var data = baseobject.data();
			if (!data.done || !data.baseDone || data.drawing) return; // check if we already have done one successful drawing or if we are in the middle of redraw.

			_e.preventDefault();
			_e.stopPropagation();

			startTime = e.timeStamp;
			startX = e.originalEvent.touches ? e.originalEvent.touches[0].pageX : e.pageX;
			startXMove = data.startXMove?data.startXMove:0; // keep actual shift in x direction in mind
			data.movingX = true;
			startScaleX = data.scaleX;

			if (e.originalEvent.touches && e.originalEvent.touches.length && e.originalEvent.touches.length === 2) {
				if ((!_e.originalEvent.touches && e.ctrlKey) || _e.originalEvent.touches) {
					scaling = true;
					data.offsetX = data.offsetX + data.scaleDeltaX;
					data.scaleDeltaX = 0;
				}
				startTouches[0] = e.originalEvent.touches[0].pageX;
				startTouches[1] = e.originalEvent.touches[1].pageX;
			}
			baseobject.data(data);
		})
		.on(endEvent, function(_e){
			//console.log("End Event",e);
			var baseobject = $(_e.delegateTarget).parents("[class^=basesvg]").parent();
			var data = baseobject.data();
			if (!data.done || !data.baseDone || data.drawing) return; // check if we already have done one successful drawing or if we are in the middle of redraw.
			if (data.crosshair) return;

			_e.preventDefault();
			_e.stopPropagation();

			var currentTime = new Date().getTime();
			var tapLength = currentTime - lastTap;        

			clearTimeout(timeout);
			if (tapLength < 500 && tapLength > 0){ // double click/tap, reset interactive scaling/shifting

				scaling = false;
				data.movingX = false;
				startX = 0;
				widget_chart.shiftXContent(baseobject,0,1,0,data);

			} else {

				//Single Tap/Click

				timeout = setTimeout(function(){
					clearTimeout(timeout); 
				}, 500);
			}

			lastTap = currentTime;

			scaling = false;
			startX = 0;
			startTime = 0;
			data.movingX = false;
			baseobject.data(data);

		})
		.on(moveEvent, function(_e){
			if (!_e.originalEvent.touches) { // no 2 finger gestures are suppoprted, simulate it.
				if (!e) e = {timeStamp:_e.timeStamp, delegateTarget:_e.delegateTarget, preventDefault:_e.preventDefault, ctrlKey:_e.ctrlKey, stopPropagation:_e.stopPropagation, originalEvent:{touches:[]}};
				e.ctrlKey = _e.ctrlKey;
				e.originalEvent.touches[0] = {
					pageX:_e.originalEvent.touches ? _e.originalEvent.touches[0].pageX : _e.pageX,
					pageY:_e.originalEvent.touches ? _e.originalEvent.touches[0].pageY : _e.pageY};
			} else {
				e = _e;
			}

			//console.log("Move Event",e);
			var baseobject = $(e.delegateTarget).parents("[class^=basesvg]").parent();
			var data = baseobject.data();
			if (!data.done || !data.baseDone || data.drawing) return; // check if we already have done one successful drawing or if we are in the middle of redraw.

			_e.preventDefault();
			_e.stopPropagation();

			var started = data.movingX;
			if (!started) return;
			var maxDistance = data.graphArea.width - (data.prefetch?1:50); // start reloading new data when distance to chart border is lower than 50 pixels

			if (data.crosshair) return;
			
			var getScaleDelta = function(current,start,scale,left) {
				var startLeftOffset = [start[0]-left,start[1]-left];
				var currentLefOffset = [current[0]-left,current[1]-left];
				return ((currentLefOffset[0] - startLeftOffset[0]*scale)+(currentLefOffset[1] - startLeftOffset[1]*scale))/2;
			}

			if (scaling) {
				var newTouches = [e.originalEvent.touches[0].pageX, e.originalEvent.touches[1].pageX];
				var scaleCurrent = (newTouches[0] - newTouches[1])/(startTouches[0] - startTouches[1]);
				var scaleX = scaleCurrent*startScaleX;

				var delta = getScaleDelta(newTouches,startTouches,scaleCurrent,data.graphArea.left);

				if (!data.DDD.has3D) { // no transform feature, so we can not use the live movement of the graphs.
					if (scaleX < 0.9) {
						widget_chart.scaleTime(e,baseobject,2);
						data.movingX = false;
						scaling = false;
						startX = 0;
						scaleX = 1;
					} else if (scaleX > 1.1) {
						widget_chart.scaleTime(e,baseobject,0.5);
						data.movingX = false;
						scaling = false;
						startX = 0;
						scaleX = 1;
					}
					return;
				}
				
				if (scaleX < 0.5) {
					scaling = false;
					data.movingX = false;
					startX = 0;
					scaleX = 1;
					startTime = 0;
					var offsetX = data.offsetX;
					widget_chart.scaleTime(e, baseobject, 2, true, true, function() {
						widget_chart.shift(e, baseobject, 0, true, false, function(){
							data = baseobject.data();
							widget_chart.shiftXContent(baseobject,(offsetX),scaleX,0,data);
						});
					});
				} else if (scaleX > 2) {
					scaling = false;
					data.movingX = false;
					startX = 0;
					scaleX = 1;
					startTime = 0;
					var offsetX = data.offsetX;
					widget_chart.scaleTime(e, baseobject, 0.5, true, true, function() {
						widget_chart.shift(e, baseobject, 0, true, false, function(){
							data = baseobject.data();
							widget_chart.shiftXContent(baseobject,(offsetX),scaleX,0,data);
						});
					});
				} else {
					widget_chart.shiftXContent(baseobject,data.offsetX,scaleX,delta,data);
				}
			} else {
				var currentX = e.originalEvent.touches ? e.originalEvent.touches[0].pageX : e.pageX,
					currentDistance = (startX === 0) ? 0 : (currentX - startX + startXMove),
					// allow if movement < 1 sec
					currentTime = e.timeStamp;

				if (!data.DDD.has3D) { // no transform feature, so we can not use the live movement of the graphs.
					if (Math.abs(currentDistance) > 100) {
						if (currentX < startX) {
							widget_chart.shift(e, baseobject, -1, true);
						}

						if (currentX > startX) {
							widget_chart.shift(e, baseobject, 1, true);
						}
						data.movingX = false;
						startTime = 0;
						startX = 0;
					}
					return;
				}

				widget_chart.shiftXContent(baseobject,currentDistance,data.scaleX,data.scaleDeltaX,data);
				
					// currentDistance = (startX === 0) ? 0 : Math.abs(currentX - startX),
					// allow if movement < 1 sec
					currentTime = e.timeStamp;
				if (Math.abs(currentDistance) > maxDistance) {
					if (currentX < startX) {
						// swipe left code here				
						widget_chart.shift(e, baseobject, -1, true, false, function() {
							currentDistance = 0;
							widget_chart.shiftXContent(baseobject,currentDistance,data.scaleX,data.scaleDeltaX,data);
						});
					}
					if (currentX > startX) {
						// swipe right code here
						widget_chart.shift(e, baseobject, 1, true, false, function() {
							currentDistance = 0;
							widget_chart.shiftXContent(baseobject,currentDistance,data.scaleX,data.scaleDeltaX,data);
						});
					}
					data.movingX = false;
					startTime = 0;
					startX = 0;
				}
			}
		});
	},
	checkEvent: function(event) { // helper function to do some special treatments/preparations for events
		event.preventDefault();
		var data = $(event.delegateTarget).parents("[class^=basesvg]").parent().data();
		if (!data.done || !data.baseDone || data.drawing) return; // check if we already have done one successful drawing or if we are in the middle of redraw.
		if (!data.last_mousemove_pos) data.last_mousemove_pos = {'x':-1,'y':-1};
		
		var x = event.pageX;
		var y = event.pageY;
		if (true || data.last_mousemove_pos.x != x || data.last_mousemove_pos.y != y) { // no new position, nothing to do
			widget_chart.doEvent(event);
			widget_chart.propagateEvent(event);
		}
		data.last_mousemove_pos.x = x;
		data.last_mousemove_pos.y = y;
	},
	propagateEvent: function(event) { // helper function to propagate event to other charts when they are in the same cursorgroup
		// check if other charts are in same cursorgroup and eventually trigger mouse events
		var target = $(event.delegateTarget).parents("[class^=basesvg]");
		var dataE = target.parent().data();
		var scE = dataE.days_start - dataE.days_end;
		var theDoc = (dataE.popup)?target.parent():$(document);
		theDoc.find("[class^=basesvg]").each(function() {
			if ($(this).parent().is(':visible')) {
				var data = $(this).parent().data();
				if ((data.cursorgroup == dataE.cursorgroup) && dataE.cursorgroup!==undefined && dataE.instance!=data.instance && data.baseDone) {
					var dShift = data.days_start-dataE.days_start;
					var sc = data.days_start-data.days_end;
					var scW = data.graphArea.width/dataE.graphArea.width;
					var e = $.Event(event.type);
					if (event.originalEvent && event.originalEvent.touches) {
						e.originalEvent = JSON.parse(JSON.stringify(event.originalEvent));
						if (event.originalEvent.touches && event.originalEvent.touches[0]) {
							var x = data.graphArea.left + ((event.originalEvent.touches[0].pageX-dataE.offsetX-dataE.graphArea.left)*scE/sc + (dShift/sc)*dataE.graphArea.width)*scW+data.offsetX+data.scaleDeltaX;
							var point = {x: x, y: event.originalEvent.touches[0].pageY };
							
							e.originalEvent.touches =	[{
															target: event.originalEvent.target,
															identifier: event.originalEvent.identifier,
															pageX: x,
															pageY: event.originalEvent.touches[0].pageY,
															screenX: x,
															screenY: event.originalEvent.touches[0].pageY,
															clientX: x,
															clientY: event.originalEvent.touches[0].pageY
														}]
						}
					} else {
						e.pageX = data.graphArea.left + ((event.pageX-dataE.offsetX-dataE.graphArea.left)*scE/sc + (dShift/sc)*dataE.graphArea.width)*scW+data.offsetX+data.scaleDeltaX;
					}
					e.delegateTarget = $(this).find("rect.chart-background, [id*='graph-']");
					widget_chart.doEvent(e);
				}
			}
		});
	},
	doEvent: function(event) { // function for activities to be performed when events occur
		var target = $(event.delegateTarget).parents("[class^=basesvg]");
		//console.log(event.type,target);
		var data = target.parent().data();
		var crosshair = target.find('g.crosshair');
		var crht = crosshair.find('text.crosshair');
		var crh_text = [];
		var evt;
		var values = [];
		var ind;
		var prefix;
		var p_n_offset;
		crht.each(function(index) {crh_text[index] = $(this);});

		switch (event.type) { // split into different activities for different events
			case 'mouseenter': case 'mousemove': case 'touchmove':
				if (event.type=='touchmove') { // event data in touchmove events is in originalEvent.touches[0]
					if (!event.originalEvent) break;
					evt=event.originalEvent.touches[0];
				} else {
					evt = event;
				}
				//$(event.delegateTarget).append(widget_chart.createElem('text').attr({'class':'debug','x':'20','y':'20'}));
				//event.preventDefault();
				if (data.crosshair)	{
					//console.log("Mouseenter Event",$(event.delegateTarget).parents("[class^=basesvg]").parent().data'crs_inactive'));
					if (crosshair && !data.crs_inactive && data.pointsarrayCursor) {
						var x = ((evt.pageX - data.chartArea.left));
//						var x = ((evt.pageX - data.chartArea.left - data.offsetX) - data.graphArea.width*(1-data.scaleX))/data.scaleX) - data.graphArea.width*(1-data.scaleX))/data.scaleX;
						var y = (evt.pageY - data.chartArea.top);
						var noticks = ( data.width <=100 ) ? true : target.parent().hasClass('noticks');
						if (data.logProxy) {
							var AI = data.getAxisIndex('primary');
							var pc = data.transD2W([-data.minx,-data.yLimits[AI].primary.shiftY],'primary');
							crosshair.find('line.crosshair').attr({'x1':pc[0], 'y1':pc[1], 'x2':x, 'y2':y});
							//widget_chart.movetoLine(event.type,crosshair.find('line.crosshair'),pc[0],pc[1],x,y,100,function(x1f,y1f,x2f,y2f){});
							values=[];
							ind = parseInt(Math.atan2(-y+pc[1],x-pc[0])/Math.PI*180+180);
							values = data.pointsarrayCursor[ind];
						} else {
							//crosshair.find('line.crosshair').attr({'x1':x, 'y1':data.topOffset, 'x2':x, 'y2':data.chartArea.height-(noticks?0:data.bottomOffset)});
							widget_chart.movetoLine(event.type,crosshair.find('line.crosshair'),x,data.topOffset,x,data.chartArea.height-(noticks?0:data.bottomOffset),100,function(x1f,y1f,x2f,y2f){});
							values=[];
							ind = parseInt((x-data.getOffsetX())/data.scaleX+0.5);
							if (ind < parseInt(data.graphArea.left-data.chartArea.left+0.5)) {
								if (data.pointsarrayCursor_prev && data.pointsarrayCursor_prev.length) {
									ind = parseInt(Math.max(ind+data.graphArea.width,0)+0.5);
									values = data.pointsarrayCursor_prev[ind];
									p_n_offset = -data.graphArea.width*data.scaleX+data.getOffsetX();
								} else {
									values = data.pointsarrayCursor[0];
									p_n_offset = data.getOffsetX();
								}
							} else if (ind >= data.pointsarrayCursor.length) {
								if (data.pointsarrayCursor_prev && data.pointsarrayCursor_prev.length) {
									ind = parseInt(Math.min(ind-data.graphArea.width,data.pointsarrayCursor_next.length)+0.5);
									values = data.pointsarrayCursor_next[ind];
									p_n_offset = data.graphArea.width*data.scaleX+data.getOffsetX();
								} else {
									values = data.pointsarrayCursor[data.pointsarrayCursor.length-1];
									p_n_offset = data.getOffsetX();
								}
							} else {
								values = data.pointsarrayCursor[ind];
								p_n_offset = data.getOffsetX();
							}
							//ind = ((parseInt(x+0.5)<=0)?0:((parseInt(x+0.5)>=data.pointsarrayCursor.length)?data.pointsarrayCursor.length-1:(parseInt(x+0.5))));
							//values = data.pointsarrayCursor[ind];
						}
						var lastV = data.lastV;
						var uxis;
						var i,il;
						var legendY;
						var minclip = data.graphArea.top - data.chartArea.top;
						var maxclip = data.graphArea.height + minclip;
						if (!lastV) lastV = values;
						if (!values) values = [];
						for (i=0,il=values.length; i<il; i++) {
							if (values[i] && lastV[i] && (values[i][0] != lastV[i][0])) {
								if (data.logProxy) {
									var p = data.transD2W([values[i][0],values[i][1]],'primary');
									//crh_text[i].attr({'x':p[0], 'y':p[1]});
									widget_chart.moveto(crh_text[i],p[0],p[1],200,function(xf,yf){});
									if (data.graphsshown[i] && data.cursorshown[i]) {
										crh_text[i].show();
										crh_text[i].find('tspan.crosshairValue').html(values[i][2] + " " + data.getAxisSetting('yunit','primary'));
									} else {
										crh_text[i].hide();
									}
								} else {
									uxis = widget_chart.getArrayValue(data.uaxis,i,'primary');
									var AI = data.getAxisIndex(uxis);
									var yscale = (data.isPrimary(uxis))?data.yLimits[AI].primary.scaleY:data.yLimits[AI].secondary.scaleY;
									var yshift = (data.isPrimary(uxis))?data.yLimits[AI].primary.shiftY:data.yLimits[AI].secondary.shiftY;
									var mx = data.getAxisSetting('max_save',uxis)
									var mn = data.getAxisSetting('min_save',uxis)
									legendY=(((mx-values[i][1]))/(mx-mn)*data.graphHeight/100*target.height()+data.topOffset);
									//crh_text[i].attr({'x':values[i][0], 'y':legendY+''});
									var valtxt = values[i][2]?values[i][2]:parseFloat(((values[i][1]+yshift)/yscale).toFixed(data.cursor_digits)) + " " + (data.getAxisSetting('yunit',uxis));
									if (data.graphsshown[i]  && data.cursorshown[i] && legendY>=minclip && legendY<=maxclip) {
										crh_text[i].show();
										crh_text[i].find('tspan.crosshairValue').html(valtxt);
									} else {
										crh_text[i].hide();
									}
									widget_chart.moveto(crh_text[i],values[i][0]*data.scaleX+p_n_offset,legendY,50,function(xf,yf){});
								/*	var rw = widget_chart.getTextSizePixels(target,prefix + valtxt,'text crosshair').width;
									var rh = widget_chart.getTextSizePixels(target,prefix + valtxt,'text crosshair').height;
									if (!crh_text[i].parent().find('rect').length) {
										crh_text[i].parent().prepend(widget_chart.createElem('rect').attr({'x':x-rw,'y':legendY-rh,'width':rw+'px','height':rh+'px','style':'z-index:10000; fill:black; opacity: 0.5'}));
									}
									var rec = crh_text[i].parent().find('rect');
									rec.attr({'x':values[i][0]-rw, 'y':legendY-rh, 'width':rw+'px','height':rh+'px'}); */
								}
							}
						}

						if (!data.logProxy) { // draw time value below x axis
							var itime=crh_text.length-1;
							legendY = data.graphHeight/100*target.height()+data.topOffset+widget_chart.getTextSizePixels(crh_text[itime].parents("[class^=basesvg]"),'O','crosshair').height;
							var xminutes = ((x-data.getOffsetX())/data.scaleX-data.getGraphLeft())*100/data.basewidth*data.xrange/data.graphWidth;
							var tstart = ftui.dateFromString(data.mindate);
							var tx = new Date(tstart);
							var textX2Value, tarr;
							tx.setMinutes(tstart.getMinutes() + xminutes);
							if (data.timeformat!==undefined && data.timeformat!=='') {
								tarr = widget_chart.getDateTimeNumberString(tx,data.timeformat);
								textX2Value = tarr[0];
								for (i=1, il=tarr.length; i<il; i++) {
									textX2Value+= ' ' + tarr[i];
								}
							} else {
								textX2Value = (tx.hhmm()=="00:00"||data.xticks>1440) ? tx.ddmm() : tx.ddmm() + tx.hhmm() ; // if we are at exactly 00:00 of if difference between ticks is larger than a day don't display hours.
							}
							crh_text[itime].find('tspan.crosshairValue').html(textX2Value);
							var rw = widget_chart.getTextSizePixels(target,textX2Value,'text crosshair').width;
							var rh = widget_chart.getTextSizePixels(target,textX2Value,'text crosshair').height;
							if (!crh_text[itime].parent().find('rect').length) {
								crh_text[itime].parent().prepend(widget_chart.createElem('rect').attr({'class':'crosshair','x':x-rw/2,'y':legendY-rh/2,'width':rw+'px','height':rh+'px','style':'z-index:10000; fill:black;'}));
								crh_text[itime].parent().find('rect.crosshair').parent().css('clip-path','none');
								crh_text[itime].attr({'text-anchor':'middle'});
							}
							crh_text[itime].parent().find('rect').attr({'x':x-rw/2, 'y':legendY-rh/2});
							crh_text[itime].attr({'x':x,'y':legendY+3, 'filter':''}).show();
						}
						data.lastV = values;
						//console.log(values);
						if (event.type == 'mouseenter') {
							for (i=0, il=crh_text.length; i<il; i++) {crh_text[i].text = "";}
							crosshair.show();
							//event.stopPropagation();
						}
					}
				}
				break;
				
			case 'mouseleave':
				//$(event.delegateTarget).find("text.debug").remove();
				if($(event.delegateTarget).parents("[class^=basesvg]").parent().data('crosshair'))	{
					//console.log("Mouseleave Event",$(event.delegateTarget).parents("[class^=basesvg]").parent().data'crs_inactive'));
					//if (crosshair) {crosshair.hide();}
					widget_chart.doHide(crosshair,'.crosshair',data);
				}
				break;
		}
	},
	doHide: function(elem,cls,data) { // helper function to overcome display: none problem in chrome/webkit
		var browserCaps = widget_chart.getBrowserCaps();
		if (browserCaps.prefix && (browserCaps.prefix.search('webkit') >= 0)) {
			if (elem) {elem.find(cls).attr({'x':'100000','x1':'100000','x2':'100000'});} // hack for chrome/webkit problem with display:none
		} else {
			if (elem) {elem.hide();}
		}
	},
	correctLeapYear: function(ds,de,mode){ // helper function to correct leap year day numbers
		var width = Math.abs(ds-de);
		var now = new Date();
		var tstart = new Date(now.getFullYear(),now.getMonth(),now.getDate(),0,0,0,0);
		var tend = new Date(now.getFullYear(),now.getMonth(),now.getDate(),0,0,0,0);

		tstart.setTime(tstart.getTime() - (Math.max(ds,de)*24*60*60*1000));
		var sY = tstart.getFullYear();
		if (tstart.getMonth() > 1) sY++;
		tend.setTime(tend.getTime() - (Math.min(ds,de)*24*60*60*1000));
		var eY = tend.getFullYear();
		if (tend.getMonth() <= 1) eY--;
		var lF = 0;
		for (var i=sY, il=eY; i<=il; i++)
			lF += (((i%4===0)&&(i%100!==0))||(i%400===0))?1:0;

		width += (mode=='down')?(-lF):(lF);
		return width;
	},
	calcDiffMonth: function(ds,de,offset) {
		var width = Math.abs(ds-de);
		var now = new Date();
		var tstart = new Date(now.getFullYear(),now.getMonth(),now.getDate(),now.getHours(),now.getMinutes(),0,0); // get current time rounded to minutes
		var tend = new Date(now.getFullYear(),now.getMonth(),now.getDate(),now.getHours(),now.getMinutes(),0,0); // get current time rounded to minutes
		tstart.setTime(tstart.getTime() - (Math.max(ds,de)*24*60*60*1000)); // set tstart to maximum of ds/de less than current time
		tend.setTime(tend.getTime() - (Math.min(ds,de)*24*60*60*1000)); // set tstart to minimum of ds/de less than current time

		var ret = [];
		if (width >= tstart.myGetDaysInMonth()) { // difference is bigger than current month care for correct treatment
			var mdiff = tend.getMonth()-tstart.getMonth()+(tend.getFullYear()-tstart.getFullYear())*12; // get number of months between dates
			var md = parseInt(mdiff*offset);
			var dds = (mdiff*offset-md)*tstart.myGetDaysInMonth();
			var dde = (mdiff*offset-md)*tend.myGetDaysInMonth();
			var dateS = (tstart.getDate()==tstart.myGetDaysInMonth())?new Date(tstart.getFullYear(),tstart.getMonth()-md,1,0,0,0,0).myGetDaysInMonth():tstart.getDate();
			var dateE = (tend.getDate()==tend.myGetDaysInMonth())?new Date(tend.getFullYear(),tend.getMonth()-md,1,0,0,0,0).myGetDaysInMonth():tend.getDate();
			ret[0] = ds + widget_chart.dateDiff(new Date(tstart.getFullYear(),tstart.getMonth()-md,dateS-dds,tstart.getHours(),tstart.getMinutes(),0,0),tstart,'d');
			ret[1] = de + widget_chart.dateDiff(new Date(tend.getFullYear(),tend.getMonth()-md,dateE-dde,tend.getHours(),tend.getMinutes(),0,0),tend,'d');
		} else {
			ret[0] = ds + offset*width;
			ret[1] = de + offset*width;
		}

		return ret;
	},
	doCorrectShift: function(data,offset) { // helper function for correction of shift due to given classifier ('y','m')
		var classifier = data.xclassifier;
		var width;
		if (classifier == 'y' && (data.days_start-data.days_end)<365*2) classifier = 'm'; // if we will have less than one year difference use rounding to months instead of rounding to years
		switch (classifier) {
			case 'y': // correction needed for leap years
				width = widget_chart.correctLeapYear(data.days_start,data.days_end,'down');	// remove leap year days for old period
				var widths = widget_chart.correctLeapYear(data.days_start+offset*(width),data.days_start,'up'); // add leap year days for new period
				var widthe = widget_chart.correctLeapYear(data.days_end+offset*(width),data.days_end,'up'); // add leap year days for new period

				data.days_start = data.days_start+offset*(widths);
				data.days_end = data.days_end+offset*(widthe);
				break;
			case 'm': // correction needed due to different number of days per month
				var dRet = widget_chart.calcDiffMonth(data.days_start,data.days_end,offset);
				data.days_start = dRet[0];
				data.days_end = dRet[1];
				break;
			default:
				width = (data.days_start-data.days_end);
				data.days_start = data.days_start+offset*(width);
				data.days_end = data.days_end+offset*(width);
				break;
		}
	},
	shift: function(evt,elem,offset,noanimation,norefresh,callback){ // calculate new start and end dates when user wants to shift graph
		var dataE = elem.data();
		if (!dataE.done || !dataE.baseDone || dataE.drawing) return; // check if we already have done one successful drawing.
		dataE.shift += offset;
		//widget_chart.doCorrectShift(dataE, offset);
		if (!norefresh) {
			widget_chart.refresh(elem,noanimation?'start reset':'shift',-offset,callback);
		} else {
			if (callback) callback();
		}
		
		// check if other charts are in the same scrollgroup and shift them as well
		var theDoc = (dataE.popup)?elem:$(document);
		theDoc.find("[class^=basesvg]").each(function() {
			var data = $(this).parent().data();
			if ((data.scrollgroup == dataE.scrollgroup) && dataE.scrollgroup!==undefined && dataE.instance!=data.instance) {
				data.shift += offset;
				//widget_chart.doCorrectShift(data, offset);
				if (!norefresh) {
					widget_chart.refresh($(this).parent(),noanimation?'start reset':'shift',-offset,callback);
				} else {
					if (callback) callback();
				}
			}
		});
	},
	rotate: function(evt,elem,rotx,roty){ // calculate new rotation values when 3D modus is activated
		var dataE = elem.data();
		if (!dataE.done || !dataE.baseDone || dataE.drawing) return; // check if we already have done one successful drawing.

		if (dataE.ddd === undefined) {
			return;
		}

		dataE.ddd[0] = (evt.ctrlKey)?parseFloat(dataE.ddd[0]) - rotx*dataE.DDD.dir.x:parseFloat(dataE.ddd[0]) + rotx*dataE.DDD.dir.x;
		dataE.ddd[1] = (evt.ctrlKey)?parseFloat(dataE.ddd[1]) - roty*dataE.DDD.dir.y:parseFloat(dataE.ddd[1]) + roty*dataE.DDD.dir.y;
		
		if (dataE.ddd[0]>=85 || dataE.ddd[0]<=0) dataE.DDD.dir.x*=-1; // change rotation direction if at maximum or minimum
		if (dataE.ddd[1]>=85 || dataE.ddd[1]<=0) dataE.DDD.dir.y*=-1; // change rotation direction if at maximum or minimum
		dataE.ddd[0] = Math.min(85,Math.max(0,dataE.ddd[0]));
		dataE.ddd[1] = Math.min(85,Math.max(0,dataE.ddd[1]));

		widget_chart.refresh(elem,'rotate');
	},
	getStackingLevel: function(ptype, ptype_array, stackingLevel) {
		if (ptype.search(':')<0 || ptype.search('icons:')>=0) {
			return stackingLevel; // no stacking dependency any more, return
		} else {
			stackingLevel++;
			var pt = ptype_array[parseInt(ptype.split(':')[1])];
			return widget_chart.getStackingLevel(pt,ptype_array,stackingLevel);
		}
	},
	doCorrectScale: function(data,scale) { // helper function for correction of scale due to given classifier ('y','m')
		var classifier = data.xclassifier;
		var width;
		if (classifier == 'y' && (data.days_start-data.days_end)<365*2) classifier = 'm'; // if we will have less than two years difference use rounding to months instead of rounding to years
		switch (classifier) {
			case 'y': // correction needed for leap years
				width = widget_chart.correctLeapYear(data.days_start,data.days_end,'down');	// remove leap year days for old period
				var widths = widget_chart.correctLeapYear(data.days_end+(width)*scale,data.days_end,'up'); // add leap year days for new period

				data.days_start = data.days_end+(widths);
				break;
			case 'm': // correction needed due to different number of days per month
				width = data.days_start-data.days_end;
				if (width>31 || scale > 1) { // new difference is surely more than a month => use corrected value
					var dRet = widget_chart.calcDiffMonth(data.days_start,data.days_end,scale-1);
					data.days_start = dRet[0];
				} else { // do calculation without month correction
					width = data.days_start-data.days_end;
					data.days_start = data.days_end+scale*(width);
				}
				break;
			default:
				width = data.days_start-data.days_end;
				data.days_start = data.days_end+scale*(width);
				break;
		}
	},
	selectTime: function(evt,elem) { // generate and show pulldown to select predefined time range
		widget_chart.doLog("widget_chart.selectTime","Generate Pulldown");
		var dataE = elem.data();
		if (!$.isArray(dataE.timeranges)) return; // there is no definition of timeranges, do nothing

		var selBtn = $(evt.delegateTarget);
		//widget_chart.doLog("widget_chart.selectTime","test: "+window.pageXOffset+", "+window.pageYOffset);
		//elem.find("[id='selectTimePulldown_"+dataE.instance+"']").remove(); // remove old pulldown if it is still there.
		var pulldownMenu = elem.find("[id='selectTimePulldown_"+dataE.instance+"']");
		if (!pulldownMenu.length || pulldownMenu.length == 0) {
			pulldownMenu = $(document.createElement('div')).attr({
				'style': 'width: auto; display:none; position: absolute; z-index: 10000; left:'+
					(elem.find('.buttons.timeranges').offset().left-elem.offset().left)+'px; top:'+
					(elem.find('.buttons.timeranges').offset().top-elem.offset().top+elem.find('.buttons.timeranges')[0].getBoundingClientRect().height)+'px;',
				'class': 'pulldownmenu',
				'id': 'selectTimePulldown_'+dataE.instance
			});
			$.each( dataE.timeranges, function( ind, value ) {
				var pdEntry = $(document.createElement('div')).attr({'class':"pdentry",'style':'z-index: 10000;'});
				pdEntry.text(value[0]);
				pulldownMenu.append(pdEntry);
				pdEntry.data('timerrange',value);
				pdEntry.on('mouseover',function (e) {$(e.delegateTarget).addClass('mouseover');});
				pdEntry.on('mouseout',function (e) {$(e.delegateTarget).removeClass('mouseover');});
				pdEntry.on('click',function (e) {
					pulldownMenu.hide();
					if ($(e.delegateTarget).data('timerrange').length && $(e.delegateTarget).data('timerrange').length > 2) {
						elem.data('daysago_start',$(e.delegateTarget).data('timerrange')[1]);
						elem.data('daysago_end',$(e.delegateTarget).data('timerrange')[2]);
						elem.data('scale', 1); // set scale value to initial value
						elem.data('shift', 0); // set shift value to initial value
						elem.data('iZoom',-1); // reset zoom array used when clicking at x-axis labels
						widget_chart.refresh(elem,'start reset',0);

						// check if other charts are in the same scrollgroup and shift them as well
						var theDoc = (dataE.popup)?elem:$(document);
						theDoc.find("[class^=basesvg]").each(function() {
							var elm = $(this).parent();
							var data = elm.data();
							if ((data.scrollgroup == dataE.scrollgroup) && dataE.scrollgroup!==undefined && dataE.instance!=data.instance) {
								elm.data('daysago_start',$(e.delegateTarget).data('timerrange')[1]);
								elm.data('daysago_end',$(e.delegateTarget).data('timerrange')[2]);
								elm.data('scale', 1); // set scale value to initial value
								elm.data('shift', 0); // set shift value to initial value
								elm.data('iZoom',-1); // reset zoom array used when clicking at x-axis labels
								widget_chart.refresh($(this).parent(),'start reset',0);
							}
						});
					}
				});
				if (ind < dataE.timeranges.length-1)
					pulldownMenu.append($(document.createElement('div')).attr({'class':"pdentry line",'style':'height:2px !important;'}));
			});

			elem.append(pulldownMenu);
		}
		pulldownMenu.slideDown(400,function() {$(document).on('click.pdClicks', function(e) {
			pulldownMenu.hide();
			$(document).off('click.pdClicks');
		})});
	},
	scaleTime: function(evt,elem,scale,noanimation,norefresh,callback){ // calculate new start and end dates when user wants to scale graph
		var dataE = elem.data();
		if (!dataE.done || !dataE.baseDone || dataE.drawing) return; // check if we already have done one successful drawing.
		dataE.scale *= scale;
		//widget_chart.doCorrectScale(dataE,scale);
		if (!norefresh) {
			widget_chart.refresh(elem,noanimation?'start reset':'scale',0,callback);
		} else {
			if (callback) callback();
		}
		// check if other charts are in the same scrollgroup and scale them as well
		var theDoc = (dataE.popup)?elem:$(document);
		theDoc.find("[class^=basesvg]").each(function() {
			var data = $(this).parent().data();
			if ((data.scrollgroup == dataE.scrollgroup) && dataE.scrollgroup!==undefined && dataE.instance!=data.instance) {
				data.scale *= scale;
				//widget_chart.doCorrectScale(data,scale);
				if (!norefresh) {
					widget_chart.refresh($(this).parent(),noanimation?'start reset':'scale',0,callback);
				} else {
					if (callback) callback();
				}
			}
		});
	},
	swipe: function(base,instance,direction,leftright,data_new,data_old){ // perform animation when scaling/shifting graph
		//var graphs = base.find("[id*='graph-']");
		//var graphs_old = base.find("[id*='graphold-']");
		var graphs = base.find('g.graph-parent');
		var graphs_old;
		var i, l;
		if (graphs.length === 0) return;
		if (direction=="horizontal-shift") {
			for (i=0,l=graphs.length; i<l; i++) {
				graphs_old = $(graphs[i]).find("[id*='graphold-']");
				if (graphs_old.length > 0) {
					if ($(graphs_old).attr('animstate')=='hide') {
						animateVisibilityShift($(graphs[i]), 1, 0, leftright, 1, data_new, data_new, 0, 1, true);
					} else {
						graphs_old.remove();
					}
				}
			}
		} else if (direction=="scale") {
			var offsetx = data_new.getGraphLeft();
			if (data_new.xrange > data_old.xrange) {
				for (i=0,l=graphs.length; i<l; i++) {
					graphs_old = $(graphs[i]).find("[id*='graphold-']");
					graphs_old.remove();
					if ($(graphs[i]).find("[id*='graph-']").attr('animstate')=='hide') animateVisibilityScale($(graphs[i]), data_new.xrange/data_old.xrange, 1, data_new.xrange/data_old.xrange/20, 0, data_new, data_old, 0, 1, offsetx, true);
				}
			} else {
				for (i=0,l=graphs.length; i<l; i++) {
					var graphs_new = $(graphs[i]).find("[id*='graph-']");
					graphs_new.attr("transform","scale(0,0)"); // use scale instead of hide for hiding because hide had strange side effects
					graphs_old = $(graphs[i]).find("[id*='graphold-']");
					if ($(graphs_old).attr('animstate')=='hide') {
						animateVisibilityScale($(graphs[i]), 1, data_old.xrange/data_new.xrange, data_old.xrange/data_new.xrange/20, 1, data_new, data_old, 0, 1, offsetx, false);
					} else {
						graphs_old.remove();
					}
				}
			}
		}

		function animateVisibilityScale(sel, currval, maxval, step, inout, data_new, data_old, transy, scaley, offsetx, down) { // recursively called function for animated scaling of graphs
			var scalex = currval;
			var transx = (currval<maxval)?(data_new.graphArea.width+offsetx)*(1-currval):(data_new.graphArea.width+offsetx)*(1-currval);
			var style = (sel.attr('style')!==undefined)?sel.attr('style'):'';
			sel.attr("style", style.replace(/transform[^;]*/,"transform: translate("+transx+"px, "+transy+"px) "+" scale("+scalex+","+scaley+")"));

			if(down && currval > maxval || !down && currval < maxval) {
				currval += (currval<maxval ? step : -step);
				currval = Math.round(currval*100)/100;
				setTimeout(function(){ animateVisibilityScale(sel,currval,maxval,step,inout, data_new, data_old, transy, scaley, offsetx, down);}, 10);
			} else {
				if (inout==1) {
					sel.find("[id*='graphold-']").remove();	// remove old graph as animation is finished
					sel.attr("style", style.replace(/transform[^;]*/,"transform: translate("+0+"px, "+0+"px) "+" scale("+1+","+1+")"));
					sel.find("[id*='graph-']").attr("transform","scale(1,1)");	// show new graph after animation has finished
				}
			}
		}
		
		function animateVisibilityShift(sel, currval, maxval, leftright, inout, data_new, data_old, transy, scaley, down) {// recursively called function for animated shifting of graphs
			var transx = 0;
			if (inout==1)
				transx = parseFloat(data_new.graphArea.width)*leftright*(currval);
			else
				transx = parseFloat(data_new.graphArea.width)*leftright*(currval-1);
			
			var style = (sel.attr('style')!==undefined)?sel.attr('style'):'';
			sel.attr("style", style.replace(/transform[^;]*/,"transform: translate("+transx+"px, "+transy+"px) "+" scale(1,"+scaley+")"));

			if(down && currval > maxval || !down && currval < maxval) {
				currval += (currval<maxval ? 0.04 : -0.04);
				currval = Math.round(currval*100)/100;
				setTimeout(function(){ animateVisibilityShift(sel,currval,maxval,leftright,inout, data_new, data_old, transy, scaley, down);}, 10);
			} else {
				sel.find("[id*='graphold-']").remove();	// remove old graph as animation is finished
			}
		}
	},
	toggle: function(evt,instance){ // swith on/off graph including fade out/in animation
		var index = $(evt.delegateTarget).attr('igraph');
		var base = $(evt.delegateTarget).parents("[class^=basesvg]");
		var graph = base.find("[id*='graph-"+instance+"-"+index+"']");

		animateVisibility(graph, (graph.attr('animstate')=='show')?0:1, (graph.attr('animstate')=='show')?1:0);
		if (graph.attr('animstate')=='show') $(evt.delegateTarget).attr('opacity',1); else $(evt.delegateTarget).attr('opacity',0.5);
		base.parent().data('graphsshown')[index]=!base.parent().data('graphsshown')[index];
		
		function animateVisibility(sel, currval, maxval) { // recursively called function for fade out/in animation using translate attribute
			var h = base.parent().data('logProxy')?sel.attr("y0polar"):parseFloat(sel.attr("min"));
			var w = base.parent().data('logProxy')?sel.attr("x0polar"):0;
			var scly = base.parent().data('logProxy')?currval:1;
			sel.attr("transform", "translate("+w*(1-currval)+","+h*(1-currval)+") "+
									"scale("+scly+","+currval+")");

			if(currval != maxval) {
			  currval += (currval<maxval ? 0.02 : -0.02);
			  currval = Math.round(currval*100)/100;
			  setTimeout(function(){ animateVisibility(sel,currval,maxval);}, 10);
			} else {
				if (base.parent().data('legend_stacking')) widget_chart.refresh(base.parent(),'rotate');
			}
		}

		if (graph.attr('animstate')=='show') graph.attr('animstate','hide'); else graph.attr('animstate','show');
	},

	configureLegend: function(data,theObj,fszC,classesContainer,legend_container) {
		var existingLegends = legend_container.find('text.legend');
		var maxwidth = 0;
		var sumwidth = 0;
		var lwidths = [];
		var isIE = navigator.userAgent.match(/Trident/);
		for (var i=0, l=existingLegends.length; i<l; i++) {
			if (isIE) {
				var serializer = new XMLSerializer();
				var str = serializer.serializeToString(existingLegends[i]);
				var wdth = widget_chart.getTextObjectSize(theObj.find("[class^=basesvg]"),str).width;
			} else {
			var wdth = widget_chart.getTextObjectSize(theObj.find("[class^=basesvg]"),$(existingLegends[i])[0].outerHTML).width;
			}
			if (wdth > maxwidth) {maxwidth = wdth;}
			lwidths[i] = wdth+2.5;
			sumwidth += lwidths[i];
		}

		var height = data.legend_horiz?(fszC+15):((fszC+5)*(existingLegends.length)+5)+5;
		var lwidth = data.legend_horiz?sumwidth+5:(maxwidth+5);
		var pleft, ptop;
		
		if ($.isArray(data.legendpos) && !data.legend_pos || (data.legendpos && data.legendpos[0].search(/(before|behind)/)>-1) || (data.legendpos && data.legendpos[1].search(/(below|above)/)>-1)) { // set initial position of legend area
			switch(data.legendpos[0]) {
				case 'left':
					pleft = 0;
					break;
				case 'right':
					pleft = 1;
					break;
				case 'before':
					data.leftOffset = lwidth;
					data.graphWidth -= lwidth/data.basewidth*100;
					data.setGraphParameters();
					legend_container.attr('style',data.DDD.String.Rot+'; '+data.DDD.String.Trans(data.DDD.Width(data.nGraphs-1),data.nGraphs,data.DDD,data.xStrTO,data.yStrTO));
					pleft = -1;
					break;
				case 'behind':
					data.graphWidth -= lwidth/data.basewidth*100;
					data.graphArea.width = data.graphWidth/100*data.basewidth;
					data.setGraphParameters();
					legend_container.attr('style',data.DDD.String.Rot+'; '+data.DDD.String.Trans(data.DDD.Width(data.nGraphs-1),data.nGraphs,data.DDD,data.xStrTO,data.yStrTO));
					pleft = 2;
					break;
				default:
					pleft = parseInt(data.legendpos[0])/100;
					if (isNaN(pleft)) pleft = 1 // set to default if something is wrong;
					break;
			}
			
			switch(data.legendpos[1]) {
				case 'top':
					ptop = 0;
					break;
				case 'bottom':
					ptop = 1;
					break;
				case 'above':
					data.topOffset += height+2;
					data.graphHeight -= (height+2)/data.baseheight*100;
					data.setGraphParameters();
					legend_container.attr('style',data.DDD.String.Rot+'; '+data.DDD.String.Trans(data.DDD.Width(data.nGraphs-1),data.nGraphs,data.DDD,data.xStrTO,data.yStrTO));
					ptop = -1
					break;
				case 'below':
					data.bottomOffset += height+2;
					data.graphHeight -= (height+2)/data.baseheight*100;
					data.setGraphParameters();
					legend_container.attr('style',data.DDD.String.Rot+'; '+data.DDD.String.Trans(data.DDD.Width(data.nGraphs-1),data.nGraphs,data.DDD,data.xStrTO,data.yStrTO));
					ptop = 2;
					break;
				default:
					ptop = parseInt(data.legendpos[1])/100;
					if (isNaN(ptop)) ptop = 0 // set to default if something is wrong;
					break;
			}
		
			if (!data.legend_pos || !data.legend_pos.moved) {
				data.legend_pos = {
					height:height,
					width:lwidth,
					left:pleft>1?(data.chartArea.width-lwidth):pleft<0?0:Math.max(data.graphArea.left-data.chartArea.left,data.graphArea.left-data.chartArea.left+pleft*(data.graphArea.width-lwidth)),
					top:ptop>1?data.chartArea.height-height:ptop<0?data.topOffset-height:Math.max(data.topOffset,data.topOffset+ptop*(data.graphArea.height-height)),
					moved:false
				};
			}
		}

		var x = (data.legend_pos)?data.legend_pos.left:(data.graphArea.left-data.chartArea.left+data.graphArea.width-lwidth);
		var y = (data.legend_pos)?data.legend_pos.top:data.topOffset;
		for (i=0, l=existingLegends.length; i<l; i++) {
			$(existingLegends[i]).attr({
				'x':data.legend_horiz?x+sumwidth+'px':((x+maxwidth))+'px',
				'y':data.legend_horiz?((y+(fszC+5))+2.5)+'px':((y+(fszC+5)*(existingLegends.length-i))+2.5)+'px',
				'igraph':$(existingLegends[i]).attr('igraph'),
				'opacity':(!data.graphsshown[existingLegends.length-i-1])?0.5:1
			});

			$(existingLegends[i]).off('click');
			$(existingLegends[i]).click(function(event) { // jshint ignore:line
				widget_chart.toggle(event, data.instance, "vertical-hide");
			});
			
			sumwidth -= lwidths[i];
		}

		var legend_back = legend_container.find('rect.lback');
		legend_back.attr({
			'class':'legend lback',
			'x':x+'px',
			'y':y+'px',
			'height':data.legend_horiz?(fszC+15)+'px':((fszC+5)*(existingLegends.length)+5)+5+'px',
			'width':data.legend_horiz?lwidth+'px':(maxwidth+5)+'px',
		});
		data.legend_pos={left:x, top:y, width:(maxwidth+5), moved:data.legend_pos?data.legend_pos.moved:false};
	},
	
	drawLegend: function(data,theObj,style_array,fszC,classesContainer) {
		// generate container, content and dynamics (events) for legend container
		var legend_container = widget_chart.createElem('g').attr({
			'class':'lentries',
			'style':data.DDD.String.Rot+'; '+data.DDD.String.Trans(data.DDD.Width(data.nGraphs-1),data.nGraphs,data.DDD,data.xStrTO,data.yStrTO),
			'x':'0%',
			'y':'0px'
		});
		var xS = 0;
		var yS = 0;
		legend_container.prepend(widget_chart.createElem('rect').attr({'class':'lback'}));
		legend_container.find('rect.lback') // add drag functionality for legend container
			.draggable()
			.on('mouseover', function(event) {
				event.target.setAttribute('style','cursor:move');
			})
			.on('mousedown touchstart', function(event, ui){
				var evt;
				// keep initial mouse position relative to draggable object.
				if (event.type == 'touchstart') {
					if (!event.originalEvent) return;
					evt=event.originalEvent.touches[0];
				} else {
					evt = event;
				} 
				var target = $(event.delegateTarget).parents("[class^=basesvg]");
				xS = parseFloat($(evt.target).attr('x')) - (evt.pageX - target.offset().left);
				yS = parseFloat($(evt.target).attr('y')) - (evt.pageY - target.offset().top);
			})
			.on('drag touchmove', function(event, ui) {
				var evt;
				if (event.type == 'touchmove') {
					if (!event.originalEvent) return;
					evt=event.originalEvent.touches[0];
				} else {
					evt = event;
				} 
				var target = $(event.delegateTarget).parents("[class^=basesvg]");
				var data = target.parent().data();
				var xOff = parseFloat($(evt.target).attr('x')) - (evt.pageX - target.offset().left) - xS;
				var yOff = parseFloat($(evt.target).attr('y')) - (evt.pageY - target.offset().top) - yS;
				evt.target.setAttribute('x', parseFloat($(evt.target).attr('x')) - xOff);
				evt.target.setAttribute('y', parseFloat($(evt.target).attr('y')) - yOff);
				target.find('text.legend').each(function(index) {
					$(this).attr('x', parseFloat($(this).attr('x'))-xOff);
					$(this).attr('y', parseFloat($(this).attr('y'))-yOff);
				});
				data.legend_pos = {
					left:parseFloat($(evt.target).attr('x')),
					top:parseFloat($(evt.target).attr('y')),
					width:parseFloat($(evt.target).attr('width')),
					moved:true
				};
			});

		for (var k=0; k<data.nGraphs; k++) {	// generate all legend entries
			var legend = widget_chart.getArrayValue(data.legend,k,'Graph '+k);
			var style = widget_chart.getDynamicStyle(widget_chart.getArrayValue(style_array,k,''));
			var styleV;
			//show chart legend if set
			if (legend){
				styleV = widget_chart.getStyleRuleValue(classesContainer, 'stroke', '.'+style);
				if (!styleV) {styleV = widget_chart.getStyleRuleValue(classesContainer, 'fill', '.'+style);}
				var color = styleV;
				var textLegend = widget_chart.createElem('text');
				textLegend.attr({
								'class':'legend '+style,
								'x':'50%',
								'y':'2',
								'text-anchor':"end",
								'igraph':k,
								'style':'stroke-width:0px;fill-opacity:1;'+((color!==undefined)?'':'fill:'+color)
								});
				textLegend.HTML2SVG(legend);
				legend_container.append(textLegend);
			}
		}

		if (data.showlegend){ // we need to reconfigure the legend, as only now we have all information available
			//need to correct x-position of legend texts after having displayed them
			widget_chart.configureLegend(data,theObj,fszC,classesContainer,legend_container);
		}
		
		return legend_container;
	},
	
	initializeTime: function(data) {
		data.days_start = widget_chart.getDaysAgo(data.daysago_start,data);
		if (isNaN(data.days_start)) data.days_start = 0;
		data.days_end = widget_chart.getDaysAgo(data.daysago_end,data);
		if (isNaN(data.days_end)) data.days_end = data.days_start-1;
		if (data.days_start == data.days_end) {if (data.daysago_start=='now') data.days_start++; else data.days_end--;}
		widget_chart.doCorrectShift(data,data.shift*data.scale);
		widget_chart.doCorrectScale(data,data.scale);
		var days_start = parseFloat(data.days_start);
		var days_end = parseFloat(data.days_end);
		if (days_end == days_start) days_end--;

		var now = new Date();
		var tstart = new Date(now.getFullYear(),now.getMonth(),now.getDate(),0,0,0,0);
		var tend = new Date(now.getFullYear(),now.getMonth(),now.getDate(),0,0,0,0);
		var mindate=now;
		var maxdate=now;

		tstart.setTime(tstart.getTime() - (days_start*24*60*60*1000));
		tstart.setTime(tstart.getTime() - (tstart.dst()-mindate.dst())*60*1000); // correct daytime savings
		tend.setTime(tend.getTime() - (days_end*24*60*60*1000));
		tend.setTime(tend.getTime() - (tend.dst()-mindate.dst())*60*1000); // correct daytime savings
		mindate = tstart.yyyymmdd() + '_' + (tstart.getHours()).pad() + ':' + tstart.getMinutes().pad() + ':' + tstart.getSeconds().pad();
		maxdate = tend.yyyymmdd() + '_' + (tend.getHours()).pad() + ':' + tend.getMinutes().pad() + ':' + tend.getSeconds().pad();
		data.xrange  = parseInt(ftui.diffMinutes(ftui.dateFromString(mindate),ftui.dateFromString(maxdate)));
		data.mindate = mindate;
		data.maxdate = maxdate;
		data.tstart = tstart;
		data.tend = tend;
	},

	show_busy: function(elem,show) {
		if (!elem.hasClass('showbusy')) return;
		var data = elem.data();

		if (elem.find('svg.basesvg'+data.instance).find('[id=baseforDDD]').length < 1) return;

		if (show) {
			if (elem.find('[id=chart_loading_indicator'+data.instance+']').length < 1) {
				var busy_indicator = $('<div id="chart_loading_indicator'+data.instance+'"><i id="fg" class="fa fa-spin fa-stack-1x fa-cog" style="font-size: 50px; top: 50%; color: #DADADA;"></i></div>');
				elem.append(busy_indicator);
			} else {
				var busy_indicator = elem.find('[id=chart_loading_indicator'+data.instance+']');
			}

			var bi_style = "position: fixed; background-color: white; z-index: 1000000; opacity: 0.5;"
			bi_style += (" top: " + (data.chartArea?data.chartArea.top:0) + "px;");
			bi_style += (" left: " + (data.chartArea?data.chartArea.left:0) + "px;");
			bi_style += (" width: " + (data.chartArea?data.chartArea.width:elem.parent().width()) + "px;");
			bi_style += (" height: " + (data.chartArea?data.chartArea.height:elem.parent().height()) + "px;");
			busy_indicator.attr({"style":bi_style});

			busy_indicator.show();
		} else {
			elem.find('[id=chart_loading_indicator'+data.instance+']').remove();
		}
	},
	refresh: function (elem,type,swoffset,callback) {
		var theObj, getData, data_old;
		if (elem) theObj=elem; else theObj=this;
		var data = $(theObj).data();
		var promiseAct, promisePrev, promiseNext;
		if (type=="rotate" || type=="resize") getData=false; else getData=true; // just different way of display, no data to be retrieved from server
		if (type=="resize") {
			if ($(theObj).parent().width() == data.containerWidth && $(theObj).parent().height() == data.containerHeight) { // no change nothing to be done
				return;
			}
			data.containerWidth = $(theObj).parent().width();
			data.containerHeight = $(theObj).parent().height();
			data.legend_pos = undefined; // position of legend has to be reset to default value due to new window size
		}

		if (type != "resize") widget_chart.show_busy(elem,true);
		
		if (type == 'shift') {
			if (swoffset == 1) {
				if (data.next_cache_completed) {
					data.kIndx_next = 0;
					data_old = jQuery.extend({},$(theObj).data());
					widget_chart.initializeTime(data);
					data.pointsarray_prev = data.pointsarray.clone(); // new previous data array becomes current actual data array
					data.pointsarray = data.pointsarray_next.clone(); // new actual data array becomes previous next data array
					data.next_cache_completed = false;
					$(theObj).data(data);
					promiseNext = widget_chart.retrieveData(elem,type,swoffset,data_old,'next',callback,true); // retrieve new next data array to cache
					getData = false;
				}
			} else if (swoffset == -1) {
				if (data.previous_cache_completed) {
					data.kIndx_prev = 0;
					data_old = jQuery.extend({},$(theObj).data());
					widget_chart.initializeTime(data);
					data.pointsarray_next = data.pointsarray.clone(); // new next data array becomes previous actual data array
					data.pointsarray = data.pointsarray_prev.clone(); // new actual data array becomes current previous data array
					data.previous_cache_completed = false;
					$(theObj).data(data);
					promisePrev = widget_chart.retrieveData(elem,type,swoffset,data_old,'previous',callback,true); // retrieve new previous data array to chache
					getData = false;
				}
			}
		} else if (type == 'scale') { // tbd possibly optimize data retrieval also for scale
		}

		if (getData) {
			var now = new Date();
			data.kIndx = 0;
			if (!data.pointsarray) data.pointsarray = [];
			if (!data.pointsstr) data.pointsstr = [];

			data.kIndx_prev = 0;
			if (!data.pointsarray_prev) data.pointsarray_prev = [];
			if (!data.pointsstr_prev) data.pointsstr_prev = [];

			data.kIndx_next = 0;
			if (!data.pointsarray_next) data.pointsarray_next = [];
			if (!data.pointsstr_next) data.pointsstr_next = [];

			data.nofilldown = [];
			data.columnspecsDone = {previous: [], actual: [], next: []};
			data.last_ics = {previous: [], actual: [], next: []};
			data_old = jQuery.extend({},$(theObj).data()); // need to keep this for animation of shifting and scaling when pushing respective buttons.
			widget_chart.initializeTime(data);

			if (data.tend && (data.tend.getTime() > now.getTime())) {
				data.filltime_end_save = data.filltime_end;
				data.filltime_end = false;
			} else {
				data.filltime_end = data.filltime_end_save;
			}

			data.baseDone = false; // chart has to be redrawn, set flag to control right order between 'acutal', 'previous' and 'next'
			data.openDrawings = data.prefetch?3:1; // number of drawings to be done needed for checking when to activate event handling for scale and shift
			$(theObj).data(data);
			promiseAct = widget_chart.retrieveData(elem,type,swoffset,data_old,'actual',callback,true);
			if (data.prefetch) {
				promisePrev = widget_chart.retrieveData(elem,type,swoffset,data_old,'previous',callback,true);
				promiseNext = widget_chart.retrieveData(elem,type,swoffset,data_old,'next',callback,true);
			}
		} else {
			data.baseDone = false; // chart has to be redrawn, set flag to control right order between 'acutal', 'previous' and 'next'
			data.openDrawings = data.prefetch?(type=='shift'?2:3):1; // number of drawings to be done needed for checking when to activate event handling for scale and shift
			$(theObj).data(data);
			widget_chart.drawChart(elem,type,swoffset,data_old,callback);
			//if (data.prefetch && !(type=='shift' && swoffset==-1)) widget_chart.drawChart(elem,type,swoffset,data_old,callback,'previous');
			//if (data.prefetch && !(type=='shift' && swoffset==1)) widget_chart.drawChart(elem,type,swoffset,data_old,callback,'next');
		}
		if ((data.filltime_start || data.filltime_end) && data.prefetch) { // we need to correct the "artificial" data points and thus need to wait for all d
			$.when(promiseAct,promiseNext,promisePrev).done(function() {
				widget_chart.drawChart(elem,type,swoffset,data_old,callback);
				if (data.prefetch) widget_chart.drawChart(elem,type,swoffset,data_old,callback,'previous');
				if (data.prefetch) widget_chart.drawChart(elem,type,swoffset,data_old,callback,'next');
			});
		} else {
			$.when(promiseAct,promisePrev).done(function() {if (data.prefetch) widget_chart.drawChart(elem,type,swoffset,data_old,callback,'previous');});
			$.when(promiseAct,promiseNext).done(function() {if (data.prefetch) widget_chart.drawChart(elem,type,swoffset,data_old,callback,'next');});
		}
	},
	
	retrieveData: function(elem,type,swoffset,data_old,cachetype,callback,draw) {
		var theObj;
		if (elem) theObj=elem; else theObj=this;                   
		var data = $(theObj).data();
		//check the input arrays to derive the one with biggest length
		data.nGraphs = widget_chart.getnGraphs(data);
		
		var deferred = new $.Deferred();
		$(theObj).data('runningRefresh',true);
		for (var k=0; k<data.nGraphs; k++) {	// main loop for getting information from HTTP server (FEHM)
			data.nofilldown[k] = false;

			// get graph definitions from configuration file
			var device = $(theObj).attr('data-device')||'';
			var reading = $(theObj).attr('data-get')||'';
			var logdevice = widget_chart.getArrayValue(data.logdevice,k,'');
			var tdev = $(theObj).data('device');

			$(theObj).data('device',logdevice);
			var logtype = theObj.getReading('TYPE').val;
			$(theObj).data('device',tdev);

			var columnspec = widget_chart.getArrayValue(data.columnspec,k,(device + ':' + reading));
			var logfile = widget_chart.getArrayValue(data.logfile,k,(logtype=='DbLog'?'HISTORY':'CURRENT'));
			var ptype = widget_chart.getArrayValue(data.ptype,k,'lines');
			var mindate, maxdate, data_temp;

			var columnspecAry = $.isArray(columnspec)?columnspec:[columnspec];
			data.columnspecsDone[cachetype][k] = 0;
			data.last_ics[cachetype][k] = -1;

			for (var ics=0,icsl=columnspecAry.length; ics<icsl; ics++) {
				var columnspec_local = columnspecAry[ics];
				columnspec_local = columnspec_local.replace(/\\x27/g, "'"); // unescape single quote
				columnspec_local = columnspec_local.replace(/\\x22/g, '"'); // unescape double quote
				columnspec_local = widget_chart.processCSSpecial(columnspec_local,elem.data());
				if(! columnspec_local.match(/.+:.+/)) { // column spec for HTTP call seems to be not correct
					widget_chart.doLog("widget_chart.refresh",'columnspec '+columnspec_local+' is not ok in chart' + ($(theObj).attr('data-device')?' for device '+$(theObj).attr('data-device'):''));
				}
				if (cachetype=='next') {
					data_temp = jQuery.extend({},$(theObj).data());
					data_temp.shift -= 1;
					widget_chart.initializeTime(data_temp);
					mindate = data_temp.mindate;
					maxdate = data_temp.maxdate;
				} else if (cachetype=='previous') {
					data_temp = jQuery.extend({},$(theObj).data());
					data_temp.shift += 1;
					widget_chart.initializeTime(data_temp);
					mindate = data_temp.mindate;
					maxdate = data_temp.maxdate;
				} else {
					mindate = data.mindate;
					maxdate = data.maxdate;
				}
				
				var cliprange = widget_chart.getArrayValue(data.cliprange,k,'');
				var clipsettings = widget_chart.getClipSettings(cliprange);

				var cmd =[
					'get',
					logdevice,
					logfile,
					'-',
					mindate,
					maxdate,
					(ptype.search('icons:')>=0 && columnspec_local.search('logProxy')<=-1)?'':columnspec_local // as text out of logfiles are only reported when there is an empty columnspec, we need to set it for ptype "icons"
				];
				$.ajax({ // ajax call to get data from server
					url: $("meta[name='fhemweb_url']").attr("content") || "../fhem/",
					fwcsrf: ftui.config.csrf?ftui.config.csrf:'',
					async: true,
					cache: false,
					icsl: icsl,
					slot: k, // keep information about slot (number of graph) to be filled when data is returned from server
					ptype: ptype, // keep information about plot type belonging to slot
					columnspec_local: columnspec_local, // keep information of specification for parsing information
					ics: ics, // keep information of specification for parsing information
					cachetype: cachetype, // keep information on cachetype (previous, next, actual)
					clipsettings: clipsettings, // keep information about clipsettings belonging to slot
					callback: callback, // keep information about callback
					draw: draw, // keep information about drawing
					theObj: theObj, // keep element information
					data_temp: data_temp, // keep data information
					data_old: data_old, // keep data information
					data: {
						cmd: cmd.join(' '),
						XHR: "1",
						fwcsrf: ftui.config.csrf
					}
				}).done(function(dat) { // jshint ignore:line
					var points=[];
					var points_str=[];
					var slot = this.slot; // as we are in asynchronous mode, we have to be sure that the right graph is filled
					var ptype = this.ptype;
					var columnspec_local = this.columnspec_local;
					var ics = this.ics;
					var icsl = this.icsl;
					var cachetype = this.cachetype;
					var draw = this.draw;
					var data_temp = this.data_temp;
					var data_old = this.data_old;
					var theObj = this.theObj;
					var lines = dat.split('\n');
					var point=[];
					var i=0;
					var tstart = ftui.dateFromString(cachetype=='actual'?$(theObj).data().mindate:data_temp.mindate);
					var tend = ftui.dateFromString(cachetype=='actual'?$(theObj).data().maxdate:data_temp.maxdate);
					var found_logproxy = false;
					var idx_icons = ($(theObj).data().filltime_start|| $(theObj).data().filltime_start)?1:0;
					var index = ($(theObj).data().filltime_start|| $(theObj).data().filltime_start)?1:0;
					var minutes, val;
					var clipsettings = this.clipsettings;
					var callback = this.callback;
					var lpspecial = false;
					data_temp=null;
					
					$.each( lines, function( ind, value ) {
						if (value){
							if (value.charAt(0) == ';') {	// special treatment for logproxy returns
								found_logproxy = true;
								if (value.charAt(1) != 'c') {
									lpspecial = true;
									points_str[index]=value;	// we have to just save the strings for further processing after the input loop
									if (ptype.indexOf('_proxy') < 0) ptype += '_proxy';
									$(theObj).data().ptype = widget_chart.setArrayValue($(theObj).data().ptype,ptype,slot);
								} else { //for ";c 0" lines just indicating closed loops we ignore because of logProxy_data2Plot behaviour
									points_str[index]=value;
									points[index]=[tstart,0];
									i++;
								}
							} else if (ptype.search('icons:')>=0) { // special treatment of icons feature (display icons coming from fhem readings)
								if (columnspec_local.search('logProxy')<=-1) { // no logproxy, icons are coming from logfile
									val = ftui.getPart(value.replace('\r\n',''),4);
									minutes = ftui.diffMinutes(tstart,ftui.dateFromString(value));
									var searchstr = columnspec_local.split(':')[1] || '';
									if (value.search(searchstr) >= 0) {
										point=[parseFloat(minutes),ptype.split(':')[1],val];
										points[idx_icons]=point;
										idx_icons++;
									}
								} else { // logproxy, icons are calculated in logproxy function (e.g. proplanta2Plot)
									val = ftui.getPart(value.replace('\r\n',''),2);							
									minutes = ftui.diffMinutes(tstart,ftui.dateFromString(value));
									if (val[0] != '#') {
										point=[parseFloat(minutes),ptype.split(':')[1],val];
										points[idx_icons]=point;
										idx_icons++;
									}
								}
							} else {
								val = ftui.getPart(value.replace('\r\n',''),2);
								if ($(theObj).data().ymapping) {
									if ($.isArray($(theObj).data().ymapping)) {
										var tval = $(theObj).data().ymapping[val]?$(theObj).data().ymapping[val][1]:val;
										val = tval;
									}
								}
								minutes = ftui.diffMinutes(tstart,ftui.dateFromString(value));
								if (parseFloat(minutes) < 0) minutes = "0";
								if (val && minutes && $.isNumeric(val) && widget_chart.checkClipping(clipsettings,value)){
									point=[parseFloat(minutes),parseFloat(val)];
									if (found_logproxy) {
										if (lpspecial) $(theObj).data().nofilldown[slot] = true;
										points[index-1] = [minutes,val]; // we have modus with logproxy and further "normal" points
										found_logproxy = false;
									}
									i++;
									points[index]=point;
								} else {
									index--;
								}
							}
							index++; //count up index only if value was present
						}
					});

					if (($(theObj).data().filltime_start || $(theObj).data().filltime_end) && points.length && points.length > 0) { // add additional data points at beginning and end of chart area
						var fillstart = (data.filltime_start && (cachetype == 'actual' || cachetype == 'previous')) || (data.filltime_end && cachetype == 'next');
						var fillend = (data.filltime_end && (cachetype == 'actual' || cachetype == 'next')) || (data.filltime_start && cachetype == 'previous');
						if (points[1][0] != 0 && fillstart) {
							points[0] = points[1].clone();
							points[0][0] = 0;
						} else { // first point is already at leftmost position, shift the array
							points.shift();
						}
						if (points[points.length-1][0] != ftui.diffMinutes(tstart,tend) && fillend) {
							points[points.length] = points[points.length-1].clone();
							points[points.length-1][0] = ftui.diffMinutes(tstart,tend);
						}
					}
					
					if (ics > 0) $(theObj).data().nofilldown[slot] = true; // there is a columnspec given as array, do not fill down to x-axes but fill area between the 2 curves

					$(theObj).data().columnspecsDone[cachetype][slot]++;

					if (cachetype == 'previous') {
						$(theObj).data().last_ics[cachetype][slot] = widget_chart.joinGraphs(slot,$(theObj).data().pointsarray_prev,$(theObj).data().pointsstr_prev,points,points_str,ics,$(theObj).data().last_ics[cachetype][slot]);
						if ($(theObj).data().columnspecsDone[cachetype][slot]==icsl) $(theObj).data().kIndx_prev++; // all columnspecs for this slot are processed, count up slot
						if ($(theObj).data().kIndx_prev==$(theObj).data().nGraphs) {
							$(theObj).data().previous_cache_completed = true;
							deferred.resolve();
						}
					} else if (cachetype == 'next') {
						$(theObj).data().last_ics[cachetype][slot] = widget_chart.joinGraphs(slot,$(theObj).data().pointsarray_next,$(theObj).data().pointsstr_next,points,points_str,ics,$(theObj).data().last_ics[cachetype][slot]);
						if ($(theObj).data().columnspecsDone[cachetype][slot]==icsl) $(theObj).data().kIndx_next++; // all columnspecs for this slot are processed, count up slot
						if ($(theObj).data().kIndx_next==$(theObj).data().nGraphs) {
							$(theObj).data().next_cache_completed = true;
							deferred.resolve();
						}
					} else {
						$(theObj).data().last_ics[cachetype][slot] = widget_chart.joinGraphs(slot,$(theObj).data().pointsarray,$(theObj).data().pointsstr,points,points_str,ics,$(theObj).data().last_ics[cachetype][slot]);
						if ($(theObj).data().columnspecsDone[cachetype][slot]==icsl) $(theObj).data().kIndx++; // all columnspecs for this slot are processed, count up slot
						if ($(theObj).data().kIndx==$(theObj).data().nGraphs) { // last slot to be retrieved start painting chart
							if (!(($(theObj).data().filltime_start || $(theObj).data().filltime_end) && $(theObj).data().prefetch)) widget_chart.drawChart(theObj,type,swoffset,data_old,callback);
							deferred.resolve();
						}
					}
					//last point is repetition of column spec, dont add
					//points[i]=point;
				});
			}
		}
		return deferred.promise();
	},
	interpolate: function(leftx,lefty,rightx,righty,x) {
		var ret = 0;
		if (leftx!=undefined && lefty!=undefined && rightx!=undefined && righty!=undefined && x!=undefined) {
			if ((rightx-leftx) != 0) {
				ret = lefty + (x-leftx)/(rightx-leftx)*(righty-lefty);
			} else {
				ret = (lefty+righty)/2;
			}
		}
		return ret;
	},
	correctPoints4Filltime: function(data,igraph,p0,cachetype) {
		if ((data.filltime_start || data.filltime_end) && data.prefetch) { // if data points have been added at beginning and end, make them consistent with previous and next arrays if existing
			if (cachetype == 'previous' && data.filltime_start) {
				var p1 = data.pointsarray[igraph];
				if (p1 && p1.length && p1.length > 1 && p0 && p0.length && p0.length > 1) {
					p0[p0.length-1][1] = widget_chart.interpolate(
													parseFloat(p0[p0.length-2][0]),
													parseFloat(p0[p0.length-2][1]),
													parseFloat(p1[1][0])+parseFloat(p0[p0.length-1][0]), // in fillmode this is the distance to the leftmost point
													parseFloat(p1[1][1]),
													parseFloat(p0[p0.length-1][0])); // in filltime mode this is the rightmost point
				}
			}
			if (cachetype == 'next' && data.filltime_end) {
				var p1 = data.pointsarray[igraph];
				if (p1 && p1.length && p1.length > 1 && p0 && p0.length && p0.length > 1) {
					p0[0][1] = widget_chart.interpolate(
													parseFloat(p0[1][0]),
													parseFloat(p0[1][1]),
													parseFloat(p1[p1.length-2][0])-parseFloat(p1[p1.length-1][0]), // in fillmode this is the negative distance to the rightmost point
													parseFloat(p1[p1.length-2][1]),
													parseFloat(p0[0][0])); // in filltime mode this is the leftmost point
				}
			}
			if (cachetype == undefined) {
				if (data.filltime_start) {
					var p1 = data.pointsarray_prev[igraph];
					if (p1 && p1.length && p1.length > 1 && p0 && p0.length && p0.length > 1) {
						p0[0][1] = widget_chart.interpolate(
														parseFloat(p0[1][0]),
														parseFloat(p0[1][1]),
														parseFloat(p1[p1.length-2][0])-parseFloat(p1[p1.length-1][0]), // in fillmode this is the negative distance to the rightmost point
														parseFloat(p1[p1.length-2][1]),
														parseFloat(p0[0][0])); // in filltime mode this is the leftmost point
					}
				}
				if (data.filltime_end) {
					var p1 = data.pointsarray_next[igraph];
					if (p1 && p1.length && p1.length > 1 && p0 && p0.length && p0.length > 1) {
						p0[p0.length-1][1] = widget_chart.interpolate(
														parseFloat(p0[p0.length-2][0]),
														parseFloat(p0[p0.length-2][1]),
														parseFloat(p1[1][0])+parseFloat(p0[p0.length-1][0]), // in fillmode this is the distance to the leftmost point
														parseFloat(p1[1][1]),
														parseFloat(p0[p0.length-1][0])); // in filltime mode this is the rightmost point
					}
				}
			}
		}
	},
	drawChart: function (elem,intype,swoffset,data_old,callback,cachetype) { // main function for generation of all HTML code and dynamics for graph called whenever thigs change (e.g. data update, shift, scale, ...)
		var theObj;
		if (elem) theObj=elem; else theObj=this;
		$(theObj).data('drawing',true);
		var data = $(theObj).data();
		//console.log(cachetype==undefined?'actual':cachetype);
		var data_save = jQuery.extend(true,{},$(theObj).data()); // keep original data in order to reset at end of 'previous' and 'next' calls
		//if (cachetype && !data.baseDone) return;
		var type = intype.split(' ')[0]; // derive the first word of type (second word sets reset flag)
		var doReset = intype.split(' ')[1]?(intype.split(' ')[1]=='reset'):false; // derive the first word of type (second word sets reset flag)
		if (type=="resize") data.legend_pos = undefined;
		//console.log('start --> ',cachetype, data.baseDone, pointsarray,new Error().stack);

		var y_margin = [];
		if ($.isArray(data.y_margin)) y_margin=[parseInt(data.y_margin[0]),parseInt(data.y_margin[data.y_margin.length-1])]; else y_margin=[parseInt(data.y_margin),parseInt(data.y_margin)];
		var y_margin_sec = [];
		if ($.isArray(data.y_margin_sec)) y_margin_sec=[parseInt(data.y_margin_sec[0]),parseInt(data.y_margin_sec[data.y_margin_sec.length-1])]; else y_margin_sec=[parseInt(data.y_margin_sec),parseInt(data.y_margin_sec)];
		var xticks = parseFloat( (data.xticks!="auto") ? data.xticks : -1 );
		
		var style_array_prep = data.style;
		var ptype_array = data.ptype;
		var uaxis_array = data.uaxis;
		var legend_array = data.legend;
		var noticks = ( data.width <=100 ) ? true : $(theObj).hasClass('noticks');
		var nobuttons = $(theObj).hasClass('nobuttons');
		var AI;
		data.noticks = noticks;
		data.leftOffset = 0;

		doReset = doReset || type=='shift' || type=='scale' || data.offsetX===undefined || data.scaleX===undefined || data.scaleDeltaX===undefined;
		if (doReset) {
			data.offsetX = 0; // offset for shifting arbitrarily due to mousemove and touchmove handling
			data.scaleX = 1; // scale for scaling arbitrarily due to mousemove and touchmove handling
			data.scaleDeltaX = 0; // scale for scaling arbitrarily due to mousemove and touchmove handling
		}

		if (cachetype=='next') {
			data.shift -= 1;
		} else if (cachetype=='previous') {
			data.shift += 1;
		}
		widget_chart.initializeTime(data);
		//console.log(cachetype+": ",data.days_start, data.days_end, data.shift, data.scale, new Error().stack);

		var DDD = {};
		if (!data.DDD) data.DDD = DDD;
		var browserCaps = widget_chart.getBrowserCaps();
		data.DDD.has3D = browserCaps.result;
		data.DDD.prefix = browserCaps.prefix;
		if (!data.DDD.dir) data.DDD.dir = {x:1,y:1};
		if (data.ddd === undefined || !data.DDD.has3D) data.DDD.Active=false; else data.DDD.Active=true;
		data.DDD.Setting = ($.isArray(data.ddd) && data.DDD.has3D)?((data.ddd.length==3)?data.ddd:['0','0','0']):['0','0','0']; // set transformation array for 3D display
		data.DDD.Space = function(k) {return parseFloat(widget_chart.getArrayValue($.isArray(data.dddspace)?data.dddspace:parseFloat(data.dddspace),k,15));};
		data.DDD.Width = function(k) {return parseFloat(widget_chart.getArrayValue($.isArray(data.dddwidth)?data.dddwidth:parseFloat(data.dddwidth),k,10));};
		data.DDD.Distance = function(k) {return (data.DDD.Space(k) + data.DDD.Width(k));};
		data.DDD.String = {};
		data.DDD.String.Rot = data.DDD.prefix+'transform: rotateX('+data.DDD.Setting[0]+'deg) '+'rotateY('+data.DDD.Setting[1]+'deg) '+'rotateZ('+data.DDD.Setting[2]+'deg)';
		data.DDD.String.Trans = function(offset,n,DDD,x,y) {
			var ret=0;
			for(var ii=0; ii<n-1; ii++) {
				ret+=parseFloat(DDD.Distance(ii));
			}
			return DDD.prefix+'transform-origin: '+x+' '+y+' '+(-(offset+ret))+'px';
		};
		data.DDD.BackplaneZ = function(DDD,n) {
			var ret=0;
			for(var ii=0; ii<n-1; ii++) {
				ret+=parseFloat(DDD.Distance(ii));
			}
			return ret+DDD.Width(n);
		};

		data.getGraphLeft = function() {var ret = this.noticks?this.leftOffset:this.leftOffset+(this.unusedYAxesVisible?this.textWidth_prim.sum():this.textWidth_prim.max()); return ret;};

		data.transform = function (value,type,transfunc) { // do any kind of functional transformation of scaled y values in the original y data space
			var valData = (this.isPrimary(type))?(value+this.shiftY)/this.scaleY:(value+this.shiftY_sec)/this.scaleY_sec;
			valData = transfunc(valData);
			return valData*this.getAxisSetting('scaleY',type)-this.getAxisSetting('shiftY',type);
		};

		data.getAxisIndex = function(uaxis) {
			return $.isArray(uaxis)?(uaxis.length>1?uaxis[1]:0):0;
		}
		
		data.flatUaxis = function(uaxis) {
			if ($.isArray(uaxis)) {
				return uaxis[0];
			} else {
				return uaxis;
			}			
		}
		
		data.isPrimary = function (uaxis) {
			if ($.isArray(uaxis)) {
				return uaxis[0]!='secondary';
			} else {
				return uaxis!='secondary';
			}
		};
		
		data.getAxisSetting = function(par,uaxis) {
			var extension = this.isPrimary(uaxis)?'':'_sec';
			if ($.isArray(uaxis)) {
				var index = uaxis.length>1?uaxis[1]:0;
				var value = widget_chart.getArrayValue(this[par+extension],index,'');
			} else {
				value = this[par+extension];
			}
			return $.isArray(value)?value[0]:value;
		};
		
		data.getYAxisDisplayPrio = function(uxs,aindex) {
			var ret = true;
			var ai = parseInt(this.yticks_prio.replace(/.*\:/,""))||0;
			if (this.yticks_prio.search('auto')<0 && (this.yticks_prio.search(uxs)<0 || ai != aindex)) ret = false;
			if (this.yticks_prio.search('auto')>=0) ret=false;
			return ret;
		};

		//data.isLogAxis = function(uaxis) {return ((this.ytype && uaxis!='secondary' && this.ytype=='log') || (this.ytype_sec && uaxis=='secondary' && this.ytype_sec=='log'));};
		data.isLogAxis = function(uaxis) {return (this.getAxisSetting('ytype',uaxis)=='log');};
		
		data.transD2W = function(p,type) { // do transformation of scaled function coordinates to world coordinates
			var res = [];
			res[0] = (this.getGraphLeft()) + p[0]/this.xrange*(this.graphArea.width);
			res[1] = this.topOffset + (1-(p[1]-this.getAxisSetting('min_save',type))/(this.getAxisSetting('max_save',type)-this.getAxisSetting('min_save',type)))*(this.graphArea.height);
			return res;
		};

		data.getOffsetX = function(inv) {return this.offsetX + this.scaleDeltaX;};

		data.popup = ($(theObj).parent().data().id && $(theObj).parent().data().id.match(/popup_.*/))?true:false;

		var instance = data.instance;
		var svg_old = $(theObj).find('svg.basesvg'+instance); // get previous graphics document (SVG, only skeleton at initial call)
		
		// unregister events for swipe
		//if (!data.logProxy) widget_chart.detectSwipe(svg_old.find("rect.chart-background, [id*='graph-']"),true);


		if (!svg_old.parent().is(':visible') || svg_old.width()<=0) {if (!cachetype) $(theObj).data('baseDone',true); return}; // chart div is not visible nothing to do

		if (svg_old.height() <= 0) {
			data.getDefaultSize($(theObj));
			svg_old.height(data.defaultHeight); //in case of popup the init function can not detect the right size of the window, so we have to do it here
			if (svg_old.parent().height != data.defaultHeight) {
				data.defaultHeight = data.defaultHeight/svg_old.parent().height()*data.defaultHeight;
				svg_old.height(data.defaultHeight);
			}
		}
		
		var classesContainer = svg_old.find('#classesContainer');

		if (!cachetype) {
			data.yLimits = [];

			for (k=0; k<data.nGraphs; k++) {	// main loop for initializing value for different y-Axes
				uaxis = widget_chart.getArrayValue(uaxis_array,k,'primary');
				AI = data.getAxisIndex(uaxis);
				if (!data.yLimits[AI]) data.yLimits[AI] = {primary:{},secondary:{}};
				var minarray = data.getAxisSetting('minvalue',uaxis);
				var maxarray = data.getAxisSetting('maxvalue',uaxis);
				if (data.isPrimary(uaxis)) {
					data.yLimits[AI].primary.min = parseFloat( $.isArray(minarray) ? minarray[minarray.length-1] : (minarray!="auto") ? minarray : Number.POSITIVE_INFINITY );
					data.yLimits[AI].primary.max = parseFloat( $.isArray(maxarray) ? maxarray[maxarray.length-1] : (maxarray!="auto") ? maxarray : Number.NEGATIVE_INFINITY );
					if (data.isLogAxis(uaxis)) {
						data.yLimits[AI].primary.min = Math.log10_t(data.yLimits[AI].primary.min);
						data.yLimits[AI].primary.max = Math.log10_t(data.yLimits[AI].primary.max);
					}
				} else {
					data.yLimits[AI].secondary.min = parseFloat( $.isArray(minarray) ? minarray[minarray.length-1] : (minarray!="auto") ? minarray : Number.POSITIVE_INFINITY );
					data.yLimits[AI].secondary.max = parseFloat( $.isArray(maxarray) ? maxarray[maxarray.length-1] : (maxarray!="auto") ? maxarray : Number.NEGATIVE_INFINITY );
					if (data.isLogAxis(uaxis)) {
						data.yLimits[AI].secondary.min = Math.log10_t(data.yLimits[AI].secondary.min);
						data.yLimits[AI].secondary.max = Math.log10_t(data.yLimits[AI].secondary.max);
					}
				}
			}
		}
		
		var xrng = Number.NEGATIVE_INFINITY;
		var minx = Number.POSITIVE_INFINITY;
		var maxx = Number.NEGATIVE_INFINITY;

		// check if arrays with data points are already existing and transfer them to working copies
		switch (cachetype) {
			case 'previous':
				var pointsarray = (data.pointsarray_prev)?data.pointsarray_prev.clone():[];
				break;
			case 'next':
				var pointsarray = (data.pointsarray_next)?data.pointsarray_next.clone():[];
				break;
			default:
				var pointsarray = (data.pointsarray)?data.pointsarray.clone():[];
				break;
		}

		var pointsarrayCursor = (data.pointsarrayCursor)?data.pointsarrayCursor.clone():[];
		var pointsstr = (data.pointsstr)?data.pointsstr.clone():[];
		
		var foundPrimary = false, foundSecondary = false;
		
		//check the input arrays to derive the one with biggest length
		data.nGraphs = widget_chart.getnGraphs(data);
		data.logProxy = false;
		var points, points_str;
		var borders;
		var max, min, style, timeformat, uaxis, ptype, legend;
		var i, j, il, l, k, lk, ik, i1;
		var x,y,g;
		if (!cachetype) {
			data.maxvals = []; // needed for correct setting of dynamic gradients for coloring according to data values
			data.minvals = []; // needed for correct setting of dynamic gradients for coloring according to data values
		}

		// prepare stacking mode
		var orig_PA_lengths = [];
		var sortingbase4PA = [];

		var nofilldown = data.nofilldown.clone();
		var correctStackingTypes = function(d,ig) { // recursive function to correct stacking settings according to hidden graphs
			var ptp = widget_chart.getArrayValue(data.ptype,ig,'lines');
			if (ptp.search('icons:')<0 && ptp.search(':')>=0) { // we have stacking type let us check, if the base is visible or not
				var ptp_settings = ptp.split(':');
				var treatstacking = d.graphsshown[ptp_settings[1]] || !d.legend_stacking;
				if (!treatstacking) { // we have a reference to a hidden graph, lets look if this one has to be corrected either
					ptp = correctStackingTypes(d,ptp_settings[1]);
				}
			}
			return ptp;
		};

		var pta_temp = [];
		
		for (ik=0; ik<data.nGraphs; ik++) {	// iterate through all graphs of this chart
			if (!$.isArray(pointsarray[ik])||!pointsarray[ik].length||pointsarray[ik].length-1<ik) pointsarray[ik] = []; // make sure that there is an entry for slot ik (even if it is empty)
			widget_chart.correctPoints4Filltime(data,ik,pointsarray[ik],cachetype); // correct points at begin and end if filltime and prefetch has been set
			var ptp = widget_chart.getArrayValue(data.ptype,ik,'lines');
			pta_temp[ik] = correctStackingTypes(data,ik); //correct stacking settings according to hidden graphs
			if (ptp.search(':')>=0 && pta_temp[ik].search(':')>=0) { // adapt ptype to use fitting visible underlying graph
				pta_temp[ik] = pta_temp[ik].replace(/.*\:/,ptp.split(':')[0]+':');
			} else if (ptp.search(':')>=0) {
				pta_temp[ik] = ptp.split(':')[0]; // there is no remaining visible underlying graph, set ptype to purely using own data
			}
		}
		ptype_array = pta_temp;

		$.each(pointsarray, function(ind,val) { // keep original lengths for stacking mode

			orig_PA_lengths[ind]=(val && val.length)?val.length:0;
			ptype = widget_chart.getArrayValue(ptype_array,ind,'lines');
			if (ptype.search('icons:')<0 && ptype.search(':')>=0) { // stack mode, care for sorting of graphs in right order
				var stl = 0;
				stl = widget_chart.getStackingLevel(ptype,ptype_array,stl);
				sortingbase4PA[ind] = {'index':ind,'key':stl}; // sort according to stacking order
			} else {
				sortingbase4PA[ind] = {'index':ind,'key':0}; // make sure that graphs with no dependency on others are calculated first
			}
		});
		sortingbase4PA.sort(function(a,b) {return parseFloat(a.key) - parseFloat(b.key);});

		for (var k=data.nGraphs-1; k>=0; k--) { // main loop for generation of page content (chart with graphs)
			ptype = widget_chart.getArrayValue(ptype_array,k,'lines');
			style = widget_chart.getArrayValue(style_array_prep,k,'');
			if ((ptype.search('icons:')>=0) || ($.isArray(style) && style[0].search(/graphbase/)>=0)) { // copy data values to graphs which use ptype "icons:.."
				if ($.isArray(style) && style[0].search(/graphbase/)>=0) { // there is a dynamic style definition
					$.each(["rotation","size"], function(index, value) {
						iv = -1;
						$.each(style, function(i,v){
							var si = v.split(':');
							if (si[0].search(value)>=0) iv = si.length>1?si[1]:-1;
						});
						if (pointsarray[iv]) {
							for (var i1=0, i1l=pointsarray[k].length; i1<i1l; i1++) {
								var found = false;
								for (var i2=1, i2l=pointsarray[iv].length; i2<i2l; i2++) {
									if (pointsarray[iv][i2][0] > pointsarray[k][i1][0]) { // found fitting reference value
										pointsarray[k][i1][3+index] = pointsarray[iv][i2-1][1]; // save respective values to additional array values
										found = true;
										break;
									}
								}
								if (!found) pointsarray[k][i1][3+index] = pointsarray[iv]&&pointsarray[iv][pointsarray[iv].length-1]?pointsarray[iv][pointsarray[iv].length-1][1]:0; // no fitting time value found, use last value of reference array instead
							}
						}
					});
				}
				var iv = ptype.search('icons:')>=0?ptype.split(':')[1]:style[0].split(':')[1];
				if (pointsarray[iv]) {
					for (var i1=0, i1l=pointsarray[k].length; i1<i1l; i1++) {
						var found = false;
						for (var i2=1, i2l=pointsarray[iv].length; i2<i2l; i2++) {
							if (pointsarray[iv][i2][0] > pointsarray[k][i1][0]) { // found fitting reference value
								pointsarray[k][i1][1] = pointsarray[iv][i2-1][1];
								found = true;
								break;
							}
						}
						if (!found) pointsarray[k][i1][1] = pointsarray[iv]&&pointsarray[iv][pointsarray[iv].length-1]?pointsarray[iv][pointsarray[iv].length-1][1]:0; // no fitting time value found, use last value of reference array instead
					}
				}
				if (ptype.search('icons:')>=0) {
					ptype = 'icons';
				} else {
					style=widget_chart.getDynamicStyle(style);					
				}
			} else if (ptype.search(':')>=0) {
				//ptype = ptype.split(':')[0];
			}
		}

		for (ik=0; ik<data.nGraphs; ik++) {	// do postprocesssing of data due to different settings (e.g. stacking, logproxy)
			k=((sortingbase4PA.length&&(sortingbase4PA.length-1>=ik)&&sortingbase4PA[ik]&&sortingbase4PA[ik].index)?sortingbase4PA[ik].index:ik);
			//k=sortingbase4PA[ik].index;
			uaxis = widget_chart.getArrayValue(uaxis_array,k,'primary');
			AI = data.getAxisIndex(uaxis);
			points=[];
			points_str=[];
			if (!cachetype) {
				data.minvals[k] = Number.POSITIVE_INFINITY;
				data.maxvals[k] = Number.NEGATIVE_INFINITY;
			}

			// get graph definitions from configuration file
			ptype = widget_chart.getArrayValue(ptype_array,k,'lines');

			legend = widget_chart.getArrayValue(legend_array,k,'Graph '+k);
			style = widget_chart.getDynamicStyle(widget_chart.getArrayValue(style_array_prep,k,''));
			points = pointsarray[k].clone();
			points_str = pointsstr[k].clone();

			if (ptype.search('icons:')<0 && ptype.search(':')>=0) { // stack mode, got to do preparation of values for stacking
				var dointerpolate = (ptype.search('lines')>=0 || ptype.search('cubic')>=0 || ptype.search('quadratic')>=0 || ptype.search('quadraticSmooth')>=0);
				var iv = parseInt(ptype.split(':')[1]);
				for (var i1=0, i1l=points.length; i1<i1l; i1++) {
					var found = false;
					if (points[i1].length < 3) points[i1][2] = points[i1][1] + " " + data.getAxisSetting('yunit',uaxis); // keep original value for cursor display
					for (var i2=1, i2l=orig_PA_lengths[iv]; i2<i2l; i2++) {
						if (pointsarray[iv][i2][0] > points[i1][0]) { // found fitting reference value
							if (dointerpolate) {
								points[i1][1] += widget_chart.interpolate(	pointsarray[iv][i2-1][0],
																pointsarray[iv][i2-1][1],
																pointsarray[iv][i2][0],
																pointsarray[iv][i2][1],
																points[i1][0]); 	// add value of underlying graph to acutal value
							} else {
								points[i1][1] += pointsarray[iv][i2-1][1]; // add value of underlying graph to acutal value
							}
							found = true;
							break;
						}
					}
					if (!found) {
						points[i1][1] += pointsarray[iv][pointsarray[iv].length-1][1]; // add value of underlying graph to acutal value
					}
				}
				if ((style.search(/fill/)>=0)) {
					var lastPointUpper = points[points.length-2]?points[points.length-1].clone():[0,0];
					
					points[points.length] = points[0]?points[0].clone():[0,0];
					points[points.length-1][5] = true; // set marker for not connecting the line but rather go back to start

//					for (var i2=orig_PA_lengths[iv]-1, i2l=0; i2>=i2l; i2--) {	// add underlying graph as lower bound of new graph
					for (var i2=0; i2<orig_PA_lengths[iv]; i2++) {	// add underlying graph as lower bound of new graph
						points[points.length] = pointsarray[iv][i2].clone();
					}
					points[points.length] = lastPointUpper;
				}
				nofilldown[k] = true;
				ptype = ptype.split(':')[0];
			}
			
			// check if current graph is related to secondary or primary y axis
			if (data.isPrimary(uaxis)) {
				foundPrimary = true;
				max = data.yLimits[AI].primary.max;
				min = data.yLimits[AI].primary.min;
			} else {
				foundSecondary = true;
				max = data.yLimits[AI].secondary.max;
				min = data.yLimits[AI].secondary.min;
			}
			var minAry = data.getAxisSetting('minvalue',uaxis);
			var maxAry = data.getAxisSetting('maxvalue',uaxis);
			if (!cachetype) {
				$.each(points, function( ind, value ) { // get min and max values
					var val = value[1];
					if (val>max && $.isArray(maxAry) ) {
						for(j=0; j<maxAry.length; j++) {
							if (maxAry[j]>val) {
								max = maxAry[j];
								break;
							}
						}
					}

					data.minvals[k] = Math.min(data.minvals[k],val);
					data.maxvals[k] = Math.max(data.maxvals[k],val);

					if (val>max && maxAry=="auto") {
						max = parseFloat(val); // calculate maximum y value
					}
					
					if (val > -Infinity && val<min && $.isArray(minAry) ) { // calculate minimum y value
						for(j=minAry.length-1; j>=0; j--) {
							if (minAry[j]<val) {
								min = minAry[j];
								break;
							}
						}
					}
					if (val > -Infinity && val<min && minAry=="auto") {
						min = parseFloat(val);
					}
				});
			}

			if (ptype.indexOf('_proxy') >= 0) { // Logproxy mode activated, got to postprocess and calculate graph area
				data.logProxy = true;
				if (true) {
					borders = {'minx':Number.POSITIVE_INFINITY,'maxx':Number.NEGATIVE_INFINITY,'miny':Number.POSITIVE_INFINITY,'maxy':Number.NEGATIVE_INFINITY};
					widget_chart.processLogproxyData(borders,points_str,points); // convert input from logproxy to data for further operation
					minx = Math.min(minx,borders.minx);
					maxx = Math.max(maxx,borders.maxx);
					xrng = Math.max(xrng,maxx-minx);
					min = Math.min(min,borders.miny);
					max = Math.max(max,borders.maxy);
				} else {
					ptype_array = widget_chart.setArrayValue(ptype_array,ptype,k);
					xrng = data.xrng;
					minx = data.minx;
					min = data.miny;
					max = data.maxy;
				}
			}

			widget_chart.doLog("widget_chart.refresh","Got " + points.length + " points for Graph " + (k+1));
			pointsstr[k] = points_str;
			if (data.dosort) {
				pointsarray[k]=points.sort(function(a,b) {return parseFloat(a[0]) > parseFloat(b[0]);}); // jshint ignore:line
			} else {
				pointsarray[k]=points;
			}

			if (data.isPrimary(uaxis)) {
				data.yLimits[AI].primary.min = min;
				data.yLimits[AI].primary.max = max;
			} else {
				data.yLimits[AI].secondary.min = min;
				data.yLimits[AI].secondary.max = max;
			}
		}

		for (k=0; k<data.nGraphs; k++) {	// main loop for initializing value for different y-Axes
			uaxis = widget_chart.getArrayValue(uaxis_array,k,'primary');
			AI = data.getAxisIndex(uaxis);
			if (data.yLimits[AI].primary.max==Number.NEGATIVE_INFINITY) {data.yLimits[AI].primary.max=0.01; data.yLimits[AI].primary.min=0;} // we did not find any value so set max to zero.
			if (data.yLimits[AI].primary.max==data.yLimits[AI].primary.min) data.yLimits[AI].primary.max+=0.01;
			if (data.yLimits[AI].secondary.max==Number.NEGATIVE_INFINITY) {data.yLimits[AI].secondary.max=0.01; data.yLimits[AI].secondary.min=0;} // we did not find any value so set max to zero.
			if (data.yLimits[AI].secondary.max==data.yLimits[AI].secondary.min) data.yLimits[AI].secondary.max+=0.01;

			if (data.isLogAxis(uaxis)) { // modify values to logarithmic ones
				for (var i1=0, i1l=pointsarray[k].length; i1<i1l; i1++) {
					if (pointsarray[k][i1].length < 3)pointsarray[k][i1][2] = pointsarray[k][i1][1] + " " + data.getAxisSetting('yunit',uaxis); // keep original value for cursor display
					pointsarray[k][i1][1] = Math.log10_t(pointsarray[k][i1][1]);
				}
			}
		}

		if (xrng > Number.NEGATIVE_INFINITY) {	// correction needed for logproxy polar once again because of correction for text overflows
			il = true?10:0;
			for (i=0; i<il; i++) {				// as xrng is depending on result and vice versa, we have to do an iteration, convergence should be OK with 10 loops
				var sclx = xrng/parseFloat(svg_old.width());
				var scly = (max-min)/parseFloat(svg_old.height());
				xrng = Number.NEGATIVE_INFINITY;
				minx = Number.POSITIVE_INFINITY;
				for (k=0; k<data.nGraphs; k++) {
					points=pointsarray[k];
					borders = {'minx':Number.POSITIVE_INFINITY,'maxx':Number.NEGATIVE_INFINITY,'miny':Number.POSITIVE_INFINITY,'maxy':Number.NEGATIVE_INFINITY};
					widget_chart.processLogproxyCorrection(borders,points,style.replace(/(sym|dash|dot|fill|)/g,'')+'sym',sclx,scly,svg_old); // convert input from logproxy to data for further operation
					minx = Math.min(minx,borders.minx);
					maxx = Math.max(maxx,borders.maxx);
					xrng = Math.max(xrng,maxx-minx);
					min = Math.min(min,borders.miny);
					max = Math.max(max,borders.maxy);
					data.yLimits[AI].primary.min = min;
					data.yLimits[AI].primary.max = max;
				}
			}
			data.noticks = true;
			noticks = true;
			data.xrng = xrng;
			data.xrange = xrng;
			data.minx = minx;
			data.miny = min;
			data.maxy = max;
			for (i=0, il=pointsarray.length; i<il; i++)
				for (var ii=0, iil=pointsarray[i].length; ii<iil; ii++) {
					pointsarray[i][ii][0]-=minx;
				}
		}

		// calculate space for text at primary and secondary axes
		data.dateWidth = widget_chart.getTextSizePixels(svg_old,data.tstart.ddmm(),'text axes').width;
		data.textHeight = widget_chart.getTextSizePixels(svg_old,'O','text axes').height;
		data.textWidth_prim = [];
		data.textWidth_sec = [];

		var aiDone = {primary: [], secondary: []};
		var style_array = $.isArray(style_array_prep)?style_array_prep.clone(false):style_array_prep;
		
		for (k=0; k<data.nGraphs; k++) {	// main loop for initializing value for different y-Axes
			uaxis = widget_chart.getArrayValue(uaxis_array,k,'primary');
			AI = data.getAxisIndex(uaxis);
			var str = '0';
			if (aiDone[AI]) continue;
			if (data.isPrimary(uaxis) && !aiDone.primary[AI]) {
				aiDone.primary[AI] = true;
				data.yLimits[AI].primary.yticks = data.getAxisSetting('yticks',uaxis);
				data.yLimits[AI].primary.yticks_format = data.getAxisSetting('yticks_format',uaxis);
				data.yLimits[AI].primary.yticks_prio = data.getYAxisDisplayPrio(data.flatUaxis(uaxis),AI);
				var yticks = parseFloat( (data.yLimits[AI].primary.yticks!="auto") ? data.yLimits[AI].primary.yticks : -1);
				var autoscaley = data.yLimits[AI].primary.yticks?data.yLimits[AI].primary.yticks=="auto":true;
				if (autoscaley) fix = (widget_chart.getYTicksBase(data.yLimits[AI].primary.min,data.yLimits[AI].primary.max) < 10) ? 1 : 0;
				var fix = $.isArray(data.yLimits[AI].primary.yticks)?(data.yLimits[AI].primary.yticks[1]?(($.isArray(data.yLimits[AI].primary.yticks[1])?data.yLimits[AI].primary.yticks[1][0]:data.yLimits[AI].primary.yticks[1]) - ymin_t):ymin_t):widget_chart.precision( data.yLimits[AI].primary.yticks );
				var lytText = data.yLimits[AI].primary.yticks_format?data.yLimits[AI].primary.yticks_format.stripFormat().length:(data.yLimits[AI].primary.max==-Infinity)?3:data.yLimits[AI].primary.max.toFixed(fix).length;
				data.textWidth_prim[AI] = (foundPrimary&&!noticks)?widget_chart.getTextSizePixels(svg_old,str.repeat(lytText)+data.getAxisSetting('yunit',uaxis).stripFormat(),'text axes').width:0;
				data.textWidth_prim[AI] += ((noticks)?0:data.textHeight+2); // additional offset for axes descrption (text 90 deg)
			} else if (!data.isPrimary(uaxis) && !aiDone.secondary[AI]){
				aiDone.secondary[AI] = true;
				data.yLimits[AI].secondary.yticks = data.getAxisSetting('yticks',uaxis);
				data.yLimits[AI].secondary.yticks_format = data.getAxisSetting('yticks_format',uaxis);
				data.yLimits[AI].secondary.yticks_prio = data.getYAxisDisplayPrio(data.flatUaxis(uaxis),AI);
				var yticks = parseFloat( (data.yLimits[AI].secondary.yticks!="auto") ? data.yLimits[AI].secondary.yticks : -1);
				var autoscaley = data.yLimits[AI].secondary.yticks?data.yLimits[AI].secondary.yticks=="auto":true;
				if (autoscaley) fix = (widget_chart.getYTicksBase(data.yLimits[AI].secondary.min,data.yLimits[AI].secondary.max) < 10) ? 1 : 0;
				var fix = $.isArray(data.yLimits[AI].secondary.yticks)?(data.yLimits[AI].secondary.yticks[1]?(($.isArray(data.yLimits[AI].secondary.yticks[1])?data.yLimits[AI].secondary.yticks[1][0]:data.yLimits[AI].secondary.yticks[1]) - ymin_t):ymin_t):widget_chart.precision( data.yLimits[AI].secondary.yticks );
				var lytText = data.yLimits[AI].secondary.yticks_format?data.yLimits[AI].secondary.yticks_format.stripFormat().length:(data.yLimits[AI].secondary.max==-Infinity)?3:data.yLimits[AI].secondary.max.toFixed(fix).length;
				data.textWidth_sec[AI] = (foundSecondary&&!noticks)?widget_chart.getTextSizePixels(svg_old,str.repeat(lytText)+data.getAxisSetting('yunit',uaxis).stripFormat(),'text axes').width:0;
				data.textWidth_sec[AI] += ((noticks)?0:data.textHeight+2); // additional offset for axes descrption (text 90 deg)
			}

			style = widget_chart.getDynamicStyle(widget_chart.getArrayValue(style_array_prep,k,'')); // set dynamic gradients
			if ($.isArray(style)) {
				style = widget_chart.generateGradient((!data.isPrimary(uaxis))?data.yLimits[AI].secondary.min:data.yLimits[AI].primary.min,(!data.isPrimary(uaxis))?data.yLimits[AI].secondary.max:data.yLimits[AI].primary.max,data.minvals[k],data.maxvals[k],style,instance,k);
				style_array[k] = style;
			}
		}

		// calculate space for x Axis and text heights
		var styleV = widget_chart.getStyleRuleValue(classesContainer, 'font-size', '.text axes');
		var fszA = (styleV)?parseFloat(styleV.split('px')):9;
		var nlines = (data.timeformat !== undefined)?(data.timeformat.match(/LF/g)?data.timeformat.match(/LF/g).length+1:1):1;
		data.bottomOffset = noticks?0:(data.textHeight*nlines);
		styleV = widget_chart.getStyleRuleValue(classesContainer, 'font-size', '.caption');
		var fszC = (styleV)?parseFloat(styleV.split('px')):9;
		styleV = widget_chart.getStyleRuleValue(classesContainer, 'font-size', '.buttons');
		var fszB = (styleV)?parseFloat(styleV.split('px')):18;
		// calculation of stroke width for stroke scaling
		// var strokeWidth = (document.documentElement.style.vectorEffect === undefined) ? (max_prim-min_prim)/150 : 1;

		data.xscale = data.xrange; // set new value for scale (used for scale animation)
		
		if (svg_old) { // we need some pixels space for the text surrounding the plot
			data.basewidth = parseFloat(svg_old.width());
			styleV = widget_chart.getStyleRuleValue(classesContainer, 'font-size', (data.title_class?'.'+data.title_class:''));
			var fszTT = (styleV)?parseFloat(styleV.split('px')):0;
			widget_chart.generateWrappedHeader(svg_old,data,fszTT);
			var fszT = data.title?Math.max(fszC+data.margin,(fszTT+data.margin)*data.title_lines):0;
			data.topOffset = nobuttons?(data.textHeight)/2+3*data.margin+fszT:(fszC>fszB)?fszC+fszT+3*data.margin:fszB+fszT+3*data.margin;

			data.baseheight = parseFloat(svg_old.height());
			data.graphWidth = (data.basewidth-(data.getGraphLeft()+(data.unusedYAxesVisible?data.textWidth_sec.sum():data.textWidth_sec.max())))/data.basewidth * 100.0;
			data.graphHeight = (data.baseheight-((data.noticks)?0:data.bottomOffset)-data.topOffset)/data.baseheight * 100.0;

			//Save pixel coordinates of graph area for later use
			var oS = svg_old.offset();
			data.chartArea = {
				left:oS.left,
				top:oS.top,
				width:svg_old.width(),
				height:svg_old.height()
			};

			data.setGraphParameters = function() {
				this.graphArea = {
					left:this.chartArea.left + (this.getGraphLeft()),
					top:this.chartArea.top + this.topOffset,
					width:this.graphWidth/100*this.basewidth,
					height:this.chartArea.height-this.topOffset-(noticks?0:this.bottomOffset)
				};

				// Strings needed for setting 3D Transformation
				this.xStr = (this.getGraphLeft()) + 'px';
				this.xStrTO = (this.getGraphLeft()) + 'px';
				this.yStr = this.graphWidth/100*this.basewidth+'px';
				this.yStrTO = this.graphHeight/100*this.baseheight+'px';
			};

			data.setGraphParameters();
			//data.graphWidth = (data.basewidth-((noticks)?0:data.textWidth_prim+data.textWidth_sec))/data.basewidth * 100.;
			//data.graphHeight = (data.baseheight-(data.topOffset+data.bottomOffset));
			data.projectionDist = 5000;
			widget_chart.getDDDBox(data,theObj);
			//data.graphWidth *= data.DDD.scaleX;
			//data.graphHeight *= data.DDD.scaleY;
			data.DDD.String.Scale = 'translate('+(data.DDD.shiftX)+'px, '+(data.DDD.shiftY)+'px) scale('+data.DDD.scaleX+', '+data.DDD.scaleY+')';
			//console.log(data.instance, data, data.basewidth, data.baseheight);
		}
		
		//calculate xticks automatically
		var xticksArray;
		if (xticks == -1) {
			var lFs = data.tstart.isLeapYear()?1:0;
			var lFe = data.tend.isLeapYear()?1:0;
			var lF = (data.tend.getMonth()<2)?lFs:lFe;
			var mdiff = widget_chart.dateDiff(data.tstart,data.tend,'m');					// minutes between mindate and maxdate
			var ddiff = widget_chart.dateDiff(data.tstart,data.tend,'d');					// days between mindate and maxdate
			var ydiff = widget_chart.dateDiff(data.tstart,data.tend,'y');					// years between mindate and maxdate
			var nticks;
			var xticksArrayMonths = true;
			var dst = 0;
			if (ddiff<=4) {													// check if we have less than four days between ticks
				nticks = (data.graphArea.width>400)?12:(data.graphArea.width>200)?6:3;	// set the number of ticks to 12, 6 or 3 if window is not so wide
				timeformat = '';
			} else if (ddiff<=7) {											// check if we have less than two weeks between ticks
				nticks = (data.graphArea.width>200)?7:3.5;						// set the number of ticks to 7 or 3.5 if window is not so wide
				timeformat = '';
			} else if (ddiff<=data.tstart.myGetDaysInMonth()) {				// check if we have less than one month between ticks
				xticksArrayMonths = false;
				var dateTemp = new Date(data.tstart);
				if (data.graphArea.width>200) {									// set the number of ticks according to one week or half a week
					nticks = ddiff/3.5;
					var off1 = 3;
					var off2 = 4;
					if (dateTemp.getDay() == 0) {							// Sunday, start right here
						xticksArray = [0];
					} else if (dateTemp.getDay() <= 3) {					// First half of the week, we start with a Wednesday
						xticksArray = [3-dateTemp.getDay()];
						off1 = 4;
						off2 = 3;
					} else {												// Second half of the week, we start with a Sunday
						xticksArray = [7-dateTemp.getDay()];
					}
				} else {
					nticks = ddiff/7;
					if (dateTemp.getDay() == 0) {							// Sunday, start right here
						xticksArray = [0];
					} else {
						xticksArray = [7-dateTemp.getDay()];				// set to number of day to next Sunday
					}
				}
				for(i=1, il=parseInt(nticks+0.5); i<il; i++) {
					xticksArray[i] = ((ddiff/nticks==7)?7:((i%2==1)?off1:off2)); // set to next Sunday (if separation are weeks) or Sunday following Wendnesday and so forth if half weeks
				}
				timeformat = "dd.MM";
			} else if (ddiff<=366){											// several months between ticks
				var dateTemp = new Date(data.tstart.getFullYear(),9,1);
				dst = dateTemp.dst()/60/24;
				if (data.graphArea.width>400 || ddiff<=188)	{					// set the number of ticks to 12, 6 or 3 if window is not so wide
					nticks = 12;
					xticksArray = [31,28+lF,31-dst,30,31,30,31,31,30,31+dst,30,31];	// set array for months
				}
				else if (data.graphArea.width>200 || ddiff<=94) {
					nticks = 6;
					xticksArray = [31+28+lF,31-dst+30,31+30,31+31,30+31+dst,30+31];	// set array for months
				}
				else {
					nticks = 3;
					xticksArray = [31+28+lF+31-dst+30,31+30+31+31,30+31+dst+30+31];	// set array for months
				}
				timeformat = "MMM";
			} else{															// more than one year between ticks
				nticks = ydiff;												// display full years.
				timeformat = "yyyy";
				xticksArray = [];
				var dateTemp = new Date(data.tstart);
				for(i=0; i<nticks; i++) {
					xticksArray[i] = 365 + (dateTemp.isLeapYear()?1:0)
					dateTemp.setTime(dateTemp.getTime()+xticksArray[i]*24*60*60*1000);
				}
			}
			xticks = mdiff/nticks;
			var hours = parseInt(xticks/60+0.5);
			if (hours > 0) xticks = hours*60;
		}

		if (data.timeformat!=='') timeformat = data.timeformat;

		data.getDefaultSize($(theObj));

		//include defs from svg_defs.svg for compatibility with fhem plots
		var defsFHEM =
			"<defs>"+
				'<linearGradient id="gr_bg" x1="0%" y1="0%" x2="0%" y2="100%">   <stop offset="0%"   style="stop-color:#FFFFF7; stop-opacity:1"/>    <stop offset="100%" style="stop-color:#FFFFC7; stop-opacity:1"/>  </linearGradient>'+
				'<linearGradient id="gr_0" x1="0%" y1="0%" x2="0%" y2="100%">    <stop offset="0%"   style="stop-color:#f00; stop-opacity:.6"/>    <stop offset="100%" style="stop-color:#f88; stop-opacity:.4"/>  </linearGradient>'+
				'<linearGradient id="gr_1" x1="0%" y1="0%" x2="0%" y2="100%">    <stop offset="0%"   style="stop-color:#291; stop-opacity:.6"/>    <stop offset="100%" style="stop-color:#8f7; stop-opacity:.4"/>  </linearGradient>'+
				'<linearGradient id="gr_2" x1="0%" y1="0%" x2="0%" y2="100%">    <stop offset="0%"   style="stop-color:#00f; stop-opacity:.6"/>    <stop offset="100%" style="stop-color:#88f; stop-opacity:.4"/>  </linearGradient>'+
				'<linearGradient id="gr_3" x1="0%" y1="0%" x2="0%" y2="100%">    <stop offset="0%"   style="stop-color:#f0f; stop-opacity:.6"/>    <stop offset="100%" style="stop-color:#f8f; stop-opacity:.4"/>  </linearGradient>'+
				'<linearGradient id="gr_4" x1="0%" y1="0%" x2="0%" y2="100%">    <stop offset="0%"   style="stop-color:#ff0; stop-opacity:.6"/>    <stop offset="100%" style="stop-color:#ff8; stop-opacity:.4"/>  </linearGradient>'+
				'<linearGradient id="gr_5" x1="0%" y1="0%" x2="0%" y2="100%">    <stop offset="0%"   style="stop-color:#0ff; stop-opacity:.6"/>    <stop offset="100%" style="stop-color:#8ff; stop-opacity:.4"/>  </linearGradient>'+
				'<linearGradient id="gr_6" x1="0%" y1="0%" x2="0%" y2="100%">    <stop offset="0%"   style="stop-color:#000; stop-opacity:.6"/>    <stop offset="100%" style="stop-color:#ccc; stop-opacity:.4"/>  </linearGradient>'+
				'<linearGradient id="gr_7" x1="0%" y1="0%" x2="0%" y2="100%">    <stop offset="0%"   style="stop-color:#000; stop-opacity:.6"/>    <stop offset="100%" style="stop-color:#ccc; stop-opacity:.4"/>  </linearGradient>'+
				'<linearGradient id="gr_8" x1="0%" y1="0%" x2="0%" y2="100%">    <stop offset="0%"   style="stop-color:#000; stop-opacity:.6"/>    <stop offset="100%" style="stop-color:#ccc; stop-opacity:.4"/>  </linearGradient>'+
				'<linearGradient id="gr_9" x1="0%" y1="0%" x2="0%" y2="100%">    <stop offset="0%"   style="stop-color:#000; stop-opacity:.6"/>    <stop offset="100%" style="stop-color:#ccc; stop-opacity:.4"/>  </linearGradient>'+
				'<pattern id="gr0_stripe" width="4" height="4"           patternUnits="userSpaceOnUse" patternTransform="rotate(-45 2 2)">      <path d="M -1,2 l 6,0" stroke="#f00" stroke-width="0.5"/>  </pattern>'+
				'<pattern id="gr1_stripe" width="4" height="4"           patternUnits="userSpaceOnUse" patternTransform="rotate(45 2 2)">      <path d="M -1,2 l 6,0" stroke="green" stroke-width="0.5"/>  </pattern>'+
				'<linearGradient id="gr0_gyr" x1="0%" y1="0%" x2="0%" y2="100%">    <stop offset=  "0%" style="stop-color:#f00; stop-opacity:.6"/>    <stop offset= "50%" style="stop-color:#ff0; stop-opacity:.6"/>    <stop offset="100%" style="stop-color:#0f0; stop-opacity:.6"/>  </linearGradient>'+
			'</defs>';

		// include some more defs
		var defs = 
			"<defs>"+
				'<linearGradient id="gr_bgftui" x1="0%" y1="0%" x2="0%" y2="100%">'+
					'<stop offset="0%"   style="stop-color:#2A2A2A; stop-opacity:1"/>'+
					'<stop offset="50%"  style="stop-color:#000; stop-opacity:1"/>'+
					'<stop offset="100%" style="stop-color:#2A2A2A; stop-opacity:1"/>'+
				'</linearGradient>'+
				'<linearGradient id="gr_ftui0" x1="0%" y1="0%" x2="0%" y2="100%">'+
					'<stop offset="0%"  style="stop-color:#553300; stop-opacity:1"/>'+
					'<stop offset="100%"   style="stop-color:#DDA400; stop-opacity:1"/>'+
				'</linearGradient>'+
				'<linearGradient id="gr_ftui1" x1="0%" y1="0%" x2="0%" y2="100%">'+
					'<stop offset="0%"  style="stop-color:#333333; stop-opacity:1"/>'+
					'<stop offset="100%"   style="stop-color:#BBBBBB; stop-opacity:1"/>'+
				'</linearGradient>'+
				'<linearGradient id="gr_ftui2" x1="0%" y1="0%" x2="0%" y2="100%">'+
					'<stop offset="0%"  style="stop-color:#880000; stop-opacity:1"/>'+
					'<stop offset="100%"   style="stop-color:#FF0000; stop-opacity:1"/>'+
				'</linearGradient>'+
				'<linearGradient id="gr_ftui3" x1="0%" y1="0%" x2="0%" y2="100%">'+
					'<stop offset="0%"  style="stop-color:#555500; stop-opacity:1"/>'+
					'<stop offset="100%"   style="stop-color:#CCCC00; stop-opacity:1"/>'+
				'</linearGradient>'+
				'<linearGradient id="gr_ftui4" x1="0%" y1="0%" x2="0%" y2="100%">'+
					'<stop offset="0%"  style="stop-color:#225522; stop-opacity:1"/>'+
					'<stop offset="100%"   style="stop-color:#33CC33; stop-opacity:1"/>'+
				'</linearGradient>'+
				'<linearGradient id="gr_ftui5" x1="0%" y1="0%" x2="0%" y2="100%">'+
					'<stop offset="0%"  style="stop-color:#225555; stop-opacity:1"/>'+
					'<stop offset="100%"   style="stop-color:#33CCCC; stop-opacity:1"/>'+
				'</linearGradient>'+
				'<linearGradient id="gr_ftui6" x1="0%" y1="0%" x2="0%" y2="100%">'+
					'<stop offset="0%"  style="stop-color:#222255; stop-opacity:1"/>'+
					'<stop offset="100%"   style="stop-color:#3333CC; stop-opacity:1"/>'+
				'</linearGradient>'+
				'<linearGradient id="gr_ftui7" x1="0%" y1="0%" x2="0%" y2="100%">'+
					'<stop offset="0%"  style="stop-color:#222255; stop-opacity:1"/>'+
					'<stop offset="100%"   style="stop-color:#328da8; stop-opacity:1"/>'+
				'</linearGradient>'+
				'<linearGradient id="gr_ftui8" x1="0%" y1="0%" x2="0%" y2="100%">'+
					'<stop offset="0%"  style="stop-color:#d0a462; stop-opacity:1"/>'+
					'<stop offset="100%"   style="stop-color:#896329; stop-opacity:1"/>'+
				'</linearGradient>'+
				'<linearGradient id="gr_ftui9" x1="0%" y1="0%" x2="0%" y2="100%">'+
					'<stop offset="0%"  style="stop-color:#9fdf9f; stop-opacity:1"/>'+
					'<stop offset="100%"   style="stop-color:#8ba832; stop-opacity:1"/>'+
				'</linearGradient>'+
				'<filter id="glow">'+
					'<fegaussianblur class="blur" result="coloredBlur" stddeviation="4"></fegaussianblur>'+
					'<femerge>'+
					'	<femergenode in="coloredBlur"></femergenode>'+
						'<femergenode in="coloredBlur"></femergenode>'+
						'<femergenode in="coloredBlur"></femergenode>'+
						'<femergenode in="SourceGraphic"></femergenode>'+
					'</femerge>'+
				'</filter>'+
				'<filter id="neon" filterUnits="userSpaceOnUse" x="0" y="0">'+
				  '<desc>Produces a 3D lighting effect.</desc>'+
				  '<feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur"/>'+
				  '<feOffset in="blur" dx="4" dy="4" result="offsetBlur"/>'+
				  '<feSpecularLighting in="blur" surfaceScale="5" specularConstant="1.25" '+
						'specularExponent="20" lighting-color="#bbbbbb" '+
						'result="specOut">'+
				  '<fePointLight x="-5000" y="-10000" z="20000"/>'+
				  '</feSpecularLighting>'+
				  '<feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut"/>'+
				  '<feComposite in="SourceGraphic" in2="specOut" operator="arithmetic"'+
						'k1="0" k2="1" k3="1" k4="0" result="litPaint"/>'+
				  '<feMerge>'+
				  '<feMergeNode in="offsetBlur"/>'+
					'<feMergeNode in="litPaint"/>'+
				  '</feMerge>'+
				'</filter>'+
				'<filter id="drop-shadow-strong">'+
					'<feGaussianBlur in="SourceAlpha" stdDeviation="2.2"/>'+
					'<feOffset dx="5" dy="5" result="offsetblur"/>'+
					'<feFlood flood-color="rgba(51,51,51,0.9)"/>'+
					'<feComposite in2="offsetblur" operator="in"/>'+
					'<feMerge>'+
						'<feMergeNode/>'+
						'<feMergeNode in="SourceGraphic"/>'+
					'</feMerge>'+
				'</filter>'+
				'<filter id="drop-shadow">'+
					'<feGaussianBlur in="SourceAlpha" stdDeviation="2.2"/>'+
					'<feOffset dx="3" dy="3" result="offsetblur"/>'+
					'<feFlood flood-color="rgba(51,51,51,0.8)"/>'+
					'<feComposite in2="offsetblur" operator="in"/>'+
					'<feMerge>'+
						'<feMergeNode/>'+
						'<feMergeNode in="SourceGraphic"/>'+
					'</feMerge>'+
				'</filter>'+
				'<filter x="0" y="0" width="1" height="1" id="filterbackground">'+
					'<feFlood flood-color="black" flood-opacity="0.5" result="bBlack"/>'+
					'<feMerge>'+
						'<feMergeNode in="bBlack"/>'+
						'<feMergeNode in="SourceGraphic"/>'+
					'</feMerge>'+
				'</filter>'+
				'<filter x="0" y="0" width="1" height="1" id="nowhite">'+
					'<feColorMatrix " result="res" in="SourceGraphic" type="matrix" values="'+
							'1 0 0 0 0 '+
							'0 1 0 0 0 '+
							'0 0 1 0 0 '+
							'-0.33 -0.33 -0.33 1 0"'+
						'>'+
					'</feColorMatrix>'+
					'<feComponentTransfer>'+
					'	<feFuncA type="table" tableValues="0 1 1 0"></feFuncA>'+
					'</feComponentTransfer>'+
				'</filter>'+
				'<filter x="0" y="0" width="1" height="1" id="marked">'+
					'<feFlood flood-color="yellow"/>'+
					'<feComposite in="SourceGraphic"/>'+
				'</filter>'+
			'</defs>';

		var clip = {};
		clip.left = data.getGraphLeft();
		var zBack = (data.DDD.Setting[0] && data.DDD.Setting[0]<0)?data.DDD.BackplaneZ(data.DDD,data.nGraphs):0;
		var zFore = (data.DDD.Setting[0] && data.DDD.Setting[0]<0)?0:data.DDD.BackplaneZ(data.DDD,data.nGraphs);
		clip.right = noticks?data.leftOffset+data.graphArea.width:data.leftOffset+(data.unusedYAxesVisible?data.textWidth_prim.sum():data.textWidth_prim.max())+data.graphArea.width/data.DDD.scaleX;
		var p1 = widget_chart.getTransformedPoint(data,theObj,{x:0,y:data.graphHeight/100*data.baseheight,z:zBack});
		var p2 = widget_chart.getTransformedPoint(data,theObj,{x:data.graphWidth/100*data.basewidth,y:data.graphHeight/100*data.baseheight,z:zBack});
		clip.bottom = (Math.max(p1.y,p2.y)-data.DDD.shiftY)/data.DDD.scaleY;
		p1 = widget_chart.getTransformedPoint(data,theObj,{x:0,y:0,z:zFore});
		p2 = widget_chart.getTransformedPoint(data,theObj,{x:data.graphWidth/100*data.basewidth,y:0,z:zFore});
		clip.top = (Math.min(p1.y,p2.y)-data.DDD.shiftY)/data.DDD.scaleY;
		// prepare skeleton of SVG part of page
		if (!$(document).find('body').children('svg.basicdefs').children('defs').length) $(document).find('body').prepend($('<svg class="basicdefs" style="position: absolute; height: 0px"> ' + defsFHEM + defs + '</svg>'));
		var svg_new = $(
			'<svg class="basesvg'+instance+'" style="overflow: visible">' + (data.title?data.title_object:'') +
			'<g id="classesContainer" stroke="grey"></g>' +
			'<g id="baseforDDD" style="overflow: inherit; z-index: 200; '+data.DDD.prefix+'transform: '+data.DDD.String.Scale+'">' + 
			'<defs><clipPath id="clipingRect'+instance+'">'+widget_chart.getClipPath(data,0,theObj,0)+widget_chart.getClipPath(data,0,theObj,0)+'</clipPath></defs>'+
			'<defs><clipPath id="clipingRectXAxis'+instance+'">'+widget_chart.getClipPath(data,0,theObj,3)+widget_chart.getClipPath(data,0,theObj,3)+'</clipPath></defs>'+
			'<defs><clipPath id="clipingRectGraphs'+instance+'">'+widget_chart.getClipPath(data,0,theObj,1)+widget_chart.getClipPath(data,0,theObj,1)+'</clipPath></defs>'+
			'<defs><clipPath id="clipingRectCursor'+instance+'">'+widget_chart.getClipPath(data,0,theObj,2)+widget_chart.getClipPath(data,0,theObj,2)+'</clipPath></defs>'+
			'<rect class="chart-background" x="'+data.xStr+'" width="'+data.yStr+'" preserveAspectRatio="none" '+'style="'+data.DDD.String.Rot+'; '+data.DDD.String.Trans(data.DDD.Width(data.nGraphs-1),data.nGraphs,data.DDD,data.xStrTO,data.yStrTO)+'"></rect>'+
			'<g class="chart-gridlines" x="'+data.xStr+'" width="'+data.yStr+'" preserveAspectRatio="none" '+'style="'+data.DDD.String.Rot+'; '+data.DDD.String.Trans(data.DDD.Width(data.nGraphs-1),data.nGraphs,data.DDD,data.xStrTO,data.yStrTO)+'">'+
			'</g>'+
			'<g class="chart-left-gridlines" x="0px" y="0px" width="'+data.yStr+'" preserveAspectRatio="none" '+'style="overflow:inherit; '+data.DDD.prefix+'transform:scale('+1/data.DDD.scaleX+','+1/data.DDD.scaleY+') translate('+(-data.DDD.shiftX)+'px,'+(-data.DDD.shiftY)+'px)">'+
			'</g>'+
			'<g class="chart-bottom-gridlines" x="0px" y="0px" width="'+data.yStr+'" preserveAspectRatio="none" '+'style="overflow:inherit; '+data.DDD.prefix+'transform:scale('+1/data.DDD.scaleX+','+1/data.DDD.scaleY+') translate('+(-data.DDD.shiftX)+'px,'+(-data.DDD.shiftY)+'px)">'+
			'</g>'+
			'<svg class="chart-primsec" style="'+data.DDD.prefix.replace(/-moz-/g,'')+'clip-path: url(#clipingRect'+(data.DDD.prefix=='-moz-'?'Graphs':'Graphs')+instance+'); overflow: visible;">' +
			'<g class="chart-parent" x="'+data.xStr+'" width="'+data.yStr+'" preserveAspectRatio="none" style="">'+
			'<g class="graph-parent" style="transform: translate(0,0) scale(1,1);">'+
			'<polyline points=""/>'+
			'<path d=""/>'+
			'</g></g></g>'+
			//'<svg class="chart-secondary">'+
			//'<svg class="chart-parent viewbox" x="'+data.xStr+'" width="'+data.yStr+'" preserveAspectRatio="none">'+
			//'<g class="graph-parent scaleyinvert">'+
			//'<polyline points=""/>'+
			//'<path d=""/>'+
			//'</g></svg></svg>'+
			'</svg>'+
			'</svg>');

		data.xrangeW = data.transD2W([data.xrange,0],uaxis)[1];

		// hack for wrong behaviour of Firefox
		var attrval = {};
		var stV = widget_chart.getStyleRuleValue(classesContainer, 'fill', ".chart-background");
		if (stV) {if(stV.indexOf("url") >= 0) {attrval.style = svg_new.find("rect.chart-background").attr('style') + ';fill: ' +  stV.slice(0,4)+stV.slice(-(stV.length-stV.lastIndexOf("#"))).replace(/\"/g,'');}}
		svg_new.find("rect.chart-background").attr(attrval);

		// test for functions on touch devices, currently not running yet
		/*svg_new.find("rect.chart-background, [id*='graph-']").on("click", function(event) {
		});
		svg_new.find("rect.chart-background, [id*='graph-']").on("swipeleft", function(event) {
			//$(event.delegateTarget).find("text.debug").text('Type: '+event.type+' X: '+event.pageX+' Y: '+event.pageY);
			widget_chart.shift(event, $(event.delegateTarget),1); 
		});
		svg_new.find("rect.chart-background, [id*='graph-']").on("swiperight", function(event) {
			//$(event.delegateTarget).find("text.debug").text('Type: '+event.type+' X: '+event.pageX+' Y: '+event.pageY);
			widget_chart.shift(event, $(event.delegateTarget),-1); 
		});*/
		
		var legend_container = widget_chart.drawLegend(data,theObj,style_array,fszC,classesContainer);

		// add container for graphs
		//$(theObj).find("g.graph-parent").append(widget_chart.createElem('svg').attr({'class':'graph-frame','width':data.xrange,'height':(max-min),'y':min}));

		var legend_menu = widget_chart.createElem('svg').attr({
			'class':'legend',
			'x':'0px',
			'width':(data.basewidth)+'px',
			'height':(data.baseheight)+'px',
			'y':'0px'
		});

		// text element for show/hide of legend container
		var caption_text;
		if (!nobuttons) {
			caption_text = widget_chart.createElem('text').attr({'class':'caption legendbutton'+(data.showlegend?' active':' inactive'),'x':(noticks)?(data.timeranges!=''?7.7*fszB:6.2*fszB):(data.timeranges!=''?7.7*fszB:6.2*fszB)+'px','y':nobuttons?fszC/2+fszT+data.margin:Math.max(fszC,fszB)/2+fszT+data.margin,'dy':'0.4em','style':'text-anchor:end'});
			caption_text.text("Legend");
			legend_menu.append(caption_text);
		}

		if (data.DDD.Active) svg_new.find('rect.chart-background').after(legend_container); else svg_new.find('svg.chart-primsec').after(legend_container); // put legend in foreground if no 3D is activated.
		if (!data.showlegend) legend_container.hide();

		if (!nobuttons) {
			// event handling for legend container (show/hide graphs)
			caption_text.click(function(event) {
				var target = $(event.delegateTarget).parents("[class^=basesvg]").find('g.lentries');
				var classesContainer = $(event.delegateTarget).parents("[class^=basesvg]").find('#classesContainer');
				var data = $(event.delegateTarget).parents("[class^=basesvg]").parent().data();
				
				if(data.showlegend) {
					$(target).hide();
					data.showlegend = false;
					$(event.delegateTarget).attr({'class':'caption inactive'});
					if ((data.legendpos && data.legendpos[0].search(/(before|behind)/)>-1) || (data.legendpos && data.legendpos[1].search(/(below|above)/)>-1)) {
						widget_chart.refresh($(event.delegateTarget).parents("[class^=basesvg]").parent(),'rotate');
					}
				} else {
					$(target).show();
					widget_chart.configureLegend(data,$(event.delegateTarget).parents("[class^=basesvg]").parent(),fszC,classesContainer,target);
					$(event.delegateTarget).attr({'class':'caption active'});
					data.showlegend = true;
					if ((data.legendpos && data.legendpos[0].search(/(before|behind)/)>-1) || (data.legendpos && data.legendpos[1].search(/(below|above)/)>-1)) {
						widget_chart.refresh($(event.delegateTarget).parents("[class^=basesvg]").parent(),'rotate');
					}
				}
			});
		}

		svg_new.find('[id="baseforDDD"]').before(legend_menu);
		data.min_save = [];
		data.max_save = [];
		data.min_save_sec = [];
		data.max_save_sec = [];
		aiDone = {primary: [], secondary: []};
		var xaxisDone = false;
		var buttonsDone = false;
 		
		for (var k=data.nGraphs-1; k>=0; k--) { // main loop for generation of page content (chart with graphs)
			uaxis = widget_chart.getArrayValue(uaxis_array,k,'primary');
			AI = data.getAxisIndex(uaxis);
			// treat margin top and bottom if given
			if (data.isPrimary(uaxis) && !aiDone['primary'][AI]) {
				var unitsperpix = (data.yLimits[AI].primary.max-data.yLimits[AI].primary.min)/data.graphArea.height;
				if (data.getAxisSetting('minvalue',uaxis)=="auto") data.yLimits[AI].primary.min -= y_margin[0]*unitsperpix;
				if (data.getAxisSetting('maxvalue',uaxis)=="auto") data.yLimits[AI].primary.max += y_margin[1]*unitsperpix;
			} else if (!aiDone['secondary'][AI]) {
				var unitsperpix = (data.yLimits[AI].secondary.max-data.yLimits[AI].secondary.min)/data.graphArea.height;
				if (data.getAxisSetting('minvalue',uaxis)=="auto") data.yLimits[AI].secondary.min -= y_margin_sec[0]*unitsperpix;
				if (data.getAxisSetting('maxvalue',uaxis)=="auto") data.yLimits[AI].secondary.max += y_margin_sec[1]*unitsperpix;
			}

			// do scaling of y axis due to problems with strokes in vertical and horizontal direction if scaling is very different between x and y
			// nonscaling-stroke does not work on all browsers
			data.yLimits[AI].primary.diffY = data.yLimits[AI].primary.max-data.yLimits[AI].primary.min;
			data.yLimits[AI].primary.scaleY = data.xrange/(data.yLimits[AI].primary.max-data.yLimits[AI].primary.min)/data.graphArea.width*data.graphArea.height;
			data.yLimits[AI].primary.shiftY = data.yLimits[AI].primary.min*data.yLimits[AI].primary.scaleY;
			// do scaling of y axis due to problems with strokes in vertical and horizontal direction if scaling is very different between x and y
			// nonscaling-stroke does not work on all browsers
			data.yLimits[AI].secondary.diffY = data.yLimits[AI].secondary.max-data.yLimits[AI].secondary.min;
			data.yLimits[AI].secondary.scaleY = data.xrange/(data.yLimits[AI].secondary.max-data.yLimits[AI].secondary.min)/data.graphArea.width*data.graphArea.height;
			data.yLimits[AI].secondary.shiftY = data.yLimits[AI].secondary.min*data.yLimits[AI].secondary.scaleY;

			if (data.isPrimary(uaxis)) {
				data.min_save[AI] = 0;
				data.max_save[AI] = (data.yLimits[AI].primary.max-data.yLimits[AI].primary.min)*data.yLimits[AI].primary.scaleY;
			} else {
				data.min_save_sec[AI] = 0;
				data.max_save_sec[AI] = (data.yLimits[AI].secondary.max-data.yLimits[AI].secondary.min)*data.yLimits[AI].secondary.scaleY;
			}
			// scale data points in y direction to have them lying in about same range as x (due to stroke problems)
			widget_chart.scaleValues(pointsarray, k, data);

			var tstart = ftui.dateFromString(data.mindate);
			style = widget_chart.getDynamicStyle(widget_chart.getArrayValue(style_array,k,''));
			ptype = widget_chart.getArrayValue(ptype_array,k,'lines');
			legend = widget_chart.getArrayValue(legend_array,k,'Graph '+k);

			min = data.getAxisSetting('min_save',uaxis);
			max = data.getAxisSetting('max_save',uaxis);

			// calculate yticks
			var ymin_t, yt, ytary;
			if (data.isPrimary(uaxis)) {
				ytary = data.yLimits[AI].primary.yticks;
				if (data.yLimits[AI].primary.yticks?data.yLimits[AI].primary.yticks=="auto":true) { // check if autoscaling is set
					yt = widget_chart.getYTicksBase(data.isLogAxis(uaxis)?Math.pow_t(10,data.yLimits[AI].primary.min):data.yLimits[AI].primary.min,data.isLogAxis(uaxis)?Math.pow_t(10,data.yLimits[AI].primary.max):data.yLimits[AI].primary.max);
					ymin_t = (parseInt(data.isLogAxis(uaxis)?Math.pow_t(10,data.yLimits[AI].primary.min)/yt:data.yLimits[AI].primary.min/yt))*yt;
					if (ymin_t < (data.isLogAxis(uaxis)?Math.pow_t(10,data.yLimits[AI].primary.min):data.yLimits[AI].primary.min)) ymin_t+=yt;
					yticks = yt;
				} else {
					if ($.isArray(data.yLimits[AI].primary.yticks)) { // values are explicitely given
						ymin_t = $.isArray(data.yLimits[AI].primary.yticks[0])?data.yLimits[AI].primary.yticks[0][0]:data.yLimits[AI].primary.yticks[0];
						yticks = data.yLimits[AI].primary.yticks[1]?(($.isArray(data.yLimits[AI].primary.yticks[1])?data.yLimits[AI].primary.yticks[1][0]:data.yLimits[AI].primary.yticks[1]) - ymin_t):ymin_t;
					} else {
						yticks = data.yLimits[AI].primary.yticks;
						ymin_t = data.isLogAxis(uaxis)?Math.pow_t(10,data.yLimits[AI].primary.min):data.yLimits[AI].primary.min;
					}
					ymin_t += y_margin[0]*unitsperpix;
				}
				if (data.isLogAxis(uaxis)) {
					ytary = [];
					if ($.isArray(data.yLimits[AI].primary.yticks)) {
						$.each(data.yLimits[AI].primary.yticks, function(ind,val) {
							if ($.isArray(val)) {
								ytary[ind] = [];
								ytary[ind][0]=Math.log10_t(val[0]);
								ytary[ind][1]=val[1];
							} else {
								ytary[ind] = [];
								ytary[ind][0]=Math.log10_t(val);
								ytary[ind][1]=val;
							}
						});
					} else {
						i = 0;
						for (y=ymin_t; y<Math.pow_t(10,(max+data.yLimits[AI].primary.shiftY)/data.yLimits[AI].primary.scaleY); y+=yticks) {
							ytary[i] = [];
							ytary[i][1] = y.toFixed(Math.abs(y)<10?1:0); // avoid small differences when doing pow(log)
							ytary[i][0] = Math.log10_t(parseFloat(ytary[i][1]));
							i++;
						}
					}
					ymin_t = Math.log10_t(ymin_t);
					yticks = Math.log10_t(yticks);
				}
				ymin_t = ymin_t * data.yLimits[AI].primary.scaleY - data.yLimits[AI].primary.shiftY;
				yticks = yticks*data.yLimits[AI].primary.scaleY;
			} else {
				ytary = data.yLimits[AI].secondary.yticks;
				if (data.yLimits[AI].secondary.yticks?data.yLimits[AI].secondary.yticks=="auto":true) { // check if autoscaling is set
					yt = widget_chart.getYTicksBase(data.isLogAxis(uaxis)?Math.pow_t(10,data.yLimits[AI].secondary.min):data.yLimits[AI].secondary.min,data.isLogAxis(uaxis)?Math.pow_t(10,data.yLimits[AI].secondary.max):data.yLimits[AI].secondary.max);
					ymin_t = (parseInt(data.isLogAxis(uaxis)?Math.pow_t(10,data.yLimits[AI].secondary.min)/yt:data.yLimits[AI].secondary.min/yt))*yt;
					if (ymin_t < (data.isLogAxis(uaxis)?Math.pow_t(10,data.yLimits[AI].secondary.min):data.yLimits[AI].secondary.min)) ymin_t+=yt;
					yticks = yt;
				} else {
					if ($.isArray(data.yLimits[AI].secondary.yticks)) { // values are explicitely given
						ymin_t = ($.isArray(data.yLimits[AI].secondary.yticks[0])?data.yLimits[AI].secondary.yticks[0][0]:data.yLimits[AI].secondary.yticks[0]);
						yticks = data.yLimits[AI].secondary.yticks[1]?(($.isArray(data.yLimits[AI].secondary.yticks[1])?data.yLimits[AI].secondary.yticks[1][0]:data.yLimits[AI].secondary.yticks[1]) - ymin_t):ymin_t;
					} else {
						yticks = data.yLimits[AI].secondary.yticks;
						ymin_t = data.isLogAxis(uaxis)?Math.pow_t(10,data.yLimits[AI].secondary.min):data.yLimits[AI].secondary.min;
					}
					ymin_t += y_margin_sec[0]*unitsperpix;
				}
				if (data.isLogAxis(uaxis)) {
					ytary = [];
					if ($.isArray(data.yLimits[AI].secondary.yticks)) {
						$.each(data.yLimits[AI].secondary.yticks, function(ind,val) {
							if ($.isArray(val)) {
								ytary[ind] = [];
								ytary[ind][0]=Math.log10_t(val[0]);
								ytary[ind][1]=val[1];
							} else {
								ytary[ind] = [];
								ytary[ind][0]=Math.log10_t(val);
								ytary[ind][1]=val;
							}
						});
					} else {
						i = 0;
						for (y=ymin_t; y<Math.pow_t(10,(max+data.yLimits[AI].secondary.shiftY)/data.yLimits[AI].secondary.scaleY); y+=yticks) {
							ytary[i] = [];
							ytary[i][1] = y.toFixed(Math.abs(y)<10?1:0); // avoid small differences when doing pow(log)
							ytary[i][0] = Math.log10_t(parseFloat(ytary[i][1]));
							i++;
						}
					}
					ymin_t = Math.log10_t(ymin_t);
					yticks = Math.log10_t(yticks);
				}
				ymin_t = ymin_t * data.yLimits[AI].secondary.scaleY - data.yLimits[AI].secondary.shiftY;
				yticks = yticks*data.yLimits[AI].secondary.scaleY;
			}

			// Calculated Stroke Width for gridlines
			var strkY = widget_chart.scaleStroke(classesContainer, '.yticks', 1);
			var strkX = widget_chart.scaleStroke(classesContainer, '.xticks', 1);

			// Calculated Stroke Width for graphs
			var strkG = widget_chart.scaleStroke(classesContainer, '.'+style, 1);

			points=pointsarray[k];

			//Setting the general attributes for different plot types
			var fontFamily, fontWeight, symbol;
			if (ptype.search('icons:')>=0) {
				ptype = 'icons';	
			} else if (ptype.search(':')>=0) {
				ptype = ptype.split(':')[0];
			}

			if (ptype.indexOf('fa-')>=0 || ptype.indexOf('fs-')>=0 || ptype.indexOf('oa-')>=0) {
				//there seem to be font awesome symbols defined
				symbol = widget_chart.fontNameToUnicode(ptype.substring(0,Math.max(0,ptype.indexOf('_proxy')>0?ptype.indexOf('_proxy'):ptype.length)));
				fontFamily = (ptype.indexOf('fa-')>=0)?(ftui.version>'2.7.1'?'"Font Awesome 5 Free"':'FontAwesome'):(ptype.indexOf('fs-')>=0)?'fhemSVG':'openautomation';
				fontWeight = (ptype.indexOf('fa-')>=0)?(ftui.version>'2.7.1'?'900':''):'';
				ptype = 'symbol';
			}

			var attrval2;
			var ptc = ptype.substring(0,Math.max(0,ptype.indexOf('_proxy')>0?ptype.indexOf('_proxy'):ptype.length)).split('-');
			var subtype = (ptc.length && ptc.length > 1)?ptc[1]:'';
			var type = ptc[0];
			switch (type) {
				case 'lines':
				case 'steps':
				case 'fsteps':
				case 'histeps':
				case 'bars':
				case 'ibars':
				case 'cubic':
				case 'quadratic':
				case 'quadraticSmooth':
					attrval={'fill-rule':'evenodd'};
					attrval.class = style;
					attrval.style = 'stroke-width: ' + strkG.stroke + 'px';
					if (strkG.dash && strkG.dash!='none') {attrval.style = attrval.style + '; stroke-dasharray:' + strkG.dash;}
					// hack for behaviour of Firefox
					styleV = widget_chart.getStyleRuleValue(classesContainer, 'fill', '.'+style);
					attrval.d = widget_chart.getSVGPoints(points, data, min, data.xrange, ptype, (styleV!='none')&&(!nofilldown[k]),uaxis);
					if (styleV) {if(styleV.indexOf("url") >= 0) {attrval.style = attrval.style + '; fill: ' + styleV.slice(0,4)+styleV.slice(-(styleV.length-styleV.lastIndexOf("#"))).replace(/\"/g,'');}}
					if (ptype.indexOf('_proxy')>0) {	// needed for text display in case of logproxy polar
						attrval2={};
						styleV = widget_chart.getStyleRuleValue(classesContainer, 'stroke', '.'+style.replace(/(sym|dash|dot|fill|)/g,'')+'sym'); // we use the sym variant of the style
						if (!styleV) {styleV = widget_chart.getStyleRuleValue(classesContainer, 'fill', '.'+style.replace(/(sym|dash|dot|fill|)/g,'')+'sym');}
						attrval2.style = 'stroke-width: ' + 0 + 'px' + ';fill: ' + styleV;
						attrval2.min = min;
					}
					break;
				case 'points':
					attrval={};
					styleV = widget_chart.getStyleRuleValue(classesContainer, 'stroke', '.'+style);
					if (!styleV) {styleV = widget_chart.getStyleRuleValue(classesContainer, 'fill', '.'+style);}
					attrval.style = 'stroke-width: ' + 0 + 'px' + ';fill: ' + styleV;
					attrval.min = min;
					if (ptype.indexOf('_proxy')>0) {	// needed for text display in case of logproxy polar
						attrval2={};
						styleV = widget_chart.getStyleRuleValue(classesContainer, 'stroke', '.'+style);
						if (!styleV) {styleV = widget_chart.getStyleRuleValue(classesContainer, 'fill', '.'+style);}
						attrval2.style = 'stroke-width: ' + 0 + 'px' + ';fill: ' + styleV;
						attrval2.min = min;
					}
					break;
				case 'symbol':
				case 'icons':
					attrval={};
					styleV = widget_chart.getStyleRuleValue(classesContainer, 'stroke', '.'+style);
					if (!styleV) {styleV = widget_chart.getStyleRuleValue(classesContainer, 'fill', '.'+style);}
					attrval.style = 'stroke-width: ' + 0 + 'px' + ';fill: ' + styleV;
					attrval.min = min;
					break;
			}
			
			var svg = svg_new.find('svg.chart-primsec');
			var svg_chart = svg.find('g.chart-parent').first().clone(false);
			svg_chart.attr('AI',AI);
			svg.find('g.chart-parent').parent().append(svg_chart);
			var xaxis2;
			var svgbase;
			var tyaxis;
			var tyaxis_prim = [];
			var tyaxis_sec = [];
			var stringTransition = browserCaps.prefix+"transition:ease; "+browserCaps.prefix+"transition-duration:0.5s; ";
			
			if (svg){
				var polyline = svg_chart.find('path');
				if (polyline){
					var graphTop;
					
					if (!aiDone[data.flatUaxis(uaxis)][AI]) {
						svg.find('line').remove();
						var gridlines, gridlines_left, gridlines_bottom, buttons, tyaxis_prim, tyaxis_sec, txaxis, cxaxis, cgridlines, taxes;
						
						if (!gridlines) {gridlines = widget_chart.createElem('g').attr({'class':'gridlines','stroke':widget_chart.getStyleRuleValue(classesContainer, 'color', '')});}
						if (!gridlines_left) {gridlines_left = widget_chart.createElem('g').attr({'class':'gridlines','stroke':widget_chart.getStyleRuleValue(classesContainer, 'color', '')});}
						if (!gridlines_bottom) {gridlines_bottom = widget_chart.createElem('g').attr({'class':'gridlines','stroke':widget_chart.getStyleRuleValue(classesContainer, 'color', '')});}
						if (!buttons) {buttons = widget_chart.createElem('g').attr({'class':'buttons'});}
						if (!tyaxis_prim[AI] && data.isPrimary(uaxis)) {tyaxis_prim[AI] = widget_chart.createElem('g').attr({'class':'text yaxis_primary'+'-'+AI,'style':stringTransition+data.DDD.String.Rot+' translateX(-'+(data.unusedYAxesVisible?data.textWidth_prim.sum(0,AI-1):0)+'px); '+'opacity: '+(data.unusedYAxesVisible?'1':(AI==0?'1':'0'))+'; '+data.DDD.String.Trans(0,0,data.DDD,data.xStrTO,data.yStrTO)});}
						if (!tyaxis_sec[AI] && !data.isPrimary(uaxis)) {tyaxis_sec[AI] = widget_chart.createElem('g').attr({'class':'text yaxis_secondary'+'-'+AI,'style':stringTransition+data.DDD.String.Rot+' translateX('+(data.unusedYAxesVisible?data.textWidth_sec.sum(0,AI-1):0)+'px); '+'opacity: '+(data.unusedYAxesVisible?'1':(AI==0?'1':'0'))+'; '+data.DDD.String.Trans(data.DDD.Width(data.nGraphs-1),data.nGraphs,data.DDD,data.xStrTO,data.yStrTO)});}
						if (!txaxis) {txaxis = widget_chart.createElem('g').attr({'class':'text xaxis','style':data.DDD.String.Rot+'; '+data.DDD.String.Trans(0,0,data.DDD,data.xStrTO,data.yStrTO)});}
						if (!cxaxis) {cxaxis = widget_chart.createElem('g').attr({'style':data.DDD.prefix.replace(/-moz-/g,'')+'clip-path: url(#clipingRectXAxis'+data.instance+');'});}
						if (!cgridlines) {cgridlines = widget_chart.createElem('g').attr({'style':data.DDD.prefix.replace(/-moz-/g,'')+'clip-path: url(#clipingRect'+data.instance+');'});}
						if (!taxes) {taxes = widget_chart.createElem('g').attr({'class':'text axes'});}
						
						tyaxis = (data.isPrimary(uaxis))?tyaxis_prim[AI]:tyaxis_sec[AI];
						taxes.append(tyaxis);
						taxes.append(cxaxis);
						cxaxis.append(txaxis);
						gridlines.append(cgridlines);

						if (ptype.indexOf('_proxy')<0) {	// only draw normal gridlines if not _proxy type
							//y-axis
							var ymn = data.topOffset;
							var ymx = data.topOffset + data.graphHeight/100*data.baseheight;
							var xmn = data.getGraphLeft();
							var xmx = data.getGraphLeft()+data.graphWidth/100*data.basewidth;

							var stk = widget_chart.scaleStroke(classesContainer, '.yaxis', (ymx-ymn) / (data.baseheight * data.graphHeight/100));
							var yaxis = widget_chart.createElem('line');
							yaxis.attr({
								'class':'yaxis '+ data.flatUaxis(uaxis)+ '-' + AI,
								'x1':data.isPrimary(uaxis)?xmn+stk.stroke+'px':xmx-stk.stroke+'px',
								'y1':ymn+'px',
								'x2':data.isPrimary(uaxis)?xmn+stk.stroke+'px':xmx-stk.stroke+'px',
								'y2':ymx+'px',
								'style':'stroke-width:'+stk.stroke+'px'+'; stroke-dasharray:'+stk.dash,
							});
							gridlines.prepend(yaxis);

							var yaxis2 = widget_chart.createElem('line');
							var xx = data.isPrimary(uaxis)?0:data.xrange;
							p1 = widget_chart.getTransformedPoint(data,theObj,{x:xx,y:0,z:0});
							p2 = widget_chart.getTransformedPoint(data,theObj,{x:xx,y:data.graphHeight/100*data.baseheight,z:0});
							yaxis2.attr({
								'class':'yaxis '+ data.flatUaxis(uaxis)+ '-' + AI,
								'x1':p1.x+'px',
								'y1':p1.y+'px',
								'x2':p2.x+'px',
								'y2':p2.y+'px',
								'style':'stroke-width:'+stk.stroke+'px'+'; stroke-dasharray:'+stk.dash,
							});
							gridlines_left.prepend(yaxis2);

							if (!xaxisDone) { // draw xaxis only once
								//x-axis
								stk = widget_chart.scaleStroke(classesContainer, '.xaxis', (xmx-xmn) / (data.basewidth * data.graphWidth/100));
								var xaxis = widget_chart.createElem('line');
								xaxis.attr({
									'class':'xaxis',
									'x1':xmn+'px',
									'y1':ymx+stk.stroke+'px',
									'x2':xmx+'px',
									'y2':ymx+stk.stroke+'px',
									'style':'stroke-width:'+stk.stroke+'px'+'; stroke-dasharray:'+stk.dash,
								});
								gridlines.prepend(xaxis);

								xaxis2 = widget_chart.createElem('line');
								p1 = widget_chart.getTransformedPoint(data,theObj,{x:0,y:data.transD2W([0,0],uaxis)[1]-data.topOffset,z:0});
								p2 = widget_chart.getTransformedPoint(data,theObj,{x:0,y:data.transD2W([0,0],uaxis)[1]-data.topOffset,z:data.DDD.BackplaneZ(data.DDD,data.nGraphs)});
								xaxis2.attr({
									'class':'xaxis',
									'x1':p1.x+'px',
									'y1':p1.y+'px',
									'x2':p2.x+'px',
									'y2':p2.y+'px',
									'style':'stroke-width:'+stk.stroke+'px'+'; stroke-dasharray:'+stk.dash,
								});
								gridlines_left.prepend(xaxis2);

								xaxis2 = widget_chart.createElem('line');
								p1 = widget_chart.getTransformedPoint(data,theObj,{x:0,y:data.graphHeight/100*data.baseheight,z:0});
								p2 = widget_chart.getTransformedPoint(data,theObj,{x:data.graphWidth/100*data.basewidth,y:data.graphHeight/100*data.baseheight,z:0});
								xaxis2.attr({
									'class':'xaxis',
									'x1':p1.x+'px',
									'y1':p1.y+'px',
									'x2':p2.x+'px',
									'y2':p2.y+'px',
									'style':'stroke-width:'+stk.stroke+'px'+'; stroke-dasharray:'+stk.dash,
								});
								gridlines_bottom.prepend(xaxis2);
							}
						}

						if (!nobuttons && !buttonsDone) {
							buttonsDone = true;
							//zoom and shift buttons
							var buttonWidth = fszB;
							
							var zoomPlus = widget_chart.createElem('text').attr({
								'class':'buttons',
								'x': (noticks)?(2*buttonWidth):(2*buttonWidth)+'px',
								'y': fszT+data.margin+buttonWidth/2 + 'px',
								'dy':'0.4em',
								'text-anchor':'middle',
								'style':ftui.version > '2.7.1'?'':'font-family: FontAwesome',
								'onclick':'widget_chart.scaleTime(evt, $("svg.basesvg'+instance+'").parent(), 0.5)',
							});
							zoomPlus.text(widget_chart.fontNameToUnicode('fa-plus-circle'));
							buttons.append(zoomPlus);
							
							var zoomMinus = widget_chart.createElem('text').attr({
								'class':'buttons',
								'x': (noticks)?(3.5*buttonWidth):(3.5*buttonWidth)+'px',
								'y': fszT+data.margin+buttonWidth/2 + 'px',
								'dy':'0.4em',
								'text-anchor':'middle',
								'style':ftui.version > '2.7.1'?'':'font-family: FontAwesome',
//									'onclick':'widget_chart.scaleTime(evt, $("svg.basesvg'+instance+'").parent(), 2)',
							});
							zoomMinus.click(function(evt) {widget_chart.scaleTime(evt, $("svg.basesvg"+instance).parent(), 2);}); // jshint ignore:line
							zoomMinus.text(widget_chart.fontNameToUnicode('fa-minus-circle'));
							buttons.append(zoomMinus);
							
							if (data.timeranges != '') {
								var selTimes = widget_chart.createElem('text').attr({
									'class':'buttons timeranges',
									'x': (noticks)?(5*buttonWidth):(5*buttonWidth)+'px',
									'y': fszT+data.margin+buttonWidth/2 + 'px',
									'dy':'0.4em',
									'text-anchor':'middle',
									'style':ftui.version > '2.7.1'?'':'font-family: FontAwesome',
								});
								selTimes.on('click', function(evt) {widget_chart.selectTime(evt, $("svg.basesvg"+instance).parent());}); // jshint ignore:line
								selTimes.text(widget_chart.fontNameToUnicode('fa-list'));
								buttons.append(selTimes);
							}
							
							var shiftMinus = widget_chart.createElem('text').attr({
								'class':'buttons shiftminus',
								'x': (noticks)?buttonWidth/2:buttonWidth/2+'px',
								'y': fszT+data.margin+buttonWidth/2 + 'px',
								'dy':'0.4em',
								'text-anchor':'middle',
								'style':ftui.version > '2.7.1'?'':'font-family: FontAwesome',
//									'onclick':'widget_chart.shift(evt, $("svg.basesvg'+instance+'").parent(), 1)',
							});
							shiftMinus.click(function(evt) {widget_chart.shift(evt, $("svg.basesvg"+instance).parent(), 1, false, false, function() {
								var baseobject = $("svg.basesvg"+instance).parent();
								var data = baseobject.data;
								widget_chart.shiftXContent(baseobject,0,1,0,data);
							});}); // jshint ignore:line
							shiftMinus.text(widget_chart.fontNameToUnicode('fa-arrow-circle-left'));
							buttons.append(shiftMinus);
							
							var shiftPlus = widget_chart.createElem('text').attr({
								'class':'buttons shiftplus',
								'x': (data.basewidth - ((noticks)?(buttonWidth/2):(buttonWidth/2)))+'px',
								'y': fszT+data.margin+buttonWidth/2 + 'px',
								'dy':'0.4em',
								'text-anchor':'middle',
								'style':ftui.version > '2.7.1'?'':'font-family: FontAwesome',
//									'onclick':'widget_chart.shift(evt, $("svg.basesvg'+instance+'").parent(), -1)',
							});
							shiftPlus.click(function(evt) {widget_chart.shift(evt, $("svg.basesvg"+instance).parent(), -1, false, false, function() {
								var baseobject = $("svg.basesvg"+instance).parent();
								var data = baseobject.data;
								widget_chart.shiftXContent(baseobject,0,1,0,data);
							});}); // jshint ignore:line
							shiftPlus.text(widget_chart.fontNameToUnicode('fa-arrow-circle-right'));
							buttons.append(shiftPlus);

							if (data.DDD.Active) {
								var rotX = widget_chart.createElem('text').attr({
									'class':'buttons',
									'x': (data.basewidth - ((noticks)?(2*buttonWidth):(2*buttonWidth)))+'px',
									'y': fszT+data.margin+buttonWidth/2 + 'px',
									'dy':'0.4em',
									'text-anchor':'middle',
									'style':ftui.version > '2.7.1'?'':'font-family: FontAwesome'
								});
								rotX.text(widget_chart.fontNameToUnicode('fa-long-arrow-'+(ftui.version > '2.7.1'?'alt-':'')+'right'));
								buttons.append(rotX);
								rotX.on('dblclick',function(evt) {widget_chart.rotate(evt, $('svg.basesvg'+instance).parent(), -5, 0);}); // jshint ignore:line
								rotX.on('click',function(evt) {widget_chart.rotate(evt, $('svg.basesvg'+instance).parent(), 5, 0);}); // jshint ignore:line

								var gRotX = widget_chart.createElem('g').attr({
									'class':'buttons',
									'style':data.DDD.prefix+'transform-origin:'+2*(data.basewidth - ((noticks)?(2.2*buttonWidth):(2.2*buttonWidth)))+'px 0px 0px; '+data.DDD.prefix+'transform:scale(0.5,1) translate(4px,12px)'
								});
								rotX = widget_chart.createElem('text').attr({
									'class':'buttons',
									'dy':'0.4em',
									'text-anchor':'middle',
									'style':ftui.version > '2.7.1'?'':'font-family: FontAwesome',
								});
								rotX.text(widget_chart.fontNameToUnicode('fa-rotate-left'));
								gRotX.append(rotX);
								buttons.append(gRotX);
								rotX.on('dblclick',function(evt) {widget_chart.rotate(evt, $('svg.basesvg'+instance).parent(), -5, 0);}); // jshint ignore:line
								rotX.on('click',function(evt) {widget_chart.rotate(evt, $('svg.basesvg'+instance).parent(), 5, 0);}); // jshint ignore:line

								var rotY = widget_chart.createElem('text').attr({
									'class':'buttons',
									'x': (data.basewidth - ((noticks)?(3.5*buttonWidth):(3.5*buttonWidth)))+'px',
									'y': fszT+data.margin+buttonWidth/2 + 'px',
									'dy':'0.4em',
									'text-anchor':'middle',
									'style':ftui.version > '2.7.1'?'':'font-family: FontAwesome',
								});
								rotY.text(widget_chart.fontNameToUnicode('fa-long-arrow-'+(ftui.version > '2.7.1'?'alt-':'')+'up'));
								buttons.append(rotY);
								rotY.on('dblclick',function(evt) {widget_chart.rotate(evt, $('svg.basesvg'+instance).parent(), 0, -5);}); // jshint ignore:line
								rotY.on('click',function(evt) {widget_chart.rotate(evt, $('svg.basesvg'+instance).parent(), 0, 5);}); // jshint ignore:line

								var gRotY = widget_chart.createElem('g').attr({
									'class':'buttons',
									'style':data.DDD.prefix+'transform-origin: 0px '+1.4*buttonWidth/2+'px 0px; '+data.DDD.prefix+'transform:scale(1,0.5)',
								});
								rotY = widget_chart.createElem('text').attr({
									'class':'buttons',
									'x': (data.basewidth - ((noticks)?(3.5*buttonWidth):(3.5*buttonWidth)))+'px',
									'dy':'1.0em',
									'text-anchor':'middle',
									'style':ftui.version > '2.7.1'?'':'font-family: FontAwesome',
								});
								rotY.text(widget_chart.fontNameToUnicode('fa-rotate-left'));
								gRotY.append(rotY);
								buttons.append(gRotY);
								rotY.on('dblclick',function(evt) {widget_chart.rotate(evt, $('svg.basesvg'+instance).parent(), 0, -5);}); // jshint ignore:line
								rotY.on('click',function(evt) {widget_chart.rotate(evt, $('svg.basesvg'+instance).parent(), 0, 5);}); // jshint ignore:line
							}
							svg_new.find('[id="baseforDDD"]').before(buttons);
						}
					
						if (!noticks && ptype.indexOf('_proxy')<0) {
							//y-ticks
							var iyticks = 0;
							var text = widget_chart.createElem('text');
							text.HTML2SVG(data.getAxisSetting('ytext',uaxis));
							var textY = (0.5*data.graphHeight/100*data.baseheight+data.topOffset);
							var textX = (!data.isPrimary(uaxis)) ? data.getGraphLeft()+data.graphWidth/100*data.basewidth+data.textWidth_sec[AI]-data.textHeight/2 : data.getGraphLeft()-data.textWidth_prim[AI]+data.textHeight;
							text.attr({
								'class':'text axes yaxis',
								'x': textX,
								'y': textY,
								'transform':'rotate(-90 '+textX+','+textY+')',
								'text-anchor':"middle",
							});
							if (widget_chart.LOGTYPE=='window') text.attr('onclick','widget_chart.showLog($("svg.basesvg'+instance+'"))');
							if ( autoscaley ) fix = (yticks < 1) ? 1 : 0;
							tyaxis.append(text);

							for (y=ymin_t; y<=max; y+=yticks ){
								if (yticks==0) break;
								fix = $.isArray(data.yLimits[AI].primary.yticks)?(data.yLimits[AI].primary.yticks[1]?(($.isArray(data.yLimits[AI].primary.yticks[1])?data.yLimits[AI].primary.yticks[1][0]:data.yLimits[AI].primary.yticks[1]) - ymin_t):ymin_t):widget_chart.precision( data.yLimits[AI].primary.yticks );
								var line = widget_chart.createElem('line');
								p1 = data.transD2W([0,y],uaxis);
								p2 = data.transD2W([data.xrange,y],uaxis);
								line.attr({
									'class':'yticks '+ data.flatUaxis(uaxis)+ '-' + AI,
									'x1':p1[0]+'px',
									'y1':p1[1]+'px',
									'x2':p2[0]+'px',
									'y2':p2[1]+'px',
									'style':'stroke-width:'+strkY.stroke+'px'+'; stroke-dasharray:'+strkY.dash,
								});
								gridlines.prepend(line);
								
								xaxis2 = widget_chart.createElem('line');
								var py = p1[1]-data.topOffset;
								p1 = widget_chart.getTransformedPoint(data,theObj,{x:0,y:py,z:0});
								p2 = widget_chart.getTransformedPoint(data,theObj,{x:0,y:py,z:data.DDD.BackplaneZ(data.DDD,data.nGraphs)});
								xaxis2.attr({
									'class':'yticks ' + data.flatUaxis(uaxis)+ '-' + AI,
									'x1':p1.x+'px',
									'y1':p1.y+'px',
									'x2':p2.x+'px',
									'y2':p2.y+'px',
									'style':'stroke-width:'+strkY.stroke+'px'+'; stroke-dasharray:'+strkY.dash,
								});
								gridlines_left.prepend(xaxis2);

								text = widget_chart.createElem('text');
								textY = (((max-y))/(max-min)*data.graphHeight/100*data.baseheight+data.topOffset+fszA/2);
								text.attr({
									'class':'text axes yaxis',
									'x': (!data.isPrimary(uaxis)) ? data.getGraphLeft()+data.graphWidth/100*data.basewidth+'px' : (0-2+data.getGraphLeft())+'px',
									'y': textY+'',
									'text-anchor':(!data.isPrimary(uaxis)) ? "start" : "end",
								});
								tyaxis.append(text);

								var yt_scaled = yticks/((data.isPrimary(uaxis))?data.yLimits[AI].primary.scaleY:data.yLimits[AI].secondary.scaleY);
								if ( autoscaley ) fix = ((yt_scaled < 10) && (parseInt(yt_scaled)!=yt_scaled)) ? 1 : 0;
								var ysc = (data.isPrimary(uaxis))?(y+data.yLimits[AI].primary.shiftY)/data.yLimits[AI].primary.scaleY:(y+data.yLimits[AI].secondary.shiftY)/data.yLimits[AI].secondary.scaleY;
								if (parseInt(ysc) == parseFloat(ysc.toFixed(5))) fix = 0;
								
								if ($.isArray(ytary)) {
									if (ytary[iyticks] && $.isArray(ytary[iyticks])) {
										text.HTML2SVG(ytary[iyticks][1]);
										//text.HTML2SVG( widget_chart.formatTicksText(ytary[iyticks][1],fix,data.getAxisSetting('yunit',uaxis),data.getAxisSetting('yticks_format',uaxis)));
									} else {
										text.HTML2SVG( widget_chart.formatTicksText(ysc,fix,data.getAxisSetting('yunit',uaxis),data.getAxisSetting('yticks_format',uaxis)));
									}
									// exit for loop if yticks array is "finished" now
									if(iyticks+1 >= ytary.length) break;

									yticks = $.isArray(ytary[iyticks])?ytary[iyticks+1][0]-ytary[iyticks][0]:ytary[iyticks+1]-ytary[iyticks];
									yticks = yticks * ((data.isPrimary(uaxis))?data.yLimits[AI].primary.scaleY:data.yLimits[AI].secondary.scaleY);
								/*
								if ($.isArray(ytary)) {
									yticks = (ytary.length && ytary.length > iyticks+1)?(($.isArray(ytary[iyticks])?ytary[iyticks+1][0]-ytary[iyticks][0]:ytary[iyticks+1]-ytary[iyticks])):yticks;
									yticks = yticks * ((data.isPrimary(uaxis))?data.yLimits[AI].primary.scaleY:data.yLimits[AI].secondary.scaleY);
									if (ytary[iyticks] && $.isArray(ytary[iyticks])) {
										text.HTML2SVG(ytary[iyticks][1]);
									} else {
										text.HTML2SVG( widget_chart.formatTicksText(ysc,fix,data.getAxisSetting('yunit',uaxis),data.getAxisSetting('yticks_format',uaxis)));
									}
								*/
								} else {
									text.HTML2SVG( widget_chart.formatTicksText(ysc,fix,data.getAxisSetting('yunit',uaxis),data.getAxisSetting('yticks_format',uaxis)));
									// text.text( ((fix>-1 && fix<=20) ? parseFloat(ysc.toFixed(fix)) : ysc)+((uaxis=="secondary") ? unit_sec : unit) );
								}

								iyticks++;
							}
							
							var xtext_offset = widget_chart.getXTOffset(0,0,tstart,timeformat,data.xtext_offset);

							if (!xaxisDone) { // only add axis and gridlines when not already done
								//x-axis
								//leftmost text, show date
								xaxisDone = true;
								var textX1 = widget_chart.createElem('text');
								var posX = data.graphWidth*(xtext_offset)/data.xrange*data.basewidth/100 + data.getGraphLeft()
								var posY = (((max))/(max-min)*data.graphHeight/100*data.baseheight+data.topOffset+data.textHeight);
								var tarr;
								
								textX1.attr({
									'class':'text axes xaxis major',
									'x':posX + 'px',
									'y':posY,
									'text-anchor':'middle',
								});
								if (data.xticks_angle !== 0) textX1.attr({'transform':'rotate('+(-data.xticks_angle)+' '+(posX+2)+','+(posY+2)+')'});

								if (timeformat!==undefined && timeformat!=='') {
									tarr = widget_chart.getDateTimeNumberString(tstart,timeformat);
									textX1.HTML2SVG(tarr[0]);
									for (i=1, il=tarr.length; i<il; i++) {
										var tObj = textX1.clone().attr('y',(((max))/(max-min)*data.graphHeight/100*data.baseheight+data.topOffset+data.textHeight+i*data.textHeight));
										tObj.HTML2SVG(tarr[i],true);
										txaxis.append(tObj);
									}
								} else {
									textX1.HTML2SVG(tstart.ddmm());
								}
								if (!cachetype || xtext_offset!=0) txaxis.append(textX1);
								textX1.click(function(evt) {widget_chart.resetTime(evt);});

								var tx = new Date(tstart);
								if (xticksArrayMonths) {
									var moffset = tx.getMonth()*($.isArray(xticksArray)?xticksArray.length:12)/12; // care for array length for xticks setup
								} else {
									var moffset = 0;
								}

								x=0;
								var xold = 0;
								var xlast = new Date(tstart);

								for ( var xl=(cachetype?0:xticks); xl<=data.xrange+(cachetype?0:0); xl+=xticks ){	// counting up x values (in minutes)
									tx = new Date(tstart);
									var mindex = Math.max(parseInt((xl/xticks+moffset-1)%($.isArray(xticksArray)?xticksArray.length:0)),0);
									x = xl==0?0:($.isArray(xticksArray)?(x+(xticksArray[mindex])*60*24):xl);
									var xc = x;
									if (data.xticks_round !== '' && !$.isArray(xticksArray)) xc = widget_chart.roundXticks(data.xticks_round,x,data.xrange,tstart,((data.basewidth>200)?3.5:7));
									if (!cachetype && (xc>=data.xrange || xc<=0)) continue; // we have to care that nothing is written beyond end of chart
									if (cachetype && (xc>data.xrange+xticks || xc<0)) continue; // we have to care that nothing is written beyond end of chart

									tx.setTime(tstart.getTime() + xc*60*1000);
									xtext_offset = widget_chart.getXTOffset(xc,xold,tx,timeformat,data.xtext_offset);
									xold = xc;
									var textX2 = widget_chart.createElem('text');
									posX = data.graphWidth*(xc+(xtext_offset))/data.xrange*data.basewidth/100 + data.getGraphLeft();
									posY = (((max))/(max-min)*data.graphHeight/100*data.baseheight+data.topOffset)+data.textHeight;
									textX2.attr({
										'class':'text axes xaxis',
										'x':posX+'px',
										'y':posY,
										'text-anchor':'middle',
									});
									if (data.xticks_angle !== 0) textX2.attr({'transform':'rotate('+-data.xticks_angle+' '+(posX+2)+','+(posY+2)+')'});

									if (timeformat!==undefined && timeformat!=='') {
										tarr = widget_chart.getDateTimeNumberString(tx,timeformat);
										textX2.HTML2SVG(tarr[0]);
										for (i=1, il=tarr.length; i<il; i++) {
											var tObj = textX2.clone().attr('y',posY+i*data.textHeight);
											tObj.HTML2SVG(tarr[i],true);
											txaxis.append(tObj);
										}
									} else {
										if (tx.hhmm()=="00:00") textX2.attr({'class':'text axes xaxis major'});
										var textX2Value = (tx.hhmm()=="00:00"||xticks>1440) ? tx.ddmm() : tx.hhmm() ; // if we are at exactly 00:00 of if difference between ticks is larger than a day don't display hours.
										textX2.HTML2SVG(textX2Value);
									}
									if (!cachetype || (cachetype && ((xc>0) && (xc<data.xrange))))txaxis.append(textX2);
									textX2.data('xleft',xlast)
									textX2.data('xright',tx);
									xlast = tx;
									textX2.click(function(evt) {widget_chart.zoomTime(evt);});

									var xtick1 = widget_chart.createElem('line');
									p1 = data.transD2W([xc,min],uaxis);
									p2 = data.transD2W([xc,max],uaxis);
									xtick1.attr({
										'class':'xticks',
										'x1':p1[0]+'px',
										'y1':p1[1]+'px',
										'x2':p2[0]+'px',
										'y2':p2[1]+'px',
										'style':'stroke-width:'+strkX.stroke+'px'+'; stroke-dasharray:'+strkX.dash
									});
									cgridlines.prepend(xtick1);

									var xtick2 = widget_chart.createElem('line');
									p1 = widget_chart.getTransformedPoint(data,theObj,{xc:data.graphWidth/100*data.basewidth*xc/data.xrange,y:data.graphHeight/100*data.baseheight,z:0});
									p2 = widget_chart.getTransformedPoint(data,theObj,{xc:data.graphWidth/100*data.basewidth*xc/data.xrange,y:data.graphHeight/100*data.baseheight,z:data.DDD.BackplaneZ(data.DDD,data.nGraphs)});
									xtick2.attr({
										'class':'xticks',
										'x1':p1.x+'px',
										'y1':p1.y+'px',
										'x2':p2.x+'px',
										'y2':p2.y+'px',
									});
									cgridlines.prepend(xtick2);
								}
								
								//rightmost text, show date
								xtext_offset = widget_chart.getXTOffset(xc,xold,data.tend,timeformat,data.xtext_offset);
								textX1 = widget_chart.createElem('text');
								posX = data.graphWidth*((data.xrange+(xtext_offset))/data.xrange)*data.basewidth/100 + data.getGraphLeft()
								if (posX <= data.graphWidth*data.basewidth/100 + data.getGraphLeft()) {
									posY = (((max))/(max-min)*data.graphHeight/100*data.baseheight+data.topOffset+data.textHeight);
									textX1.attr({
										'class':'text axes xaxis major',
										'x':posX+'px',
										'y':posY,
										'text-anchor':"middle",
									});
									if (data.xticks_angle !== 0) textX1.attr({'transform':'rotate('+(-data.xticks_angle)+' '+(posX+2)+','+(posY+2)+')'});
									if (timeformat!==undefined && timeformat!=='') {
										tarr = widget_chart.getDateTimeNumberString(data.tend,timeformat);
										textX1.HTML2SVG(tarr[0]);
										for (i=1, il=tarr.length; i<il; i++) {
											var tObj = textX1.clone().attr('y',(((max))/(max-min)*data.graphHeight/100*data.baseheight+data.topOffset+data.textHeight+i*data.textHeight));
											tObj.HTML2SVG(tarr[i],true);
											txaxis.append(tObj);
										}
									} else {
										textX1.HTML2SVG(data.tend.ddmm());
									}
									if (!cachetype || xtext_offset!=0) txaxis.append(textX1);
								}
								textX1.click(function(evt) {widget_chart.resetTime(evt);});
							}
							
//							if (((k<data.nGraphs-1) && (data.yLimits[AI].primary.yticks_prio == 'auto')) || (data.yLimits[AI].primary.yticks_prio != data.flatUaxis(uaxis)) && (data.yLimits[AI].primary.yticks_prio != 'auto')) {
//								if (type.indexOf('start') > -1) data.gridlines_hidden = data.flatUaxis(uaxis) + '-' + AI;
//							}
						}
						else{ // no axis and ticks as class is set to "noticks"
						}

						if (!(aiDone['primary'][AI] || aiDone['secondary'][AI])) {
							svg.parent().find('g.chart-gridlines').first().append(gridlines);
							if (data.DDD.Active) svg.parent().find('g.chart-left-gridlines').append(gridlines_left);
							if (data.DDD.Active) svg.parent().find('g.chart-bottom-gridlines').append(gridlines_bottom);
							svg.parent().append(taxes);
						}

						//Viewbox (autoscaler)
						graphTop = 100-(data.baseheight-data.topOffset)/data.baseheight*100;
						svg.parent().find('g.chart-gridlines').attr({"height":data.graphHeight/100*data.baseheight+"px","y":data.topOffset+"px"});
						svgbase = svg.find('g.chart-parent').last();
						svgbase.attr({"height":data.graphHeight/100*data.baseheight+"px","y":data.topOffset+"px",'style':svgbase.attr('style')+'; '+data.DDD.String.Rot+'; '+data.DDD.String.Trans(0,k+1,data.DDD,data.xStrTO,data.yStrTO)});
						svg.parent().find("[class*=viewbox]").each(function(index) {$(this)[0].setAttribute('viewBox', [0, -max, data.xrange, max-min ].join(' '));}); // jshint ignore:line
						svg.parent().find('rect.chart-background').attr({"height":data.graphHeight+"%","y":graphTop+"%"});
						svg.parent().find('[id=clipingRect'+instance+']').find('rect').attr({"height":data.graphHeight+"%","y":graphTop+"%"});
						svg.parent().find('g.yaxis_'+data.flatUaxis(uaxis) + '-' + AI).click(function(evt) {widget_chart.showHideGridlines(evt);});
						aiDone[data.flatUaxis(uaxis)][AI] = true;
					}
					else {
						if (!aiDone[data.flatUaxis(uaxis)][AI]||true) {
							//Viewbox (autoscaler)
							graphTop = 100-(data.baseheight-data.topOffset)/data.baseheight*100;
							svgbase = svg.find('g.chart-parent').last();
							svgbase.attr({"height":data.graphHeight/100*data.baseheight+"px","y":data.topOffset+"px",'style':svgbase.attr('style')+'; '+data.DDD.String.Rot+'; '+data.DDD.String.Trans(0,k+1,data.DDD,data.xStrTO,data.yStrTO)});
							svg.parent().find('rect.chart-background').attr({"height":data.graphHeight/100*data.baseheight+"px","y":data.topOffset+"px"});
						}
						aiDone[data.flatUaxis(uaxis)][AI] = true;
						svg.parent().find("[class*=viewbox]").each(function(index) {$(this)[0].setAttribute('viewBox', [0, -max, data.xrange, max-min ].join(' '));}); // jshint ignore:line
					}

					var p, point_new, color;
					var ptc = ptype.substring(0,Math.max(0,ptype.indexOf('_proxy')>0?ptype.indexOf('_proxy'):ptype.length)).split('-');
					var subtype = (ptc.length && ptc.length > 1)?ptc[1]:'';
					var type = ptc[0];
					switch (type) {
						// add graphs themselves
						case 'lines':
						case 'steps':
						case 'fsteps':
						case 'histeps':
						case 'bars':
						case 'ibars':
						case 'cubic':
						case 'quadratic':
						case 'quadraticSmooth':
							if (points.length > 1) {polyline.attr(attrval);}
							polyline.attr('id',data.flatUaxis(uaxis) + "-graph-" + instance + "-" + k + "-" + ptype);
							if (data.graphsshown[k]) {
								polyline.attr('animstate','hide');								
							} else {
								polyline.attr('animstate','show');
								polyline.attr('transform', "translate(0,"+min+") "+ "scale(1,0)");
							}
							polyline.attr('min',data.transD2W([0,min],uaxis)[1]);
							polyline.attr('max',data.transD2W([0,max],uaxis)[1]);
							polyline.attr('xrange', data.transD2W([data.xrange,0],uaxis)[0]);
							polyline.attr('x0polar',data.transD2W([-data.minx,-data.yLimits[AI].primary.shiftY],'primary')[0]);
							polyline.attr('y0polar',data.transD2W([-data.minx,-data.yLimits[AI].primary.shiftY],'primary')[1]);
							color = (polyline.css("stroke"))?polyline.css("stroke"):polyline.css("fill");
							if (data.DDD.Active) {
								//svgbase.attr({'style':svgbase.attr('style')+'; opacity:0.1'});
								var depth = parseInt(parseFloat(data.DDD.Width(k)));
								p1 = widget_chart.getTransformedPoint(data,theObj,{x:0,y:0,z:0});
								p2 = widget_chart.getTransformedPoint(data,theObj,{x:0,y:0,z:1});
								var dist = Math.sqrt(Math.pow(p1.x-p2.x,2)+Math.pow(p1.y-p2.y,2));
								if (dist > 0) {
									polyline.attr('style',polyline.attr('style')+'; opacity: 0.6');
									for (i=depth, l=0; i>l; i-=1/dist) {
										if (i!==0) {
											var svg_tmp = svgbase.clone().attr('style',svgbase.attr('style')+'; '+data.DDD.String.Rot+'; '+data.DDD.String.Trans(i,k+1,data.DDD,data.xStrTO,data.yStrTO));
											if (i!=depth && svg_tmp.find('path').attr('style')!==undefined) svg_tmp.find('path').attr('style',svg_tmp.find('path').attr('style').replace(/fill:.*;/,'fill:none; '));
											if (i==depth) svg_tmp.find('path').attr('style',svg_tmp.find('path').attr('style')+'; opacity:0.6');
											svg_tmp.find('path').attr('id',svg_tmp.find('path').attr('id')+'_'+i);
											svgbase.before(svg_tmp);
										}
									}
								}
							}
							if (ptype.indexOf('_proxy')>0) {	// needed for text display in case of logproxy polar
								g = widget_chart.createElem('g');
								g.attr('class',style);
								g.attr('id',data.flatUaxis(uaxis) + "-graph-" + instance + "-" + k + "-" + ptype);
								if (data.graphsshown[k]) {
									g.attr('animstate','hide');								
								} else {
									g.attr('animstate','show');
									g.attr('transform', "translate(0,"+min+") "+ "scale(1,0)");
								}
								g.attr('min',data.transD2W([0,min],uaxis)[1]);
								g.attr('max',data.transD2W([0,max],uaxis)[1]);
								g.attr('xrange',data.transD2W([data.xrange,0],uaxis)[0]);
								g.attr('x0polar',data.transD2W([-data.minx,-data.yLimits[AI].primary.shiftY],'primary')[0]);
								g.attr('y0polar',data.transD2W([-data.minx,-data.yLimits[AI].primary.shiftY],'primary')[1]);
								//var strk = (g.css("stroke-width")) ? parseFloat(g.css("stroke-width").split('px')) : 1;
								var strkG2 = widget_chart.scaleStroke(classesContainer, '.'+style.replace(/(sym|dash|dot|fill|)/g,'')+'sym', 1);
								attrval2.style = attrval2.style + ';font-size:' + strkG2.stroke + 'px; ';
								for (j=0;j<points.length;j++) {
									if (points[j][2]) {
										point_new = widget_chart.createElem('text');
										p = data.transD2W(points[j],uaxis);
										attrval2.style = attrval2.style + '; text-anchor:' + points[j][2];
										attrval2.x = p[0];
										attrval2.y = p[1];
										//attrval2.transform = "translate(" + attrval2.x + " " + attrval2.y + ") scale(1,-1) translate(" + (-attrval2.x) + " " + (-attrval2.y) + ")";
										point_new.attr(attrval2);
										point_new.attr("dominant-baseline","middle");
										point_new.text(points[j][3]);
										g.append(point_new);
									}
								}
								svg_chart.find('polyline').parent().append(g);
							}
							break;

						case 'points':
							g = widget_chart.createElem('g');
							g.attr('class',style);
							g.attr('id',data.flatUaxis(uaxis) + "-graph-" + instance + "-" + k + "-" + ptype);
							if (data.graphsshown[k]) {
								g.attr('animstate','hide');								
							} else {
								g.attr('animstate','show');
								g.attr('transform', "translate(0,"+min+") "+ "scale(1,0)");
							}
							g.attr('min',data.transD2W([0,min],uaxis)[1]);
							g.attr('max',data.transD2W([0,max],uaxis)[1]);
							g.attr('xrange',data.transD2W([data.xrange,0],uaxis)[0]);
							g.attr('x0polar',data.transD2W([-data.minx,-data.yLimits[AI].primary.shiftY],'primary')[0]);
							g.attr('y0polar',data.transD2W([-data.minx,-data.yLimits[AI].primary.shiftY],'primary')[1]);
							//var strk = (g.css("stroke-width")) ? parseFloat(g.css("stroke-width").split('px')) : 1;
							attrval.ry = strkG.stroke/2;
							attrval.rx = strkG.stroke/2;
							for (j=0;j<points.length;j++) {
								point_new = widget_chart.createElem('ellipse');
								//attrval['stroke-width'] = strk;
								p = data.transD2W(points[j],uaxis);
								attrval.cx = p[0];
								attrval.cy = p[1];
								point_new.attr(attrval);
								g.append(point_new);
							}
							svg_chart.find('polyline').parent().append(g);
							break;
						case 'symbol':
						case 'icons':
							g = widget_chart.createElem('g');
							g.attr('class',style);
							g.attr('id',data.flatUaxis(uaxis) + "-graph-" + instance + "-" + k + "-" + ptype);
							if (data.graphsshown[k]) {
								g.attr('animstate','hide');								
							} else {
								g.attr('animstate','show');
								g.attr('transform', "translate(0,"+min+") "+ "scale(1,0)");
							}
							g.attr('min',data.transD2W([0,min],uaxis)[1]);
							g.attr('max',data.transD2W([0,max],uaxis)[1]);
							g.attr('xrange',data.transD2W([data.xrange,0],uaxis)[0]);
							g.attr('x0polar',data.transD2W([-data.minx,-data.yLimits[AI].primary.shiftY],'primary')[0]);
							g.attr('y0polar',data.transD2W([-data.minx,-data.yLimits[AI].primary.shiftY],'primary')[1]);

							//var strk = (g.css("stroke-width")) ? parseFloat(g.css("stroke-width").split('px')) : 1;
							attrval.style = attrval.style + ';font-size:' + strkG.stroke + 'px;' + 'text-anchor:middle' + ';font-family:' + fontFamily + ';font-weight:' + fontWeight;
							if (ptype == 'symbol') {
								for (j=0;j<points.length;j++) {
									point_new = widget_chart.createElem('text');
									//attrval['stroke-width'] = strk;
									p = data.transD2W(points[j],uaxis);
									attrval.x = p[0];
									attrval.y = p[1];
									var angl = points[j].length > 3?points[j][3]:0;
									var scl = points[j].length > 4?points[j][4]:1;
									attrval.transform = "translate(" + attrval.x + " " + attrval.y + ") "+"rotate("+angl+")"+" scale("+scl+","+scl+") translate(" + (-attrval.x) + " " + (-attrval.y) + ")";
									point_new.attr(attrval);
									point_new.text(symbol);
									g.append(point_new);
								}
							} else {
								for (j=0;j<points.length;j++) {
									point_new = widget_chart.createElem('image');
									//attrval['stroke-width'] = strk;
									p = data.transD2W(points[j],uaxis);
									attrval.x = p[0]-strkG.stroke/2;
									attrval.y = p[1]-strkG.stroke/2;
									attrval.width = strkG.stroke;
									attrval.height = strkG.stroke;
									attrval.preserveAspectRatio = 'none';
									point_new[0].setAttributeNS('http://www.w3.org/1999/xlink','href',points[j][2]); // setting xlink:href seems to be not working properly
									if (points[j][2].indexOf('proplanta')>-1) attrval.filter = 'url(#nowhite)'; else attrval.filter = '';
									point_new.attr(attrval);
									g.append(point_new);
								}
							}
							svg_chart.find('polyline').parent().append(g);
							break;
					}
				}
			}
		}

		if (data.yticks_prio == 'auto') { // set axis to be displayed when yticks_prio is set to auto
			var found = false;
			$.each(data.yLimits, function(ind,val) {
				if (!isNaN(data.yLimits[ind].primary.max) && !found) { // found an existing axis because max ist set
					data.yLimits[ind].primary.yticks_prio = true; // set this axis to prio and stop searching
					found = true;
				}
			});
			if (!found) { // no primary axis existing, search secondary axes
				$.each(data.yLimits, function(ind,val) {
					if (!isNaN(data.yLimits[ind].secondary.max) && !found) { // found an existing axis because max ist set
						data.yLimits[ind].secondary.yticks_prio = true;
						found = true;
					}
				});
			}
		}

		widget_chart.doShowHideGridlines(data,svg_new);
		
		svg_new.find("[class*=scaleyinvert]").each(function(index) {$(this).attr({'transform':'scale(1 -1)'});});

		// generate crosshair container for cursor
		var crosshair = widget_chart.createElem('g').attr({'class':'crosshair container','pointer-events':'none','style':'overflow: inherit;'});
		crosshair.append(widget_chart.createElem('line').attr({'class':'crosshair','style':data.DDD.String.Rot+'; '+data.DDD.String.Trans(0,0,data.DDD,data.xStrTO,data.yStrTO)}));
		if (data.DDD.Active) crosshair.append(widget_chart.createElem('line').attr({'class':'crosshair','style':data.DDD.String.Rot+'; '+data.DDD.String.Trans(data.DDD.Width(data.nGraphs-1),data.nGraphs,data.DDD,data.xStrTO,data.yStrTO)}));

		for (k=0, lk=data.logProxy?data.nGraphs:data.nGraphs+1; k<lk; k++) { // prepare crosshair text elements for each graph
			g = widget_chart.createElem('g').attr({'class':'crosshair', 'style':data.DDD.String.Rot+'; '+data.DDD.String.Trans(0,k<data.nGraphs?k+1:0,data.DDD,data.xStrTO,data.yStrTO)});
			crosshair.append(g);
			var t = widget_chart.createElem('text').attr({'class':'crosshair', 'filter':'url(#filterbackground)', 'style':'z-index:10001; stroke-width:0px', 'text-anchor':'end'});
			t.HTML2SVG((data.legend!==undefined)?((data.legend[k] && data.legend[k]!=='')?data.legend[k] + ": ":''):''+' ',true); // generate <tspan> contents
			t.HTML2SVG(" ");
			t.find('tspan').last().attr({'class':'crosshairValue'});
			g.append(t);
			t.hide();
			//g.append(widget_chart.createElem('text').attr({'class':'crosshair', 'style':'z-index:10001; stroke-width:0px; filter: blur(10px)', 'text-anchor':'end'}));
		}
	
		svg_new.find('[id="baseforDDD"]').append(crosshair); // add crosshair
		
		// text element for show/hide of crosshair cursor
		if (!nobuttons) {
			//var cursor_text = widget_chart.createElem('text').attr({'class':'caption'+((data.crosshair)?' active':' inactive'),'x':'51%','y':nobuttons?fszC/2+fszT+data.margin:Math.max(fszC,fszB)/2+fszT+data.margin,'dy':'0.4em','text-anchor':'begin'});
			var cursor_text = widget_chart.createElem('text').attr({'class':'caption cursorbutton'+((data.crosshair)?' active':' inactive'),'x':(noticks)?(data.timeranges!=''?8*fszB:6.5*fszB):(data.timeranges!=''?8*fszB:6.5*fszB)+'px','y':nobuttons?fszC/2+fszT+data.margin:Math.max(fszC,fszB)/2+fszT+data.margin,'dy':'0.4em','text-anchor':'begin'});
			cursor_text.text("Cursor");
			cursor_text.on('click', function(event) {
				if ($(event.delegateTarget).parents("[class^=basesvg]").parent().data('crosshair')) {
					$(event.delegateTarget).parents("[class^=basesvg]").parent().data('crosshair',false);
					widget_chart.doHide($(event.delegateTarget).parents("[class^=basesvg]").find('g.crosshair'),'.crosshair',data);
					//$(event.delegateTarget).parents("[class^=basesvg]").find('g.crosshair').hide();
					$(event.delegateTarget).attr({'class':'caption inactive'});
				} else {
					$(event.delegateTarget).parents("[class^=basesvg]").parent().data('crosshair',true);
					$(event.delegateTarget).parents("[class^=basesvg]").find('g.crosshair').show();
					$(event.delegateTarget).attr({'class':'caption active'});
				}
			});
			legend_menu.append(cursor_text);
		}

		// register events for crosshair cursor		// register events for swipe
		if (!data.logProxy) widget_chart.detectSwipe(svg_new.find("rect.chart-background, [id*='graph-']"));

		svg_new.find("rect.chart-background, [id*='graph-']").on("mouseenter touchstart",function(event) {
			widget_chart.checkEvent(event);
		});
		
		svg_new.find("rect.chart-background, [id*='graph-']").on("mouseleave touchend",function(event) {
			widget_chart.checkEvent(event);
		});
		
		svg_new.find("rect.chart-background, [id*='graph-']").on('mousemove touchmove',function(event) {
			widget_chart.checkEvent(event);
		});

		// Hack for problem in IE11 with transform of SVG elements
		browserCaps.doSVGTransformCorrection(svg_new);
		
		// graph source is ready, add it to the page if not in prefetch/cachemode
		if (!cachetype) svg_new.appendTo($(theObj))
			.css("width",data.width || data.defaultWidth)
			.css("height",data.height || data.defaultHeight);

		// calculate and set the cliping rectangle for the x axis
		if (!cachetype) {
			var first_xtext = svg_new.find('g.text.xaxis').children().first();
			var cl_offset = (first_xtext&&first_xtext.length&&first_xtext.length>0)?first_xtext[0].getBoundingClientRect().width/2:0;
			svg_new.find('[id="clipingRectXAxis'+data.instance+'"]').html(widget_chart.getClipPath(data,cl_offset,theObj,3)+widget_chart.getClipPath(data,-cl_offset,theObj,3));
			svg_new.find("svg.chart-primsec").attr("stlye",data.DDD.prefix.replace(/-moz-/g,'')+'clip-path: url(#clipingRect'+(data.DDD.prefix=='-moz-'?'Graphs-':'Graphs-')+cachetype+data.instance+'); overflow: visible;');
		}
		
		if (cachetype) { // we are in prefetch/cache mode, do not use generated SVG graph but copy parts for display of previous and next timeframes when scrolling to main SVG

			var container = widget_chart.createElem('g');
			var offset = (cachetype=='previous'?(0-data.graphArea.width):(0+data.graphArea.width));
			var style;
			container.attr('id','baseforDDD-'+cachetype);
			//container.attr('style','overflow: inherit; z-index: '+(cachetype=='previous'?'100':'300')+'; '+data.DDD.prefix+'transform: '+data.DDD.String.Scale);
			container.attr('style','overflow: inherit; z-index: '+(cachetype=='previous'?'100':'300')+';'+data.DDD.prefix+'transform: '+data.DDD.String.Scale+';');
			container.append(svg_new.find("[id^=cliping]").parent());
			container.find("[id=clipingRect"+data.instance+"]").attr('id','clipingRect-'+cachetype+data.instance);
			container.find("[id=clipingRectXAxis"+data.instance+"]").attr('id','clipingRectXAxis-'+cachetype+data.instance);
			container.find("[id=clipingRectGraphs"+data.instance+"]").attr('id','clipingRectGraphs-'+cachetype+data.instance);
			container.find("[id=clipingRectCursor"+data.instance+"]").attr('id','clipingRectCursor-'+cachetype+data.instance);
			style = data.DDD.prefix.replace(/-moz-/g,'')+'clip-path: url(#clipingRectXAxis-'+cachetype+data.instance+'); overflow: visible; '
			container.append(svg_new.find("g.text.xaxis").parent());
			container.find("g.text.xaxis").parent().attr('style',style);
			style = data.DDD.prefix.replace(/-moz-/g,'')+'clip-path: url(#clipingRect-'+cachetype+data.instance+'); overflow: visible; '
			container.append(svg_new.find("g.chart-gridlines"));
			container.find('g.gridlines').attr('style',style);
			container.find('line.yticks').remove();
			container.find('line.xaxis').remove();
			container.find('line.yaxis').remove();
			style = data.DDD.prefix.replace(/-moz-/g,'')+'clip-path: url(#clipingRect'+(data.DDD.prefix=='-moz-'?'Graphs-':'Graphs-')+cachetype+data.instance+'); overflow: visible;';
			container.append(svg_new.find("svg.chart-primsec").attr('style',style));
			//svg_new.find('g.lentries').appendTo(container);
			svg_new.find('g.lentries').remove();
			cachetype == 'previous' ? 
				svg_old.find('rect.chart-background').parent().parent().append(container) : 
				svg_old.find('rect.chart-background').parent().parent().append(container); // needed because position in DOM decides on drawing sequence for SVGs

			var crosshair = svg_old.find('g.crosshair.container').remove();
			//crosshair.children().css('clip-path','url(#clipingRectCursor-'+cachetype+data.instance+')');
			svg_old.find('[id^=baseforDDD]').last().append(crosshair); // need to put cursor at the end of the DOM in order to have it painted on top

			widget_chart.shiftXContent(svg_old,doReset?0:data.offsetX,doReset?1:data.scaleX,doReset?0:data.scaleDeltaX,data);

			if (cachetype == 'previous') {
				var xOffset = data.getGraphLeft();
				for (k=0, l=data.graphArea.width+xOffset; k<l; k++) {
					values=[];
					widget_chart.getValues(k,1,xOffset,data,values,pointsarray);		
					pointsarrayCursor[k] = values;
				}
				data_save.pointsarrayCursor_prev = pointsarrayCursor; // return points						
			} else {
				var xOffset = data.getGraphLeft();
				for (k=0, l=data.graphArea.width+xOffset; k<l; k++) {
					values=[];
					widget_chart.getValues(k,1,xOffset,data,values,pointsarray);		
					pointsarrayCursor[k] = values;
				}
				data_save.pointsarrayCursor_next = pointsarrayCursor; // return points						
			}

			// correct shifting back to normal.
			if (cachetype=='next') {
				data_save.shift = data.shift + 1;
			} else if (cachetype=='previous') {
				data_save.shift = data.shift - 1;
			}

			data_save.openDrawings -= 1;
			if (data_save.openDrawings <= 0) {
				data_save.drawing = false; // all outstanding drawings are done event handling for scale and shift can be reactivated
				data_save.runningRefresh = false;
			}
			$(theObj).data(data_save); // all data values that are modified outside of data_save need to be withdrawn
			data_save = null;
			
			return;
		}

		var scaley, shifty;

		if (type=='shift' || type=='scale') { // prepare and trigger animation when shifting or scaling
			svg_old.find('[id=baseforDDD-next]').remove(); // remove previous and next plot parts used for mousemove activities
			svg_old.find('[id=baseforDDD-previous]').remove(); // remove previous and next plot parts used for mousemove activities
			var shiftx = data.graphWidth/100*data.basewidth*swoffset*-1;
			svg_old.find('[id^=contents]').remove(); // throw away the parts just kept for dynamic x-shift
			svg_old.find('g.chart-parent').each(function(index) {
				var AI = $(this).parents("[class^=basesvg]").parent().data().getAxisIndex(uaxis);;
				scaley = (data_old.yLimits[AI].primary.diffY)/(data.yLimits[AI].primary.diffY);
				shifty = (1-scaley)*(data.graphHeight/100*data.baseheight+data.topOffset)-data.graphHeight/100*data.baseheight*(data_old.yLimits[AI].primary.min-data.yLimits[AI].primary.min)/data.yLimits[AI].primary.diffY;
				var graphs_old = $(this).find("[id*='primary-graph-']");
				var id;
				if (graphs_old.length > 0) {
					id=$(graphs_old).attr('id');
					$(graphs_old).attr('id',id.replace("graph-","graphold-"));
					$(graphs_old).attr('transform','translate('+shiftx+','+shifty+') scale('+1+','+scaley+')');
					svg_new.find("[id='"+id+"']").parent().append(graphs_old);
				}

				scaley = (data_old.yLimits[AI].secondary.diffY)/(data.yLimits[AI].secondary.diffY);
				shifty = (1-scaley)*(data.graphHeight/100*data.baseheight+data.topOffset)-data.graphHeight/100*data.baseheight*(data_old.yLimits[AI].secondary.min-data.yLimits[AI].secondary.min)/data.yLimits[AI].secondary.diffY;
				graphs_old = $(this).find("[id*='secondary-graph-']");
				if (graphs_old.length > 0) {
					id=$(graphs_old).attr('id');
					$(graphs_old).attr('id',id.replace("graph-","graphold-"));
					$(graphs_old).attr('transform','translate('+shiftx+','+shifty+') scale('+1+','+scaley+')');
					svg_new.find("[id='"+id+"']").parent().append(graphs_old);
				}
			});
			if (type=='shift')
				widget_chart.swipe(svg_new,instance,"horizontal-shift",swoffset,$(theObj).data(),data_old);
			else
				widget_chart.swipe(svg_new,instance,"scale",swoffset,$(theObj).data(),data_old);
		}

		svg_old.remove(); // old chart is not needed any more
		if (svg_new.parent().height != data.defaultHeight) {
			data.defaultHeight = data.defaultHeight/svg_new.parent().height()*data.defaultHeight;
			svg_new.height(data.height || data.defaultHeight);
		}

		//Calculate Array with x-resolution fitting to pixels for crosshair cursor
		var xOffset = data.getGraphLeft();
		var values;
		if (data.logProxy) {
			values=[];
			widget_chart.getValuesPolar(data,values,pointsarray);
			data.pointsarrayCursor = values; // return points
		} else {
			for (k=0, l=data.graphArea.width+xOffset; k<l; k++) {
				values=[];
				widget_chart.getValues(k,1,xOffset,data,values,pointsarray);		
				pointsarrayCursor[k] = values;
			}
			data.pointsarrayCursor = pointsarrayCursor; // return points
		}

		data.done = true;
		data.baseDone = true;
		data.openDrawings -= 1;
		if (data.openDrawings <= 0) data.drawing = false; // all outstanding drawings are done event handling for scale and shift can be reactivated
		$(theObj).data(data);
		data_old = null;

		//if ($(caption_text).position().left < $(caption_text).position().left+$(caption_text).width()) $(cursor_text).attr({'x': $(caption_text).position().left+$(caption_text).width()})
		//if ($(cursor_text).position().left < $(caption_text).position().left+$(caption_text).width()) $(cursor_text).attr({'x': $(caption_text).position().left+$(caption_text).width()})
		widget_chart.show_busy(elem,false);

		if (type != 'resize' && !window.checkResizeListener(theObj[0])) {
			window.addResizeListener(theObj[0], function () {
				if (theObj.is(':visible')) widget_chart.refresh($(theObj),"resize");
			});
		}
		
		if (callback) callback();

		//if (type != 'resize') $( window ).resize(function() {setTimeout(function() {widget_chart.refresh($(theObj),"resize");},200);});
		/*if (type != 'resize') $(theObj).sizeChanged({callback: function(event) {
			//var obj = $('body').find("[class^=basesvg"+$(theObj).data('instance')+']').parent();
			widget_chart.refresh($(theObj),"resize");
		}});*/
		widget_chart.doLog("widget_chart.refresh","Chart finished, Parameters: " + JSON.stringify(data,null,2),3);	
	},
};

function init_attr(elem) { // initialize all attributes called from widget init function
	var data = elem.data();
	elem.data('minvalue_sec',    typeof elem.data('minvalue_sec') != 'undefined' ? elem.data('minvalue_sec')      : 'auto');
	elem.data('maxvalue_sec',    typeof elem.data('maxvalue_sec') != 'undefined' ? elem.data('maxvalue_sec')      : 'auto');
	elem.data('minvalue',        typeof elem.data('minvalue') != 'undefined' ? elem.data('minvalue')              : 'auto');
	elem.data('maxvalue',        typeof elem.data('maxvalue') != 'undefined' ? elem.data('maxvalue')              : 'auto');
	elem.data('y_margin',        typeof elem.data('y_margin') != 'undefined' ? elem.data('y_margin')              : 0);
	elem.data('y_margin_sec',    typeof elem.data('y_margin_sec') != 'undefined' ? elem.data('y_margin_sec')      : 0);
	elem.data('daysago_start',   typeof elem.data('daysago_start') != 'undefined' ? elem.data('daysago_start')    : '0');
	elem.data('daysago_end',     typeof elem.data('daysago_end') != 'undefined' ? elem.data('daysago_end')        : '-1');
	elem.data('timeformat',      elem.data('timeformat')                                                         || '');
	elem.data('xticks_round',    elem.data('xticks_round')                                                       || '');
	elem.data('xticks_angle',    elem.data('xticks_angle')                                                       || 0);
	elem.data('xticks',          elem.data('xticks')                                                             || 'auto');
	elem.data('yticks',          elem.data('yticks')                                                             || 'auto');
	elem.data('yticks_sec',      elem.data('yticks_sec')                                                         || 'auto');
	elem.data('yticks_prio',     elem.data('yticks_prio')                                                        || 'auto');
	elem.data('yticks_hide',     elem.data('yticks_hide')                                                        || false);
 	elem.data('yunit',           elem.data('yunit')                                                              || '' );
	elem.data('yunit_sec',       elem.data('yunit_sec')                                                          || '' );
	elem.data('ytext',           elem.data('ytext')                                                              || '' );
	elem.data('ytext_sec',       elem.data('ytext_sec')                                                          || '' );
	elem.data('style',           elem.data('style')                                                              || '' );
	elem.data('ptype',           elem.data('ptype')                                                              || 'lines' );
	elem.data('uaxis',           elem.data('uaxis')                                                              || 'primary' );
	elem.data('show_both_axes',  elem.data('show_both_axes')                                                     || false );
	elem.data('get',             elem.data('get')                                                                || 'STATE');
	elem.data('graphWidth',      91);
	elem.data('graphHeight',     87);
	elem.data('textWidth',       30);
	elem.data('textHeight',      9);
	elem.data('bottomOffset',    elem.data('noticks')?0:2*elem.data('textHeight'));
	elem.data('topOffset',       2*elem.data('textHeight'));
	elem.data('crosshair',       elem.data('crosshair')                                                          || false);
	elem.data('cursor_digits',   elem.data('cursor_digits')                                                      || 5);
	elem.data('crs_inactive',    elem.data('crs_inactive')                                                       || false);
	elem.data('legend',          elem.data('legend')                                                             || '');
	elem.data('showlegend',      elem.data('showlegend')                                                         || false);
	elem.data('legend_horiz',    elem.data('legend_horiz')                                                       || false);
	elem.data('nofulldays',      elem.data('nofulldays')                                                         || false);
	elem.data('prefetch',        elem.data('prefetch')                                                           || false);
	elem.data('legend_stacking', elem.data('legend_stacking')                                                    || false);
	elem.data('timeranges',      elem.data('timeranges')                                                         || '' );
	elem.data('margin',          elem.data('margin')                                                             || 2);
	elem.data('serverUTCOffset', elem.data('serverUTCOffset')                                                    || false);
	elem.data('graphsshown',     typeof elem.data('graphsshown') != 'undefined' ? elem.data('graphsshown')        : true);
	elem.data('cursorshown',     typeof elem.data('cursorshown') != 'undefined' ? elem.data('cursorshown')        : true);
	elem.data('filltime_start',  elem.data('filltime_start')                                                     || false);
	elem.data('filltime_end',    elem.data('filltime_end')                                                       || false);

	elem.data('filltime_end_save',elem.data('filltime_end'));

	elem.data('unusedYAxesVisible',!elem.data('yticks_hide'));

	var devName = ($.isArray(elem.data('logdevice')))?elem.data('logdevice')[0]:(elem.data('logdevice')!==undefined)?elem.data('logdevice'):elem.data('device');
	elem.data('device',       elem.data('device')                                                         || devName);

	widget_chart.unescapeData(data.yunit);
	widget_chart.unescapeData(data.yunit_sec);
	widget_chart.unescapeData(data.ytext);
	widget_chart.unescapeData(data.ytext_sec);

	widget_chart.checkAllData(this,elem,0,0,true);
	elem.data('baseDone',false);

	if (data.timeranges != '') {
		//data.timeranges.push(['Initial Value',data.daysago_start,data.daysago_end]); // add initial setting to list of timeranges if any
	}

	if (data.cliprange && $.isArray(data.cliprange)){
		if (!$.isArray(data.cliprange[0])) data.cliprange = [data.cliprange];
	} else { // data.cliprange needs to be an array or array of arrays
		data.cliprange = '';
	}
	
	if (data.xtext_offset && data.xtext_offset!='auto') { // convert text offset parameter to minutes eventually
		var dStr = data.xtext_offset;
		var classifier = ($.isNumeric(dStr))?'':dStr.charAt(dStr.length-1);	// check if last character of input string for 'd','D','w','W','m','M','y','Y'
		if (new RegExp("[hdwmy]").test(classifier) && dStr!='now') {dStr=dStr.slice(0,dStr.length-1);}
		if (!$.isNumeric(dStr)) {
			data.xtext_offset = undefined
		} else {
			dStr = parseFloat(dStr);
			switch(classifier) {
				case 'h':
					data.xtext_offset = dStr*60;
					break;
				case 'd':
					data.xtext_offset = dStr*60*24;
					break;
				case 'w':
					data.xtext_offset = dStr*60*24*7;
					break;
				case 'm':
					data.xtext_offset = dStr*60*24*365/12; // not really correct but used as estimation
					break;
				case 'y':
					data.xtext_offset = dStr*60*24*365; // not really correct but used as estimation
					break;
			}
		}
	}

    this.addReading(elem,'get');

	// need to add logdevice TYPE to devicestates for further checking
	var tdev = elem.data('device');
	elem.data('device',elem.data('logdevice'));
	elem.data('TYPE','TYPE');
    this.addReading(elem,'TYPE');
	elem.data('device',tdev);

	if (!Array.sum) {
	Array.prototype.sum = function(in_start,in_end) {
		var start = in_start!==undefined?in_start:0;
		var end = in_end!==undefined?in_end+1:this.length;
		start = Math.min(start,end);
		end = Math.max(start,end);
		var sum = 0;
		for (var i=start; i<end; i++) {
			if (this[i]!==undefined) sum += this[i];
		}
		return sum;
	};
	}
	if (!Array.max) {
	Array.prototype.max = function(in_start,in_end) {
		var start = in_start!==undefined?in_start:0;
		var end = in_end!==undefined?in_end+1:this.length;
		start = Math.min(start,end);
		end = Math.max(start,end);
		var max = -Infinity;
		for (var i=start; i<end; i++) {
			if (this[i]!==undefined && (this[i] > max)) max = this[i];
		}
		return max==-Infinity?0:max;
	};
	}
	if (!Array.clone) {
	Array.prototype.clone = function (reverse) {
		var i, copy;

		if (Array.isArray(this)) {
			copy = this.slice(0);
			for(i=0; i < copy.length; i++) {
				copy[i] = Array.isArray(copy[i])?copy[i].clone():copy[i];
			}
			return reverse?copy.reverse():copy;
		} else if((typeof this === 'object') && this!==null) {
			throw 'Cannot clone array containing an object!';
		} else {
			return reverse?this.reverse():this;
		}
			
	};
	}
	
	// caluclation of min and max values for x axis from dates
	Date.prototype.isLeapYear = function(inyear) {
		var year = (inyear!==undefined)?inyear:this.getFullYear();
		return (((year%4===0)&&(year%100!==0))||(year%400===0))?true:false;
	};
	Date.prototype.myGetDaysInMonth = function(inmonth) {
		var month = (inmonth!==undefined)?inmonth:this.getMonth();
		var year = this.getFullYear() + parseInt((month)/12);
		return [31,this.isLeapYear(year)?29:28,31,30,31,30,31,31,30,31,30,31][month%12];
	};
	Date.prototype.getDateStringFHEM = function() {
		return this.getFullYear()+'-'+(this.getMonth()+1).pad()+'-'+this.getDate().pad()+'T'+(this.getHours()-this.stdTimezoneOffset()/60).pad()+':'+this.getMinutes().pad()+':'+this.getSeconds().pad();
	};
	Date.prototype.getDaysInMonthSum = function(inmonth) {
		var month = this.getMonth()
		var startmonth = (inmonth!==undefined)?(inmonth<=month?inmonth:0):0;
		var ret = 0;
		for(var i=startmonth; i<=month; i++) {
			ret+=this.myGetDaysInMonth(i);
		}
		return ret;
	};
	Date.prototype.stdTimezoneOffset = function() { // helper function to check Daytime Savings
		var jan = new Date(this.getFullYear(), 0, 1);
		var jul = new Date(this.getFullYear(), 6, 1);
		return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
	};
	Date.prototype.dst = function() {				// helper function to check Daytime Savings
		return this.stdTimezoneOffset() - this.getTimezoneOffset();
	};
	Date.prototype.yyyy = function() {
		var yyyy = (this.getFullYear()).toString();
		return yyyy;
	};
	Date.prototype.yy = function() {
		var yy = (this.getFullYear()).toString().substring(2,4);
		return yy;
	};
	Date.prototype.MMMM = function() {
		var month_de = ['Januar','Februar','Maerz','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
		var month = ['January','February','March','April','May','June','July','August','September','October','November','December'];
		var userLang = navigator.language || navigator.userLanguage;
		if(userLang.split('-')[0] === 'de')
			return month_de[this.getMonth()];
		return month[this.getMonth()];
	};
	Date.prototype.MMM = function() {
		var month_de = ['Jan','Feb','Mrz','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'];
		var month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		var userLang = navigator.language || navigator.userLanguage;
		if(userLang.split('-')[0] === 'de')
			return month_de[this.getMonth()];
		return month[this.getMonth()];
	};
	Date.prototype.MM = function() {
		var mm = (this.getMonth()+1).toString();
		return (mm[1]?mm:"0"+mm[0]);
	};
	Date.prototype.dd = function() {
		var dd  = this.getDate().toString();
		return (dd[1]?dd:"0"+dd[0]);
	};
	Date.prototype.hh = function() {
		var hh  = this.getHours().toString();
		return (hh[1]?hh:"0"+hh[0]);
	};
	Date.prototype.mm = function() {
		var mm  = this.getMinutes().toString();
		return (mm[1]?mm:"0"+mm[0]);
	};
	Number.prototype.pad = function(size) {			// helper function for adding leading zeros to numbers.
		var s = String(this);
		while (s.length < (size || 2)) {s = "0" + s;}
		return s;
	};
	
	if (!String.prototype.repeat) { // some browsers do not support the string repeat so we add our own one here
		String.prototype.repeat = function(count) {
			var str = ''+this;
			var ret = '';
			for (var i=0, il=count; i<il; i++) {ret += str;}
			return ret;
		};
	};
	
	Math.log10_t = function(x) {return x>0?Math.log10(x):x==0?0:-Math.log10(-x);};
	Math.pow_t = function(x,y) {return y>0?Math.pow(x,y):y==0?0:-Math.pow(x,-y);};
	
	if (Math.log10 === undefined) { // hack for unavailability of log10 function on MS IE and others
		Math.log10 = function (x) {
			if (x>0) {
				return Math.log(x) / Math.LN10;
			} else if (x==0) {
				return -Infinity;
			} else {
				return -Math.log(-x) / Math.LN10;
			}
		};
	}

	data.days_start = widget_chart.getDaysAgo(data.daysago_start,data);
	if (isNaN(data.days_start)) data.days_start = 0;
	data.days_end = widget_chart.getDaysAgo(data.daysago_end,data);
	if (isNaN(data.days_end)) data.days_end = data.days_start-1;
	if (data.days_start == data.days_end)
		if (data.daysago_start=='now') data.days_start++; else data.days_end--;
	data.shift = 0;
	data.scale = 1;
	elem.data(data);
	widget_chart.doLog("widget_chart.init_attr","Attributes initialized with " + data.days_start + data.days_end);
}

function init () { // initialization of widget, run at widget creation/reload
	var base=this;

	this.elements = $('div[data-type="'+this.widgetname+'"]',this.area);
	widget_chart.instance=$(document).find("[class^=basesvg]").length;

	this.elements.each(function(index) {
		var elem = $(this);
		var data = elem.data();

		base.init_attr(elem);
		base.init_ui(elem);

		data.getDefaultSize = function(obj) {
			this.defaultHeight = obj.hasClass('fullsize') ? obj[0].getBoundingClientRect().height*0.85 : 300;		
			if (obj.hasClass('fitsize')) {
				var fullheight = obj.parent()[0].getBoundingClientRect().height;
				var siblingheights = 0;
				obj.siblings().each(function() {
					var overflow = this.style.overflow;
					this.style.overflow = 'hidden';
					siblingheights += this.getBoundingClientRect().height;
					this.style.overflow = overflow;
				});
				this.defaultHeight = fullheight - siblingheights;
			}
			this.defaultWidth = '93%';
		}

		data.getDefaultSize(elem);

		function showDone(e) {e.data('initialized',true);} // set initialized value on return of show() function we have to wait for this before doing the refresh
		if (elem.find("[class^=basesvg]").length <= 0) { // there is no basesvg for this instance existing yet, create one
			widget_chart.instance++;

			var svgElement = $(
				'<svg class="basesvg' + widget_chart.instance + '" style="overflow: visible">'+
				'<g id="classesContainer" stroke="grey"></g>' +
				'</svg>');
			svgElement.appendTo(elem)
				.css("width",elem.data('width') || data.defaultWidth)
				.css("height",elem.data('height') || data.defaultHeight);
			svgElement.show(10,showDone(elem));

			data.timers={'running':false};
			data.instance=widget_chart.instance;

			var gs = [];
			var graphsshown_array = elem.data('graphsshown');
			for (var k=0, ll=widget_chart.getnGraphs(elem.data()); k<ll; k++) {gs[k]=widget_chart.getArrayValue(graphsshown_array,k,true);}
			data.graphsshown = gs;
			var cs = [];
			var cursorshown_array = elem.data('cursorshown');
			for (var k=0, ll=widget_chart.getnGraphs(elem.data()); k<ll; k++) {cs[k]=widget_chart.getArrayValue(cursorshown_array,k,true);}
			data.cursorshown = cs;
		} else {
			elem.find("[class^=basesvg]"+widget_chart.instance)
				.css("width",elem.data('width') || data.defaultWidth)
				.css("height",elem.data('height') || data.defaultHeight);
		}

		widget_chart.doLog("widget_chart.init","Module initialized with width: "+ (elem.data('width')||elem.data.defaultWidth) + " height: " + (elem.data('height')||elem.data.defaultHeight));
		$(this).data(data);

		//base.refresh.apply(this);

	});
}

function init_ui (elem) {
}

function update (dev,par) {
	var deviceElements= this.elements.filter("div[data-logdevice]");
	var prev_width = [];
	widget_chart.doLog("widget_chart.update","Update triggered with: " + dev + ":" + par);
	var obj = this;

	deviceElements.each(function(index) {
		var elem = $(this);
		widget_chart.checkAllData(obj,elem,dev,par,false);
	});

	function waitForInitialization(base,instance,type,i) {
		var data=$(base).data();
		var svg_old = $(base).find('svg.basesvg'+data.instance);
		var time = (data.initdelay)?data.initdelay:100;
		var initialized = data.initialized;
		if (isNaN(widget_chart.pendingUpdateRequests[data.instance])) widget_chart.pendingUpdateRequests[data.instance] = 0; //initialize if not already done
		widget_chart.pendingUpdateRequests[data.instance]++;
		//widget_chart.doLog("widget_chart.update","Pending Update Requests for instance "+data.instance+": " + widget_chart.pendingUpdateRequests[data.instance]);
		
		setTimeout(function(){
			if (!initialized||isNaN(svg_old.height())||isNaN(svg_old.width())||prev_width[data.instance]!=svg_old.width()||(!svg_old.parent().is(':visible'))) {
				prev_width[data.instance] = svg_old.width(); // we need to wait until the size does not change any more (e.g. when fading in)
				waitForInitialization(base,data.instance,type,i);
				widget_chart.pendingUpdateRequests[data.instance]--;
				//widget_chart.doLog("widget_chart.update","Pending Update Requests for instance "+data.instance+": " + widget_chart.pendingUpdateRequests[data.instance]);
			} else {
				widget_chart.pendingUpdateRequests[data.instance]--;
				//widget_chart.doLog("widget_chart.update","Pending Update Requests for instance "+data.instance+": " + widget_chart.pendingUpdateRequests[data.instance]);
				if (widget_chart.pendingUpdateRequests[data.instance] <= 0 && !data.runningRefresh) { // wait until all pendinng function calls to waitForInitialization are done and no non finalized redraw is pending
					widget_chart.refresh(base,type);
					widget_chart.doLog("widget_chart.update","Pending Update done in "+data.instance);
				}
			}
		},time);
	}

	deviceElements.each(function(index) {
		var elem = $(this);
		var isLogdevice = ($.isArray(elem.data('logdevice')))?elem.data('logdevice').join(',').search(dev)>=0:(typeof elem.data('logdevice') == 'string')?elem.data('logdevice')==dev:false;
		if (elem.data('device')) {
			var isDevice = ($.isArray(elem.data('device')))?elem.data('device').join(',').search(dev)>=0:(typeof elem.data('device') == 'string')?elem.data('device')==dev:false;
			isLogdevice = isLogdevice || isDevice;
		}

		if ( elem.data('get')==par && isLogdevice ) {
			prev_width[elem.data('instance')] = elem.find('svg.basesvg'+elem.data('instance')).width();
			if (elem.is(':visible')) { // element is visible, we can refresh it right away
				waitForInitialization(elem,elem.data('instance'),'start'); // need to be sure that window is initialized (e.g. to get right width/height)
			} else { // element is not yet visible (e.g. inside popup), do "refresh" only when popup opens.
				elem.visibilityChanged({callback: function(event) {
						//widget_chart.doLog("widget_chart.update",'----> Visibility Changed for instance ' + elem.data('instance') + " and visibility " + elem.is(':visible'));
						var theObj = $("html").find("[class^=basesvg"+elem.data('instance')+"]").parent();
						theObj.each( function(index) {waitForInitialization($(this),$(this).data('instance'),'startpopup');});
					},
					runOnLoad: false,
					frequency: 500
				});
			}
		}
	});
}

var Modul_chart = function() {
    return $.extend(new Modul_widget(), {
        //override or own public members
        widgetname: 'chart',
		init: init,
		init_ui: init_ui,
        init_attr: init_attr,
        update: update,
    });
};
