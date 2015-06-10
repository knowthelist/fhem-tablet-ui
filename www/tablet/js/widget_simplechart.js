var widget_simplechart = {
  widgetname : 'simplechart',
  createElem: function(elem) {
      return $(document.createElementNS('http://www.w3.org/2000/svg', elem));
    },
  getSvgPoints: function (arg) {
       var res = [];
       for (var i=0,l=arg.length;i<l;i++) {
           if(arg[i])
           res.push(arg[i].join(','));
       }
       return res.join(' ');
    },
  init: function () {
      base=this;
      this.elements = $('div[data-type="'+this.widgetname+'"]');
      this.elements.each(function(index) {

        var defaultHeight = $(this).hasClass('fullsize') ? '85%' : '';
        var svgElement = $('<svg>'+
                '<svg id="chart" preserveAspectRatio="none"><g transform="scale(1, -1)">'+
                '<polyline points=""'+
                'style="fill:none;stroke:orange;stroke-width:2px" '+
                'vector-effect="non-scaling-stroke"/>'+
            '</g></svg>'+
        '</svg>');
        svgElement.appendTo($(this))
          .css("width",$(this).data('width') || '95%')
          .css("height",$(this).data('height') || defaultHeight);

        base.refresh.apply(this);

     });
    },
  refresh: function () {
      var min = $(this).data('minvalue')||0;
      var max = $(this).data('maxvalue')||100;
      var xticks = $(this).data('xticks')||5;
      var yticks = $(this).data('yticks')||4;
      var caption = $(this).data('caption')

      var days = parseFloat($(this).attr('data-daysago')||0);
      var now = new Date();
      var ago = new Date();
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

      console.log( "mindate: " + mindate);
      console.log( "maxdate: " + maxdate);

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
          var lastVal = 0;
          var i=0;
          var start = dateFromString(mindate);
          $.each( lines, function( index, value ) {
              if (value){
                  var val = getPart(value.replace('\r\n',''),2);
                  var minutes = diffMinutes(mindate,value);
                  if (val && minutes && $.isNumeric(val) ){
                      point=[minutes,val];
                      i++;
                      if (lastVal != val ){
                          points[index]=point;
                          lastVal=val;
                          //console.log( "added: " + minutes+ ": " + val );
                      }
                  }
               }
           });

          //add last know point
          points[i]=point;

      var xrange  = parseInt(diffMinutes(mindate,maxdate));
      //console.log( "xrange: " + xrange );

      var svg = this.elem.find('svg#chart');
      if (svg){
          svg.find('line').remove();
          var polyline = svg.find('polyline');
          if (polyline){

            for ( var y=min; y<=max; y+=4 ){
                    var line = widget_simplechart.createElem('line');
                    line.attr({
                                'x1':'0',
                                'y1':y,
                                'x2':xrange,
                                'y2':y,
                                'style':'stroke:#555;stroke-width:1px',
                                'vector-effect':'non-scaling-stroke',
                                });
                    polyline.parent().prepend(line);
                    var text = widget_simplechart.createElem('text');
                    text.attr({
                                  'x':'99%',
                                  'y':(((max-y)*100)/(max-min)*0.85+7)+'%',
                                  'style':'font-size:9px',
                                  'text-anchor':"end",
                                'fill':'#ddd',
                                });
                    text.html(y);
                    svg.parent().append(text);

            }

              /*var tick1 = widget_simplechart.createElem('line');
              tick1.attr({
                             'id':'tick1',
                              'x1':'90%',
                              'y1':min,
                              'x2':'90%',
                              'style':'stroke:#555;stroke-width:1px',
                              'vector-effect':'non-scaling-stroke',
                              'y2':min+1});
              polyline.parent().append(tick1);*/
              text = widget_simplechart.createElem('text');
              text.attr({
                          'x':0,
                          'y':'100%',
                          'fill':'#ddd',
                          'style':'font-size:9px',
                            });
              text.html(dateFromString(mindate).ddmm());
              svg.parent().append(text);
              var tick2 = widget_simplechart.createElem('line');
              tick2.attr({
                             'id':'tick2',
                              'x1':'0%',
                              'y1':min,
                              'x2':'0%',
                              'style':'stroke:#555;stroke-width:1px',
                              'vector-effect':'non-scaling-stroke',
                              'y2':max});
              polyline.parent().append(tick2);
              text = widget_simplechart.createElem('text');
              text.attr({
                          'x':'99%',
                          'y':'100%',
                          'text-anchor':"end",
                          'fill':'#ddd',
                            'style':'font-size:9px',
                            });
              text.html(dateFromString(maxdate).ddmm());
              svg.parent().append(text);
            //chart text
            text = widget_simplechart.createElem('text');
            text.attr({
                        'x':'40%',
                        'y':'100%',
                     'fill':'#ddd',
                          'style':'font-size:10px',
                          });
            text.html(caption);
            svg.parent().append(text);

              polyline.attr('points',widget_simplechart.getSvgPoints(points));
          }
          // jQuery's attr() fails here
          svg[0].setAttribute('viewBox', [-2, (-max)-((max-min)*0.06), xrange*1.06, (max-min)*1.2].join(' '));



      }
  });
    },
  update: function (dev,par) {

      var deviceElements= this.elements.filter('div[data-device="'+dev+'"]');
      deviceElements.each(function(index) {
		if ( $(this).data('get')==par || par =='*'){	
            this.refresh.apply(this);
		}
	});
    },
};
