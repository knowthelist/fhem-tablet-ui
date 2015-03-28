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
        var min = $(this).data('minvalue')||0;
        var max = $(this).data('maxvalue')||100;
        
        // maybe generally better include https://github.com/phstc/jquery-dateFormat 
        var now = new Date();
        var Y = now.getFullYear();
        var m = now.getMonth()+1;
        var d = now.getDate();
        var H = now.getHours();
        var i = now.getMinutes();
        var s = now.getSeconds();
        d = d<10?'0'+d:d;
        m = m<10?'0'+m:m;
        H = H<10?'0'+H:H;
        i = i<10?'0'+i:i;
        s = s<10?'0'+s:s;
        var today = Y+'-'+m+'-'+d;
        var time =  H+':'+i+':'+s;
        
        var mindate= $(this).data('mindate')||today;
        var maxdate= $(this).data('maxdate')||today + '_' + time;
        
        if(mindate.match(/^\d\d\d\d.\d\d.\d\d$/)) {
            mindate += '_00:00:00';
        }
        mindate = mindate.replace(/^(\d\d\d\d).(\d\d).(\d\d).(\d\d).(\d\d).(\d\d)$/, '$1-$2-$3_$4:$5:$6');
        // rudimentary plausibility check
        if(! mindate.match(/^\d\d\d\d-[0-1]\d-[0-3]\d_[0-2]\d:[0-5]\d:[0-5]\d$/)) {
            console.log('mindate '+$(this).attr('data-mindate')+' is not ok in simplechart' + ($(this).attr('data-device')?' for device '+$(this).attr('data-device'):''));
        }
        
        if(maxdate.match(/^\d\d\d\d.\d\d.\d\d$/)) {
            maxdate += '_23:59:59';
        }
        maxdate = maxdate.replace(/^(\d\d\d\d).(\d\d).(\d\d).(\d\d).(\d\d).(\d\d)$/, '$1-$2-$3_$4:$5:$6');
        // rudimentary plausibility check
        if(! maxdate.match(/^\d\d\d\d-[0-1]\d-[0-3]\d_[0-2]\d:[0-5]\d:[0-5]\d$/)) {
            console.log('maxdate '+$(this).attr('data-maxdate')+' is not ok in simplechart' + ($(this).attr('data-device')?' for device '+$(this).attr('data-device'):''));
        }

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
		
		$(this).css("width", "100%");
		$(this).css("height", "100%");
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
                var start = _simplechart.dateFromString(mindate),
                    end   = _simplechart.dateFromString(value),
                    diff  = new Date(end - start),
                    minutes  = diff/1000/60;
                    //console.log( index + ": " + minutes.toFixed(0)+ ": " + val );
                    if (val && minutes && lastVal != val ){
                            i++;
                            points[i]=[minutes.toFixed(0),(val)];
                        lastVal=val;
                        //console.log( "added: " + minutes.toFixed(0)+ ": " + val );
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
