var widget_simplechart = {
  _simplechart: null,
  elements: null,
  getSvgPoints: function (arg) {
       var res = [];
       for (var i=0,l=arg.length;i<l;i++) {
           if(arg[i])
           res.push(arg[i].join(','));
       }
       return res.join(' ');
},
  init: function () {
  	_simplechart=this;
  	_simplechart.elements = $('div[data-type="simplechart"]');
 	_simplechart.elements.each(function(index) {

		
		$(this).css("width", "100%");
		$(this).css("height", "100%");
        var svgElement = $('<svg width="100%" height="100%" '+
                'preserveAspectRatio="none" >'+
                '<g transform="scale(1, -1)">'+
                '<polyline points=""'+
                'style="fill:none;stroke:orange;stroke-width:2px" '+
                'vector-effect="non-scaling-stroke"/>'+
			' </g></svg>');
		svgElement.appendTo($(this));

        //_simplechart.refresh.apply(this);

     });
  },
  refresh: function () {
      var min = $(this).data('minvalue')||0;
      var max = $(this).data('maxvalue')||100;

      var days = parseFloat($(this).attr('data-daysago')||0);
      var now = new Date();
      var ago = new Date();
      var mindate=now;
      if (days>0 && days<1){
          ago.setTime(now.getTime() - (days*24*60*60*1000));
          mindate= ago.yyyymmdd() + '_'+ago.hhmmss() ;
      }
      else{
          ago.setDate(now.getDate() - days);
          mindate= ago.yyyymmdd() + '_00:00:00';
      }

      var maxdate= now.yyyymmdd() + '_23:59:59';

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

      var svg = this.elem.find('svg');
      if (svg){
          console.log( "svg: " + svg);
          var polyline = svg.find('polyline');
          if (polyline)
            polyline.attr('points',_simplechart.getSvgPoints(points));
          // jQuery's attr() fails here
          svg[0].setAttribute('viewBox', [10, -max, xrange+10, max-min].join(' '));
      }
  });
    },

  update: function (dev,par) {

	var deviceElements;
	if ( dev == '*' )
		deviceElements= _simplechart.elements;
	else
   		deviceElements= _simplechart.elements.filter('div[data-device="'+dev+'"]');

	deviceElements.each(function(index) {
		if ( $(this).data('get')==par || par =='*'){	
            _simplechart.refresh.apply(this);
		}
	});
   }
			 
};
