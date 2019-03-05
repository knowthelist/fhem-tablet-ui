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

/* global ftui:true, Modul_widget:true */

var Modul_calview = function () {
  var readings = [];

  function init() {
    me.elements = $('div[data-type="' + me.widgetname + '"]:not([data-ready])', me.area);
    me.elements.each(function (index) {
      var elem = $(this);
      elem.attr("data-ready", "");
      // Standardwerte fuer Parameter
      elem.initData('max', 10);
      elem.initData('get', 'STATE');
      elem.initData('start', 'all');
      elem.initData('color', '');
      elem.initData('class', '');
      elem.initData('detail', ["bdate", "btime","bdatetimeiso","timeshort","summary", "location","edate","etime","edatetimeiso","source","sourcecolor","age","description","categories","daysleft","daysleftLong","weekdayname"]);
      elem.initData('detailwidth', []);
      elem.initData('dateformat', 'long');
      elem.initData('timeformat', 'long');
      elem.initData('sourcecolor', 'no');
      elem.initData('showempty', 'true');
      elem.initData('swiperstyle', 'no');
      elem.initData('oneline', 'no');
      elem.initData('header', []);
      elem.initData('headercolor', '');

      var device = $(this).data('device');
      // console.log("device: " + device + " get: " + $(this).data('get') + " max: " + $(this).data('max'));
      if ($(this).data('get') == 'today' || $(this).data('get') == 'tomorrow' || $(this).data('get') == 'all') {
        elem.initData('c-term', 'c-term');
        elem.initData('c-today', 'c-today');
        elem.initData('c-tomorrow', 'c-tomorrow');
        var value = $(this).data('max');
        var wann = $(this).data('get');

        if (wann == "all") {
          wann = "term";
        }
        me.addReading(elem, 'c-' + wann);
        //console.log("c-" + wann + ": " + elem.getReading('c-' + wann).val);
        if (wann == "term") {
          wann = "t";
        }
        for (var i = 1; i <= value; i++) {
          num = "00" + i;
          num = num.slice(-3);
          elem.data('detail').forEach(function (wert) {
            if (wert == 'sourcecolor') {
            } else {
              elem.initData(wann + '_' + num + '_' + wert, wann + '_' + num + '_' + wert);
              me.addReading(elem, wann + '_' + num + '_' + wert);
              //console.log(wann + '_' + num + '_' + wert + ': ' + elem.getReading(wann + '_' + num + '_' + wert).val);
            }
          });
          //elem.initData(wann + '_' + num + '_sourcecolor', wann + '_' + num + '_sourcecolor');
          if (elem.data('sourcecolor') == 'yes') {
	          elem.initData(wann + '_' + num + '_' + 'sourcecolor', wann + '_' + num + '_' + 'sourcecolor');
            me.addReading(elem, wann + '_' + num + '_' + 'sourcecolor');
          }
        }
      }
    });
  }

  function update(dev, par) {
    me.elements.filter('div[data-device="' + dev + '"]')
    .each(function (index) {
      var elem = $(this);
      var deviceElements;
      var myheader = "";
      var mytext = "";
      var num;
      var color = elem.data('color');
      elem.css("color", ftui.getStyle('.' + color, 'color') || color);			
      elem.getReading('c-term').val;
      elem.getReading('c-today').val;
      elem.getReading('c-tomorrow').val;
      //alert(color);
      if (elem.data('get') == 'STATE') {
        if (ftui.isValid(elem.getReading('get').val)) { mytext = "<div class=\"cell\" data-type=\"label\">" + elem.getReading('get').val + "</div>"; }
      } 
      else if (elem.data('get') == 'today' || elem.data('get') == 'tomorrow' || elem.data('get') == 'all') {
        var beginn = 1;

        if (elem.data('get') == 'all') {
          var readingPrefix = "t"; var count = elem.getReading('c-term').val;
        } else if (elem.data('get') == 'today') {
          var readingPrefix = "today"; var count = elem.getReading('c-' + elem.data('get')).val;
        }	else if (elem.data('get') == 'tomorrow') {
          var readingPrefix = "tomorrow"; var count = elem.getReading('c-' + elem.data('get')).val;
        }

        if (elem.data('start') == "notoday") {
          beginn = 1 + parseInt(elem.getReading('c-today').val);
        } else if (elem.data('start') == "notomorrow") {
          beginn = 1 + parseInt(elem.getReading('c-today').val) + parseInt(elem.getReading('c-tomorrow').val);
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

            mytext += "<div data-type=\"label\">" + showempty_text + "</div>";
          }
        } else {
          if (count > elem.data('max')) {
            count = elem.data('max');
          }

					if (elem.data('dateformat') == 'short'){ datesubstr = 6;}	else {datesubstr = 10;}
					if (elem.data('timeformat') == 'short'){ timesubstr = 5;}	else {timesubstr = 8;}
					var onelinestyle   = "";
					if (elem.data('oneline') === "yes") { onelinestyle = "white-space:nowrap;overflow:hidden;text-overflow:ellipsis;";}

					// Anzahl darstellbarer Spalten ermitteln
					// elem.data('detail').length
					var colCounter = 0;
					elem.data('detail').forEach(function (spalte) {
            if (spalte == 'sourcecolor') {} else {colCounter += 1}
        	});

    			var headercolor = color;
					if (elem.data('headercolor') != '') {headercolor = elem.data('headercolor');}

					if (elem.data('swiperstyle') == 'no') {
						for (var i = beginn; i <= count; i++) {
							num = "00" + i;
							num = num.slice(-3);
							var mycount = 0;
  						var $width = (elem.data('detailwidth').length > 0) ? null : (100 / colCounter);

							function getText4Spalte(spalte,header,datesubstr,timesubstr) {
								var text4spalte = "";

								text4spalte += "<div data-type=\"label\""
																 + " class=\""	+elem.data('class')	+ "\""
																 + " style=\"color:" + ((header) ? headercolor : color)
																		 + ";width:" + (($width) ? $width : elem.data('detailwidth')[mycount]) + "%"
																		 + ";" + onelinestyle
																 + "\">";
								if (header) {
									text4spalte += elem.data('header')[mycount];
								} else if (datesubstr) {
									text4spalte += elem.getReading(readingPrefix+'_'+num+'_'+spalte).val.substr(0, datesubstr);
								} else if (timesubstr) {
									text4spalte += elem.getReading(readingPrefix+'_'+num+'_'+spalte).val.substr(0, timesubstr);
								} else {
									text4spalte += elem.getReading(readingPrefix+'_'+num+'_'+spalte).val;
								}
								text4spalte += "</div>";

								return text4spalte;
							}

							if (i == beginn) {myheader += "<div class=\"hbox cell\" style=\"height:auto;\">";}
							mytext += "<div class=\"hbox cell\" style=\"height:auto;\">";
							elem.data('detail').forEach(function(spalte) {
								if (typeof elem.getReading(readingPrefix+'_'+num+'_'+spalte).val != "undefined") {
									if (elem.data('sourcecolor') == 'yes') {color = elem.getReading(readingPrefix+'_'+num+'_sourcecolor').val;}

                  if ((i == beginn) && (spalte != 'sourcecolor')) {myheader += getText4Spalte(spalte,"h",null,null);}
 
									if (spalte == 'age')          {mytext += getText4Spalte(spalte,"",null,null);}
									if (spalte == 'bdate')        {mytext += getText4Spalte(spalte,"",datesubstr,null);}
									if (spalte == 'bdatetimeiso') {mytext += getText4Spalte(spalte,"",null,null);}
									if (spalte == 'btime')        {mytext += getText4Spalte(spalte,"",null,timesubstr);}
									if (spalte == 'categories')   {mytext += getText4Spalte(spalte,"",null,null);}
									if (spalte == 'daysleft')     {mytext += getText4Spalte(spalte,"",null,null);}
									if (spalte == 'daysleftLong') {mytext += getText4Spalte(spalte,"",null,null);}
									if (spalte == 'description')  {mytext += getText4Spalte(spalte,"",null,null);}
									if (spalte == 'edate')        {mytext += getText4Spalte(spalte,"",datesubstr,null);}
									if (spalte == 'etime')        {mytext += getText4Spalte(spalte,"",null,timesubstr);}
									if (spalte == 'edatetimeiso') {mytext += getText4Spalte(spalte,"",null,null);}
									if (spalte == 'location')     {mytext += getText4Spalte(spalte,"",null,null);}
									if (spalte == 'source')       {mytext += getText4Spalte(spalte,"",null,null);}
									if (spalte == 'sourcecolor')  {}
									if (spalte == 'summary')      {mytext += getText4Spalte(spalte,"",null,null);}
									if (spalte == 'timeshort')    {mytext += getText4Spalte(spalte,"",null,null);}
									if (spalte == 'weekdayname')  {mytext += getText4Spalte(spalte,"",null,null);}

									mycount++;
								}
							});
							myheader += "</div>";
							mytext += "</div>";
						}
					} else if (elem.data('swiperstyle') == 'yes') {
						mytext += "<div class=\"cell\">";
						mytext += "<div class=\"swiper-container\">";
						mytext += "<div class=\"swiper-wrapper\">";
						for (var i = beginn; i <= count; i++) {
							num = "00" + i;
							num = num.slice(-3);
							var $width = 100 / colCounter;
							//alert($width);
							mytext += "<div class=\"swiper-slide\" data-hash=\"slide"+i+"\";>";
							mytext += "<div class=\"hbox\">";
							elem.data('detail').forEach(function(spalte) {
								if (typeof elem.getReading(readingPrefix+'_'+num+'_'+spalte).val != "undefined") {
									if (spalte == 'bdate') {mytext += "<div class=\"\" style=\"color:"+color+";width:"+$width+"%;\">" + elem.getReading(readingPrefix+'_'+num+'_'+spalte).val + "</div>";}
									if (spalte == 'btime') {mytext += "<div class=\"\" style=\"color:"+color+";width:"+$width+"%;\">" + elem.getReading(readingPrefix+'_'+num+'_'+spalte).val + "</div>";}
									if (spalte == 'bdatetimeiso') {mytext += "<div class=\"\" style=\"color:"+color+";width:"+$width+"%;\">" + elem.getReading(readingPrefix+'_'+num+'_'+spalte).val + "</div>";}
									if (spalte == 'summary') {mytext += "<div class=\"\" style=\"color:"+color+";width:"+$width+"%;\">" + elem.getReading(readingPrefix+'_'+num+'_'+spalte).val + "</div>";}
									if (spalte == 'location') {mytext += "<div class=\"\" style=\"color:"+color+";width:"+$width+"%;\">" + elem.getReading(readingPrefix+'_'+num+'_'+spalte).val + "</div>";}
									if (spalte == 'edate') {mytext += "<div class=\"\" style=\"color:"+color+";width:"+$width+"%;\">" + elem.getReading(readingPrefix+'_'+num+'_'+spalte).val + "</div>";}
									if (spalte == 'etime') {mytext += "<div class=\"\" style=\"color:"+color+";width:"+$width+"%;\">" + elem.getReading(readingPrefix+'_'+num+'_'+spalte).val + "</div>";}
									if (spalte == 'edatetimeiso') {mytext += "<div class=\"\" style=\"color:"+color+";width:"+$width+"%;\">" + elem.getReading(readingPrefix+'_'+num+'_'+spalte).val + "</div>";}
									if (spalte == 'source') {mytext += "<div class=\"\" style=\"color:"+color+";width:"+$width+"%;\">" + elem.getReading(readingPrefix+'_'+num+'_'+spalte).val + "</div>";}
									if (spalte == 'description') {mytext += "<div class=\"\" style=\"color:"+color+";width:"+$width+"%;\">" + elem.getReading(readingPrefix+'_'+num+'_'+spalte).val + "</div>";}
									if (spalte == 'daysleft') {mytext += "<div class=\"\" style=\"color:"+color+";width:"+$width+"%;\">" + elem.getReading(readingPrefix+'_'+num+'_'+spalte).val + "</div>";}
									if (spalte == 'daysleftLong') {mytext += "<div class=\"\" style=\"color:"+color+";width:"+$width+"%;\">" + elem.getReading(readingPrefix+'_'+num+'_'+spalte).val + "</div>";}
								}
							});
							mytext += "</div>";//close hbox
							mytext += "</div>";//close swiper-slide
						}
						mytext += "</div>";//close swiper-wrapper
						mytext += "<div class=\"swiper-pagination\" style=\"position:static;\"></div>";
						//mytext += "<div class=\"swiper-button-prev\"></div>";
						//mytext += "<div class=\"swiper-button-next\"></div>";
						mytext += "</div>";//close swiper-container
						mytext += "<script>\
						var swiper = new Swiper('.swiper-container', {\
									pagination: '.swiper-pagination',\
									spaceBetween: 30,\
									autoplay: 2500,\
									autoplayDisableOnInteraction: false,\
									centeredSlides: true,\
									hashnav: true,\
								});\
								</script>";
						mytext += "</div>";
					}
        }       
      }
			elem.html(((elem.data('header').length > 0) ? myheader : "") + mytext);
    });
  }

  var me = $.extend(new Modul_widget(), {
    widgetname: 'calview',
    init: init,
    update: update,
  });

  return me;
};
