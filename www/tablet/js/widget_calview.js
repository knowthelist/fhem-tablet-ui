// Initial Version from Chris1284
// Modifications for 2.2 klausw	4.7.2016
// Modifications for 2.4 mario stephan	2.12.2016
// Modifications for 2.6 chris1284 08.12.2016 - Ursprüngliche Darstellung wieder hergestellt
// Modifications for 2.8 chris1284 28.12.2016 - widget an aktuelle calview angepasst
// Modifications / user wishes chris1284 13.09.2017
// Modifications chris1284 13.09.2017 19:05 - nur noch oneline yes/no , onelinesum/desc/loc entfernt)
// Modifications chris1284 11.10.2017 - new reading weekdayname
// Modifications chris1284 29.01.2018 - fixed showempty
// Modifications OdfFhem 28.10.2018 - fixed showempty 
//                                  - removed code for unsupported onlinesum/desc/loc
//                                  - introduced colCounter (sourcecolor isn't a real column)
//                                  - no substr for column 'age'
//                                  - corrected class for row in case of automatic width calculation
//                                  - added missing fields in case of automatic width calculation
//                                  - added support for data-class in case of automatic width calculation
//                                  - added support for data-oneline in case of automatic width calculation
// Modifications OdfFhem 08.01.2019 - extension for attribute data-showempty ('true', 'false' or 'individual text')
//                                  - new attribute data-header
//                                  - new attribute data-headercolor
// Modifications OdfFhem 27.04.2019 - adding support for reading "duration"
//                                  - adding support for reading "weekday"
//                                  - usage of "use strict"
//                                  - usage of "init_attr" instead of "init"
//                                  - new attribute data-daysleft-values
//                                  - new attribute data-daysleft-classes
//                                  - new attribute data-daysleft-colors
//                                  - new attribute data-daysleft-background-colors
//                                  - new attribute data-header-background-color
//                                  - new attribute data-header-class
//                                  - renamed attribute data-headercolor to data-header-color
//                                  - new attribute data-background-color
//                                  - code changes for better performance due to the many subscriptions
//                                  - usage of "init_ui"
//                                  - fixed swiper functionality
//                                  - new attribute data-swiper-autoplay
//                                  - new attribute data-swiper-effect
//                                  - new attribute data-swiper-pagination
//                                  - new attribute data-swiper-navbuttons
//                                  - code changes for usage of mostly all features even in swiperstyle
//                                  - new attribute data-class-usage
//                                  - new auto-class 'calview'
//                                  - new auto-class 'calview-row-header','calview-col-header'
//                                  - new auto-class 'calview-row','calview-col'
//                                  - new auto-class 'calview-row-daysleft-n','calview-col-daysleft-n' ; n=1..data-daysleft-values.length

/* global ftui:true, Modul_widget:true */

"use strict";

function depends_calview() {
    var deps = [];

    if (!$('link[href$="lib/swiper.min.css"]').length) {
        deps.push(ftui.config.basedir + 'lib/swiper.min.css');
    }

    if (!$.fn.Swiper) {
        deps.push(ftui.config.basedir + "lib/swiper.jquery.min.js");
    }

    return deps;
}

var Modul_calview = function () {

  function init_attr(elem) {
    elem.initData('background-color','');
    elem.initData('class','');
    elem.initData('class-usage','col');
    elem.initData('color','');
    elem.initData('dateformat','long');
    elem.initData('daysleft-background-colors',[]);
    elem.initData('daysleft-classes',[]);
    elem.initData('daysleft-colors',[]);
    elem.initData('daysleft-values',[]);
    elem.initData('detail',["age","bdate","bdatetimeiso","btime","categories","daysleft","daysleftLong","description","duration","edate","edatetimeiso","etime","location","source","sourcecolor","summary","timeshort","weekday","weekdayname"]);
    elem.initData('detailwidth',[]);
    elem.initData('get','STATE');
    elem.initData('header',[]);
    elem.initData('header-background-color','');
    elem.initData('header-class','');
    elem.initData('header-color','');
    elem.initData('max',10);
    elem.initData('oneline','no');
    elem.initData('showempty','true');
    elem.initData('sourcecolor','no');
    elem.initData('start','all');
    elem.initData('swiperstyle','no');
    elem.initData('swiper-autoplay',null);
    elem.initData('swiper-effect','flip'); // 'slide'
    elem.initData('swiper-navbuttons','no');
    elem.initData('swiper-pagination','yes');
    elem.initData('timeformat','long');

    if (elem.data('get') == 'today' || elem.data('get') == 'tomorrow' || elem.data('get') == 'all') {
      elem.initData('c-term', 'c-term');
      elem.initData('c-today', 'c-today');
      elem.initData('c-tomorrow', 'c-tomorrow');
			me.addReading(elem, 'c-' + ((elem.data('get') == 'all') ? "term" : elem.data('get')));

      var readingPrefix = ((elem.data('get') == 'all') ? "t" : elem.data('get'))

			for (var i4row = 1; i4row <= elem.data('max'); i4row++) {
			  var num = "00" + i4row;
			  num = num.slice(-3);

        var daysleft_added = false;

			  elem.data('detail').forEach(function(column) {
			    if (column == 'sourcecolor') {
			    } else {
			      elem.initData(readingPrefix + '_' + num + '_' + column, readingPrefix + '_' + num + '_' + column);
			      me.addReading(elem, readingPrefix + '_' + num + '_' + column);

            if (column == "daysleft") { daysleft_added = true; }
			    }
			  });

			  if (elem.data('sourcecolor') == 'yes') {
			    elem.initData(readingPrefix + '_' + num + '_' + 'sourcecolor', readingPrefix + '_' + num + '_' + 'sourcecolor');
			    me.addReading(elem, readingPrefix + '_' + num + '_' + 'sourcecolor');
			  }

        if ((daysleft_added == false) && (elem.data('daysleft-values').length > 0)) {
		      elem.initData(readingPrefix + '_' + num + '_' + 'daysleft', readingPrefix + '_' + num + '_' + 'daysleft');
   	      me.addReading(elem, readingPrefix + '_' + num + '_' + 'daysleft');
        }
			}
    } else {
      me.addReading(elem, 'get');
    }
  }

  function init_ui(elem) {
    elem.addClass('calview');

    if (elem.data('swiperstyle') == 'yes') {
      var elemContainer = null;
      var elemWrapper = null;
      var elemPagination = null;
      var elemPrev = null;
      var elemNext = null;

      elemContainer = $('<div/>')
          .addClass('swiper-container')
          .appendTo(elem);
      elemContainer.css({
         'height': 'auto'
      });

      elemWrapper = $('<div/>')
          .addClass('swiper-wrapper')
          .appendTo(elemContainer);
      elem.data('slides', elemWrapper);

      if (elem.data('swiper-pagination') == 'yes') {
        elemPagination = $('<div style=\"position:static;\"></div>')
            .addClass('swiper-pagination')
            .appendTo(elemContainer);
      }

      if (elem.data('swiper-navbuttons') == 'yes') {
        elemPrev = $('<div/>')
            .addClass('swiper-button-prev')
            .appendTo(elemContainer);
        elemNext = $('<div/>')
            .addClass('swiper-button-next')
            .appendTo(elemContainer);
      }

      var swiper = new Swiper(elemContainer, {
        pagination: elemPagination,
        paginationClickable: true,
        nextButton: elemNext,
        prevButton: elemPrev,
        autoplay: elem.data('swiper-autoplay'),
        autoHeight: false,
        autoplayDisableOnInteraction: false,
        centeredSlides: true,
        direction: 'horizontal',
        effect: elem.data('swiper-effect'),
        speed: 500,
        observer: true,
        observeParents: true
      });
      elem.data('swiper', swiper);
    }
  }

  function refresh(index,elem) {
    var myheader = "";
    var mytext = "";
    elem.getReading('c-term').val;
    elem.getReading('c-today').val;
    elem.getReading('c-tomorrow').val;

    if (elem.data('swiperstyle') == 'yes') {
      var slides =  elem.data('slides');

      $.each(slides.children(), function(index, value) {
        value.remove();
      });
    } else {
    }

    if (elem.data('get') == 'STATE') {
      if (ftui.isValid(elem.getReading('get').val)) {
        if (elem.data('swiperstyle') == 'yes') {
          mytext = "<div class=\"swiper-slide\">";
            mytext += "<div class=\"hbox\" style=\"" + ((elem.data('swiper-navbuttons') == "yes") ? "width:95%;" : "")+ "\">";
              mytext += "<div>" + elem.getReading('get').val + "</div>";
            mytext += "</div>";
          mytext += "</div>";

          slides.last().append(mytext);
        } else {
          mytext = "<div class=\"hbox cell\">" + elem.getReading('get').val + "</div>";
        }
      }
    }
    else if (elem.data('get') == 'today' || elem.data('get') == 'tomorrow' || elem.data('get') == 'all') {
      if (elem.data('get') == 'all') {
        var readingPrefix = "t"; var count = elem.getReading('c-term').val;
      } else if (elem.data('get') == 'today') {
        var readingPrefix = "today"; var count = elem.getReading('c-' + elem.data('get')).val;
      }	else if (elem.data('get') == 'tomorrow') {
        var readingPrefix = "tomorrow"; var count = elem.getReading('c-' + elem.data('get')).val;
      }

      var start = 1;
      if (elem.data('start') == "notoday") {
        start = 1 + parseInt(elem.getReading('c-today').val);
      } else if (elem.data('start') == "notomorrow") {
        start = 1 + parseInt(elem.getReading('c-today').val) + parseInt(elem.getReading('c-tomorrow').val);
      }

      if (count == 0) {
        var showempty_text = "" + elem.data('showempty'); // Typwandlung notwendig

        if (showempty_text != "false") {
          if (showempty_text == "true") {
            var zeitrahmen = {
              "today": "Heute ",
              "tomorrow": "Morgen ",
              "t": "" // "all"
            };

            showempty_text = zeitrahmen[readingPrefix] + "keine Termine";
          }

          if (elem.data('swiperstyle') == 'yes') {
            mytext = "<div class=\"swiper-slide\">";
              mytext += "<div class=\"hbox\" style=\"" + ((elem.data('swiper-navbuttons') == "yes") ? "width:95%;" : "")+ "\">";
                mytext += "<div>" + showempty_text + "</div>";
              mytext += "</div>";
            mytext += "</div>";

            slides.last().append(mytext);
          } else {
            mytext += "<div class=\"hbox cell\">" + showempty_text + "</div>";
          }
        }
      } else {
        if (count > elem.data('max')) {
          count = elem.data('max');
        }

        var datesubstr = (elem.data('dateformat') == 'short') ? 6 : 10;
        var timesubstr = (elem.data('timeformat') == 'short') ? 5 : 8;
        var onelinestyle = (elem.data('oneline') === "yes") ? "white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" : "";

        var colCounter = 0;
        elem.data('detail').forEach(function(spalte) {
          if (spalte == 'sourcecolor') {} else {colCounter += 1}
        });

        var class4data = elem.data('class');
        var foregroundColor4data = elem.data('color');
        var backgroundColor4data = elem.data('background-color');

        var autoClass4row4header = "calview-row-header";
        var autoClass4col4header = "calview-col-header";
        var class4header = elem.data('header-class');
        var foregroundColor4header = elem.data('header-color');
        var backgroundColor4header = elem.data('header-background-color');

        var daysleftValues = elem.data('daysleft-values');
        var daysleftClasses = elem.data('daysleft-classes');
        var daysleftColors = elem.data('daysleft-colors');
        var daysleftBackgroundColors = elem.data('daysleft-background-colors');

        for (var i4row = start; i4row <= count; i4row++) {
          var num = "00" + i4row;
          num = num.slice(-3);

          var width = (elem.data('detailwidth').length > 0) ? null : (100 / colCounter);

          var daysleftIndex = -1;
          if (daysleftValues && $.isArray(daysleftValues)) {
            for (var t = 0, len = daysleftValues.length; t < len; t++) {
              if (elem.getReading(readingPrefix+'_'+num+'_daysleft').val <= parseInt(daysleftValues[t])) {
                daysleftIndex = t;
                break;
              }
            }
          }

          var autoClass4row = "calview-row";
          var autoClass4col = "calview-col";
          var class4i = class4data;
          var foregroundColor4i = foregroundColor4data;
          var backgroundColor4i = backgroundColor4data;

          if (elem.data('sourcecolor') == 'yes') {
            foregroundColor4i = elem.getReading(readingPrefix+'_'+num+'_sourcecolor').val;
          }              

          if (daysleftIndex >= 0) {
            var autoClass4row = autoClass4row + "-daysleft-" + (daysleftIndex + 1);
            var autoClass4col = autoClass4col + "-daysleft-" + (daysleftIndex + 1);

            if (daysleftClasses[daysleftIndex]) { class4i = daysleftClasses[daysleftIndex]; }
            if (daysleftColors[daysleftIndex]) { foregroundColor4i = daysleftColors[daysleftIndex]; }
            if (daysleftBackgroundColors[daysleftIndex]) { backgroundColor4i = daysleftBackgroundColors[daysleftIndex]; }
          }

          var i4column = 0;

          function getText4Spalte(spalte,header,datesubstr,timesubstr) {
            var text4spalte = "";

            var class4spalte = ((header) ? autoClass4col4header : autoClass4col)
                             + " " + ((elem.data('class-usage') == 'col') ? ((header) ? class4header : class4i) : "");
            var foregroundColor4spalte = (header) ? foregroundColor4header : foregroundColor4i;
            var backgroundColor4spalte = (header) ? backgroundColor4header : backgroundColor4i;

            var val4spalte = "";
            if (header) {
              val4spalte = elem.data('header')[i4column];
            } else if (datesubstr) {
              val4spalte = elem.getReading(readingPrefix+'_'+num+'_'+spalte).val.substr(0, datesubstr);
            } else if (timesubstr) {
              val4spalte = elem.getReading(readingPrefix+'_'+num+'_'+spalte).val.substr(0, timesubstr);
            } else {
              val4spalte = elem.getReading(readingPrefix+'_'+num+'_'+spalte).val;
            }

            text4spalte += "<div"
                             + ((class4spalte) ? " class=\"" + class4spalte + "\"" : "")
                             + " style=\""
                                 + ((foregroundColor4spalte) ? "color:" + foregroundColor4spalte + ";" : "")
                                 + ((backgroundColor4spalte) ? "background-color:" + backgroundColor4spalte + ";" : "")
                                 + "width:" + ((width) ? width : elem.data('detailwidth')[i4column]) + "%;"
                                 + onelinestyle
                                 + "\""
                             + ">"
                         + ((val4spalte) ? val4spalte : "&nbsp;")
                         + "</div>";

            return text4spalte;
          }

          if (elem.data('swiperstyle') == 'yes') {
            mytext = "<div class=\"swiper-slide\">";
              mytext += "<div" + " class=\"hbox"
                                        + " " + autoClass4row
                                        + " " + ((elem.data('class-usage') == 'row') ? class4i : "")
                                        + "\""
                               + " style=\"" + ((elem.data('swiper-navbuttons') == "yes") ? "width:95%;" : "")
                                        + "\""
                               + ">";
                elem.data('detail').forEach(function(spalte) {
                  if (typeof elem.getReading(readingPrefix+'_'+num+'_'+spalte).val != "undefined") {
                    if ((spalte == 'bdate') || (spalte == 'edate')) {
                      mytext += getText4Spalte(spalte,"",datesubstr,null);
                    } else if ((spalte == 'btime') || (spalte == 'etime')) {
                      mytext += getText4Spalte(spalte,"",null,timesubstr);
                    } else {
                      mytext += getText4Spalte(spalte,"",null,null);
                    }
                  }

                  i4column++;
                });
              mytext += "</div>";
            mytext += "</div>";

            slides.last().append(mytext);
          } else {
            if (i4row == start) { myheader += "<div" + " class=\"hbox cell"
                                                              + " " + autoClass4row4header
                                                              + " " + ((elem.data('class-usage') == 'row') ? class4header : "")
                                                              + "\""
                                                     + " style=\"height:auto;"
                                                              + "\""
                                                     + ">"; }
            mytext += "<div" + " class=\"hbox cell"
                                      + " " + autoClass4row
                                      + " " + ((elem.data('class-usage') == 'row') ? class4i : "")
                                      + "\""
                             + " style=\"height:auto;\""
                             + ">";

            elem.data('detail').forEach(function(spalte) {
              if (spalte == 'sourcecolor') {
              } else if (typeof elem.getReading(readingPrefix+'_'+num+'_'+spalte).val == "undefined") {
              } else {
                if (i4row == start) {myheader += getText4Spalte(spalte,"h",null,null);}

                if ((spalte == 'bdate') || (spalte == 'edate')) {
                  mytext += getText4Spalte(spalte,"",datesubstr,null);
                } else if ((spalte == 'btime') || (spalte == 'etime')) {
                  mytext += getText4Spalte(spalte,"",null,timesubstr);
                } else {
                  mytext += getText4Spalte(spalte,"",null,null);
                }
              }

              i4column++;
            });

            if (i4row == start) { myheader += "</div>"; }
            mytext += "</div>";
          }
        }
      }
    }

    if (elem.data('swiperstyle') == 'yes') {
      if (elem.data('swiper-autoplay') != null) {
        var swiper = elem.data('swiper');
        swiper.startAutoplay();
      }
    } else {
      var myhtml = (((elem.data('header').length > 0) ? myheader : "") + mytext);
      
      // myhtml = "<div class=\"vbox\">" + myhtml + "</div>";

      elem.html(myhtml);
    }
  }

  function update(dev, par) {
    me.elements.filter('div[data-device="' + dev + '"]')
    .each(function (index) {
      var elem = $(this);

      var oldTimeout = elem.data('timeout');
      if (oldTimeout) { clearTimeout(oldTimeout); }

      var newTimeout = setTimeout(refresh,100,index,elem);
      elem.data('timeout',newTimeout);
    });
  }

  var me = $.extend(new Modul_widget(), {
    widgetname: 'calview',
    init_attr: init_attr,
    init_ui: init_ui,
    update: update
  });

  return me;
};
