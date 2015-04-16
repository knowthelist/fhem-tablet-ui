var widget_homestatus = {
  _homestatus: null,
  elements: null,
  drawSelector: function () {
	var sector=0;
	var c = this.g; // context
    var x=this.tx; // touch x position
    var y=this.ty; // touch y position
	var mx=this.x+this.w2;
	var my=this.y+this.w2;
	var r=this.radius*0.4;

      //Assign sector 1 for center pressed or value is 0
      if ( Math.pow((mx-x),2) + Math.pow((my-y),2) < Math.pow(r,2)
          || this.cv == 0 )
          sector=1;

	if (sector==1){
			// inner circle
			c.lineWidth = this.radius*0.4;
			c.strokeStyle = this.o.fgColor ;
			c.beginPath(); 
			c.arc( this.xy, this.xy, this.radius*0.2, 0, 2 * Math.PI); 
			c.stroke();
		}
		else{
			// outer section
			var start=0; 
			var end = 0;
			
			if (this.cv > Math.PI*0.5 && this.cv <= Math.PI*1.5){
					start=0; end=Math.PI; sector=3;
			}
			else if (this.cv > Math.PI*1.5 && this.cv <= Math.PI*2){
					start=Math.PI; end=Math.PI*1.5; sector=2;
			}
			else if (this.cv > 0 && this.cv <= Math.PI*0.5){
					start=Math.PI*1.5; end=Math.PI*2; sector=4;
			}
														
			c.lineWidth = this.radius*0.6;
			c.beginPath();
			c.strokeStyle = this.o.fgColor;
			c.arc(this.xy, this.xy, this.radius*0.7, start, end);
			c.stroke();
		} 

		// sections
		c.strokeStyle = this.o.tkColor;
		c.lineWidth = this.radius*0.6;
		c.beginPath();
		c.arc(this.xy, this.xy, this.radius*0.7, 0, 0.02);
		c.stroke();
		c.beginPath();
		c.arc(this.xy, this.xy, this.radius*0.7, Math.PI -0.02, Math.PI);
		c.stroke();
		c.beginPath();
		c.arc(this.xy, this.xy, this.radius*0.7, 1.5 * Math.PI-0.02, 1.5 * Math.PI);
		c.stroke();
		
		// inner circle line
		c.lineWidth = 2; 
		c.strokeStyle = this.o.tkColor;
		c.beginPath(); 
		c.arc( this.xy, this.xy, this.radius*0.4, 0, 2 * Math.PI); 
		c.stroke(); 
		
		// outer circle line
		c.lineWidth = 2; 
		c.beginPath(); 
		c.arc( this.xy, this.xy, this.radius, 0, 2 * Math.PI, false); 
		c.stroke(); 

        //cavans font
        var cfont=null,cfafont=null,coffset=0;
        if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)){
            cfont="100 18px sans-serif";
            cfafont="42px FontAwesome";
            coffset=10;
        }
         else{
            cfont="100 11px sans-serif";
            cfafont="22px FontAwesome";
        }

		
		c.fillStyle = (sector==1)?this.o.minColor:this.o.maxColor;
        c.font = cfont;
        c.fillText("Home", this.xy-14, this.xy+15+coffset);
        c.font = cfafont;
        c.fillText("\uf015", this.xy-12, this.xy+2);
		
		c.fillStyle = (sector==2)?this.o.minColor:this.o.maxColor;
        c.font = cfafont;
		c.fillText("\uf236", this.xy-this.radius*0.7, this.xy-this.radius*0.4);
        c.font = cfont;
		c.fillText("Night", this.xy-this.radius*0.9, this.xy-10);
		
		c.fillStyle = (sector==3)?this.o.minColor:this.o.maxColor;
        c.font = cfafont;
        c.fillText("\uf1b9", this.xy-12, this.xy+this.radius*0.67-coffset);
        c.font = cfont;
        c.fillText("Away", this.xy-12, this.xy+this.radius*0.65+15);

		c.fillStyle = (sector==4)?this.o.minColor:this.o.maxColor;
        c.font = cfafont;
		c.fillText("\uf0f2", this.xy+this.radius*0.4, this.xy-this.radius*0.4);
        c.font = cfont;
		c.fillText("Holiday", this.xy+this.radius*0.42, this.xy-10);
		
		this.o.status = sector;
	return false;
},
  init: function () {
  	_homestatus=this;
  	_homestatus.elements = $('div[data-type="homestatus"]');
 	_homestatus.elements.each(function(index) {

		var knob_elem =  jQuery('<input/>', {
			type: 'text',
		}).data($(this).data())
		  .data('curval', 10)
		  .appendTo($(this));

		var device = $(this).data('device');
		$(this).data('get', $(this).data('get') || 'STATE');
		$(this).data('cmd', $(this).data('cmd') || 'set');
		readings[$(this).data('get')] = true;
		
        knob_elem.knob({
			'min': 0,
			'max': 2 * Math.PI,
			'step': 0.01,
			'height':210,
			'width':210,
			'bgColor': $(this).data('bgcolor') || '#aaaaaa',
			'fgColor': $(this).data('fgcolor') || '#aa6900',
			'tkColor': $(this).data('tkcolor') || '#696969',
			'minColor': '#2A2A2A',
			'maxColor': '#696969',
			'thickness': 0.4,
                           'lastvalue':0,
			'displayInput': false,
			'angleOffset' : 0,
			'cmd': $(this).data('cmd') || 'set',
			'set': $(this).data('set') || '',
			'version': $(this).data('version') || '',
            'draw' : _homestatus.drawSelector,
			'change' : function (v) { 
                  startPollInterval();
			},
			'release' : function (v) { 
			  if (ready){
			  		var st=this.o.status;
			  		switch( this.o.version+this.o.status ) {
					case 'residents3':
					case 'roommate3':
					case 'guest3':
						st='absent';
						break;
					case 'residents4':
					case 'roommate4':
					case 'guest4':
						st='gone';
						break;
					case 'residents2':
					case 'roommate2':
					case 'guest2':
						st='asleep';
						break;
					case 'residents1':
					case 'roommate1':
					case 'guest1':
						st='home';
						break;
					}
			  		var cmdl = this.o.cmd+' '+device+' '+this.o.set+' '+st;
				  	setFhemStatus(cmdl);
				  	TOAST && $.toast(cmdl);
				  	this.$.data('curval', v);
			  }
			}	
        });

	 });
  },
  update: function (dev,par) {

    var deviceElements= _homestatus.elements.filter('div[data-device="'+dev+'"]');
	deviceElements.each(function(index) {
		
			var value = getDeviceValue( $(this), 'get' );
			if (value){
				var knob_elem = $(this).find('input');
				var val=0;
				switch( value ) {
					case '3':
					case 'absent':
					case 'abwesend':
						val=Math.PI;
						break;
					case '4':
					case 'gone':
					case 'none':
					case 'verreist':
						val=Math.PI*0.25;
						break;
					case '2':
					case 'asleep':
					case 'gotosleep':
					case 'bettfein':
					case 'schläft':					
						val=Math.PI*1.75;
						break;
					default:
						val=0;
				}
				if ( knob_elem.data('curval') != val )
					knob_elem.val( val ).trigger('change');		
			}
	});
   },
			 
};
