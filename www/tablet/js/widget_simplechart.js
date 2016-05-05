if(typeof widget_widget == 'undefined') {
    dynamicload('js/widget_widget.js');
}

var widget_simplechart = {
  widgetname : 'simplechart',
  createElem: function(elem) {
      return $(document.createElementNS('http://www.w3.org/2000/svg', elem));
    },
  precision: function(a) {
      var s = a + "",
      d = s.indexOf('.') + 1;
      return !d ? 0 : s.length - d;
    },
  getSvgPoints: function (arg) {
       var res = [];
       for (var i=0,l=arg.length;i<l;i++) {
           if(arg[i])
           res.push(arg[i].join(','));
       }
       return res.join(' ');
    },
    init_attr: function(elem) {
        elem.initData('minvalue'    , 10);
        elem.initData('maxvalue'    , 30);
        elem.initData('xticks'      , 360);
        elem.initData('yticks'      , 5);
        elem.initData('yunit'       , '');
        elem.initData('get'         , 'STATE');

        elem.addReading('get');
    },
  init: function () {
      var base=this;
      this.elements = $('div[data-type="'+this.widgetname+'"]');
      this.elements.each(function(index) {

        widget_simplechart.init_attr($(this));

        var defaultHeight = $(this).hasClass('fullsize') ? '85%' : '';
        var svgElement = $('<svg>'+
                '<svg class="chart" x="0%" width="91%" preserveAspectRatio="none">'+
                '<g transform="scale(1, -1)">'+
                '<polyline points=""/>'+
                '</g></svg>'+
        '</svg>');
        svgElement.appendTo($(this))
          .css("width",$(this).data('width') || '93%')
          .css("height",$(this).data('height') || defaultHeight);

        //base.refresh.apply(this);

     });
    },
  refresh: function () {
      var minarray = $(this).data('minvalue');
      var maxarray = $(this).data('maxvalue');
      var min = parseFloat( $.isArray(minarray) ? minarray[0] : minarray );
      var max = parseFloat( $.isArray(maxarray) ? maxarray[0] : maxarray );
      var xticks = parseFloat( $(this).data('xticks'));
      var yticks = parseFloat( $(this).data('yticks'));
      var fix = widget_simplechart.precision( $(this).data('yticks') );
      var unit = $(this).data('yunit');
      var caption = $(this).data('caption');
      var noticks = ( $(this).data('width') <=100 ) ? true : $(this).hasClass('noticks');
      var days = parseFloat($(this).attr('data-daysago')||0);
      var now = new Date();
      var ago = new Date();
      var vals =[];
      var mindate=now;
      var maxdate=now;
      if (days>0 && days<1){
          ago.setTime(now.getTime() - (days*24*60*60*1000));
          mindate= ago.yyyymmdd() + '_'+ago.hhmmss() ;
      }
      else{
          ago.setDate(now.getDate() - days);
          mindate= ago.yyyymmdd() + '_00:00:00';
      }
      //var maxdate= now.yyyymmdd() + '_23:59:59';
      maxdate.setDate(now.getDate() + 1);
      maxdate = maxdate.yyyymmdd() + '_00:00:00';

      //console.log( "mindate: " + mindate);
      //console.log( "maxdate: " + maxdate);

      var column_spec;
      if($(this).attr("data-columnspec")) {
          column_spec = $(this).attr("data-columnspec");
      } else {
          var device = $(this).attr('data-device')||'';
          var reading = $(this).attr('data-get')||'';
          column_spec = device + ':' + reading;
      }
      if(! column_spec.match(/.+:.+/)) {
          console.log('columnspec '+column_spec+' is not ok in simplechart' + ($(this).attr('data-device')?' for device '+$(this).attr('data-device'):''));
      }

      var logdevice = $(this).attr("data-logdevice");
      var logfile = $(this).attr("data-logfile")||"-";

      var cmd =[
           'get',
           logdevice,
           logfile,
           '-',
           mindate,
           maxdate,
           column_spec
      ];
      $.ajax({
          url: $("meta[name='fhemweb_url']").attr("content") || "../fhem/",
          async: true,
          cache: false,
          context: {elem: $(this)},
          data: {
              cmd: cmd.join(' '),
              XHR: "1"
          },
      }).done(function(data ) {
          var points=[];
          var lines = data.split('\n');
          var point=[];
          var i=0;
          var tstart = dateFromString(mindate);
          $.each( lines, function( index, value ) {
              if (value){
                  var val = getPart(value.replace('\r\n',''),2);
                  var minutes = diffMinutes(tstart,dateFromString(value));
                  if (val && minutes && $.isNumeric(val) ){
                      point=[minutes,val];
                      vals.push(val);
                      i++;
                      points[index]=point;
                      if (val>max && $.isArray(maxarray) ) {
                          for(var j=0,len=maxarray.length; j<len; j++) {
                              if (maxarray[j]>val) {
                                  max = maxarray[j];
                                  break;
                              }
                          }
                      }
                      if (val<min && $.isArray(minarray) ) {
                          for(var j=0,len=minarray.length; j<len; j++) {
                              if (minarray[j]<val) {
                                  min = minarray[j];
                                  break;
                              }
                          }
                      }
                  }
               }
           });

          //add last know point
          points[i]=point;

      var xrange  = parseInt(diffMinutes(tstart,dateFromString(maxdate)));
      var strokeWidth = (document.documentElement.style.vectorEffect === undefined) ? (max-min)/150 : 1;
      var strokeWidthDashed = (strokeWidth==1) ? 1.2 : 10;

      var svg = this.elem.find('svg.chart');
      if (svg){
          //clear previous content
          svg.parent().find('text').remove();
          svg.find('line').remove();
          var polyline = svg.find('polyline');
          if (polyline){
              var graph = polyline.parent();
              //y-axis
              var yaxis = widget_simplechart.createElem('line');
              yaxis.attr({
                            'id':'yaxis',
                            'x1':'3',
                            'y1':min,
                            'x2':'3',
                            'y2':max,
                            'style':'stroke:#555;stroke-width:'+strokeWidth+'px',
                            'vector-effect':'non-scaling-stroke',
                            });
              polyline.parent().append(yaxis);

              if (!noticks){
                  //y-ticks
                  for ( var y=min; y<=max; y+=yticks ){
                        var line = widget_simplechart.createElem('line');
                        line.attr({
                                    'x1':'0',
                                    'y1':y,
                                    'x2':xrange,
                                    'y2':y,
                                    'style':'stroke:#555;stroke-width:'+strokeWidth+'px',
                                    'vector-effect':'non-scaling-stroke',
                                    });
                        graph.prepend(line);
                        var text = widget_simplechart.createElem('text');
                        var textY = (caption)
                                    ? (((max-y)*100)/(max-min)*0.8+12)
                                    : (((max-y)*100)/(max-min)*0.87+5);

                        text.attr({
                                    'x':'99%',
                                    'y': textY+'%',
                                    'style':'font-size:9px',
                                    'text-anchor':"end",
                                    'fill':'#ddd',
                                    });
                      text.text( ((fix>-1 && fix<=20) ? y.toFixed(fix) : y)+unit);
                      svg.parent().append(text);
                  }

                  //x-axis
                  var textX1 = widget_simplechart.createElem('text');
                  textX1.attr({
                                'x':'0',
                                'y':'100%',
                                'fill':'#ddd',
                                'style':'font-size:9px',
                                });
                  textX1.text(tstart.ddmm());
                  svg.parent().append(textX1);

                  for ( var x=xticks; x<=xrange; x+=xticks ){

                      var tx = new Date(tstart);
                      var textX2 = widget_simplechart.createElem('text');
                      textX2.attr({ 'x':93*x/xrange+'%',
                                    'y':'100%',
                                    'text-anchor':"middle",
                                    'fill':'#ddd',
                                    'style':'font-size:9px',
                                    });
                      tx.setMinutes(tstart.getMinutes() + x);
                      //console.log(tx);
                      var textX2Value = (tx.hhmm()=="00:00") ? tx.ddmm() : tx.hhmm() ;
                      textX2.text(textX2Value);
                      svg.parent().append(textX2);

                      var xtick1 = widget_simplechart.createElem('line');
                      xtick1.attr({ 'x1':100*x/xrange+'%',
                                    'y1':min,
                                    'x2':100*x/xrange+'%',
                                    'y2':max,
                                    'stroke-dasharray':strokeWidth*2+','+strokeWidth*2,
                                    'style':'stroke:#555;stroke-width:'+strokeWidthDashed+'px',
                                    'vector-effect':'non-scaling-stroke',
                                    });
                      graph.append(xtick1);
                }

            }
              else{
                  var line = widget_simplechart.createElem('line');
                  line.attr({
                              'x1':'0',
                              'y1':min,
                              'x2':xrange,
                              'y2':min,
                              'style':'stroke:#555;stroke-width:'+strokeWidth+'px',
                              'vector-effect':'non-scaling-stroke',
                              });
                  graph.prepend(line);

              }


            //show chart caption if set
            if (caption){
                var textCaption = widget_simplechart.createElem('text');
                textCaption.attr({
                                'x':'50%',
                                'y':'8',
                                'fill':'#ddd',
                                'text-anchor':"middle",
                                'style':'font-size:10px;font-weight:bold',
                              });
                caption=caption.replace('$min',Math.min.apply(null, vals))
                                .replace('$max',Math.max.apply(null, vals))
                                .replace('$cur',vals[vals.length-1]);
                textCaption.text(caption);
                svg.parent().append(textCaption);
            }
            //The graph it self
            polyline.attr({'points':widget_simplechart.getSvgPoints(points),
                           'style':'fill:none;stroke:orange;stroke-width:'+strokeWidth*2+'px',
                           'vector-effect':'non-scaling-stroke'
                          });
          }
          //Viewbox (autoscaler)
          var graphHeight = (caption) ? 80 : 87;
          var graphTop = (caption) ? 10 : 2;
          svg.attr({"height":graphHeight+"%",y:graphTop+"%"});
          svg[0].setAttribute('viewBox', [0, -max, xrange, max-min ].join(' '));
      }
  });
    },
  update: function (dev,par) {
      var base = this;
      var deviceElements= this.elements.filter('div[data-device="'+dev+'"]');
      deviceElements.each(function(index) {
        if ( $(this).data('get')==par){
            base.refresh.apply(this);
		}
	});
    },
};
