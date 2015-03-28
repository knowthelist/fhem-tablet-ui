var widget_simplechart = {
  _simplechart: null,
  elements: null,
  dateFromString: function (str) {
 var m = str.match(/(\d+)-(\d+)-(\d+)_(\d+):(\d+):(\d+).*/);
 return (m)?new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]):new Date();
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
  	_simplechart=this;
  	_simplechart.elements = $('div[data-type="simplechart"]');
 	_simplechart.elements.each(function(index) {

        var min = 17;
        var max = 26;
        var mindate='2015-03-22';
        var maxdate='2015-03-27';

		var device = $(this).data('device');
        var svgElement = $('<svg id="mi"" width="100%" height="100%" '+
                'preserveAspectRatio="none" >'+
                '<g transform="scale(1, -1)">'+
                '<polyline points=""'+
                'style="fill:none;stroke:orange;stroke-width:2px" '+
                'vector-effect="non-scaling-stroke"/>'+
			' </g></svg>');
		svgElement.appendTo($(this));

        var cmd =[
             'get',
             'FileLog_WohnzimmerHeizung2',
             'WohnzimmerHeizung2-2015.log',
             '-',
             mindate,
             maxdate,
             '4:meas.*:1:int'
                ];
		$.ajax({
	
	  url: "../fhem/",
                   async: true,
                   cache: false,
			data: {
            cmd: cmd.join(' '),
			XHR: "1"
        },
	
	}).done(function(data ) {
        var points=[];
        var lines = data.split('\n');
        var lastVal = 0;
        var i=0;
        $.each( lines, function( index, value ) {
            if (value){
                var val = value.replace('\r\n','').split(' ')[1];//use getPart!!
                var start = _simplechart.dateFromString(mindate+"_00:00:00"),
                    end   = _simplechart.dateFromString(value),
                    diff  = new Date(end - start),
                    minutes  = diff/1000/60;
                    //console.log( index + ": " + minutes.toFixed(0)+ ": " + val );
                    if (val && minutes && lastVal != val ){
                            i++;
                            points[i]=[minutes.toFixed(0),(val)];
                        lastVal=val;
                        console.log( "added: " + minutes.toFixed(0)+ ": " + val );
                    }
            }


        });


        $('polyline').attr('points',_simplechart.getSvgPoints(points));
        // jQuery's attr() fails here
        $('svg')[0].setAttribute('viewBox', [100, -max, 1500, max-min].join(' '));


	});


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
			var state = getDeviceValue( $(this), 'get' );
			if (state) {
				
			}
		}
	});
   }
			 
};
