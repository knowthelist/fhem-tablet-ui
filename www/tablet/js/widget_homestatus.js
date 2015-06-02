if(typeof widget_widget == 'undefined') {
    loadplugin('widget_widget');
}

var widget_homestatus = $.extend({}, widget_widget, {
    widgetname : 'homestatus',
    isUpdating:false,
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
			
            if (this.cv > Math.PI*0.5 && this.cv <= Math.PI*1.0){
                start=0; end=Math.PI; sector=3;
                if (this.o.texts.length > 4){
                    end=0.5*Math.PI;
                }
			}
            else if (this.cv > Math.PI*1.0 && this.cv <= Math.PI*1.5){
                start=0; end=0.5*Math.PI; sector=3;
                if (this.o.texts.length > 4){
                    start=0.5*Math.PI; end=Math.PI; sector=5;
                }
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
        if (this.o.texts.length > 4){
            c.beginPath();
            c.arc(this.xy, this.xy, this.radius*0.7, 0.5 * Math.PI-0.02, 0.5 * Math.PI);
            c.stroke();
        }
		
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
        var cfont=10*window.devicePixelRatio +"px sans-serif";
        var cfafont=22*window.devicePixelRatio +"px FontAwesome";
        var coffset=5*window.devicePixelRatio;

		
		c.fillStyle = (sector==1)?this.o.minColor:this.o.maxColor;
        c.font = cfont;
        c.fillText(this.o.texts[0], this.xy-14, this.xy+15+coffset);
        c.font = cfafont;
        c.fillText(getIconId(this.o.icons[0]), this.xy-12, this.xy+2);
		
		c.fillStyle = (sector==2)?this.o.minColor:this.o.maxColor;
        c.font = cfafont;
        c.fillText(getIconId(this.o.icons[1]), this.xy-this.radius*0.7, this.xy-this.radius*0.4);
        c.font = cfont;
        c.fillText(this.o.texts[1], this.xy-this.radius*0.85, this.xy-10);
		
        c.fillStyle = (sector==4)?this.o.minColor:this.o.maxColor;
        c.font = cfafont;
        c.fillText(getIconId(this.o.icons[3]), this.xy+this.radius*0.4, this.xy-this.radius*0.4);
        c.font = cfont;
        c.fillText(this.o.texts[3], this.xy+this.radius*0.44, this.xy-10);

        if (this.o.texts.length > 4){
            c.fillStyle = (sector==3)?this.o.minColor:this.o.maxColor;
            c.font = cfafont;
            c.fillText(getIconId(this.o.icons[2]), this.xy+this.radius*0.4, this.xy+this.radius*0.5+coffset);
            c.font = cfont;
            c.fillText(this.o.texts[2], this.xy+this.radius*0.44, this.xy+this.radius*0.3-coffset);
            c.fillStyle = (sector==5)?this.o.minColor:this.o.maxColor;
            c.font = cfafont;
            c.fillText(getIconId(this.o.icons[4]), this.xy-this.radius*0.7, this.xy+this.radius*0.5+coffset);
            c.font = cfont;
            c.fillText(this.o.texts[4], this.xy-this.radius*0.85, this.xy+this.radius*0.3-coffset);
        }
        else{
            c.fillStyle = (sector==3)?this.o.minColor:this.o.maxColor;
            c.font = cfafont;
            c.fillText(getIconId(this.o.icons[2]), this.xy-12, this.xy+this.radius*0.73-coffset);
            c.font = cfont;
            c.fillText(this.o.texts[2], this.xy-12, this.xy+this.radius*0.65+15);
        }

		this.o.status = sector;
	return false;
    },
    init_attr : function(elem) {
        var defaultAlias =  new Array('Home','Night','Away','Holiday','Retire');
        var defaultIcons =  new Array('fa-home','fa-bed','fa-car','fa-suitcase','fa-tint');
        var defaultStates = new Array('1','2','3','4');

        if ( elem.data('version')  && elem.data('version') != ''){
            defaultStates = new Array('home','asleep','absent','gone','gotosleep');
        }

        elem.data('get',        elem.data('get') || 'STATE');
        elem.data('cmd',        elem.data('cmd') || 'set');
        elem.data('get-on',     typeof elem.data('get-on')  != 'undefined' ? elem.data('get-on')  : defaultStates);
        elem.data('set-on',     typeof elem.data('set-on')  != 'undefined' ? elem.data('set-on')  : elem.data('get-on'));
        readings[elem.data('get')] = true;

        var texts = elem.data('alias')||[];
        var icons = elem.data('icons')||[];
        for(var i=0; i<defaultStates.length; i++) {
            if(typeof texts[i] == 'undefined')
                texts[i]=defaultAlias[i];
            if(typeof icons[i] == 'undefined')
                icons[i]=defaultIcons[i];
        }
        elem.data('texts', texts);
        elem.data('icons', icons);

    },
    init_ui : function(elem) {
        var knob_elem =  jQuery('<input/>', {
            type: 'text',
        }).data($(this).data())
          .data('curval', 10)
          .appendTo(elem);

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
            'texts': elem.data('texts'),
            'icons': elem.data('icons'),
            'cmd': elem.data('cmd') || 'set',
            'set': elem.data('set') || '',
            'draw' : widget_homestatus.drawSelector,
            'change' : function (v) {
                  startPollInterval();
            },
            'release' : function (v) {
              if (!isUpdating){
                  var section=this.o.status;
                  var states=elem.data('set-on');
                  var state=states[section-1] ||'1';
                  var device = elem.data('device');
                  var cmd = [elem.data('cmd'), device, elem.data('set'), state].join(' ');
                  setFhemStatus(cmd);
                  if( device && typeof device != "undefined" && device !== " ") {
                      TOAST && $.toast(cmd);
                  }
                  this.$.data('curval', v);
             }
            }
        });
        return elem;
    },
    init: function () {
        var base = this;
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            base.init_attr($(this));
            base.init_ui($(this));
        });
    },
    update: function (dev,par) {
         var deviceElements= this.elements.filter('div[data-device="'+dev+'"]');
         var base = this;
         isUpdating=true;
         deviceElements.each(function(index) {
		
            var state = getDeviceValue( $(this), 'get' );
            if (state){
                var elem = $(this).find('input');
                var states=$(this).data('get-on');
                var val=0;
                var idx=indexOfGeneric(states,state);
                if (idx>-1){
                    switch( idx+1 ) {
                        case 3:
                            val=Math.PI*0.75;
                            break;
                        case 4:
                            val=Math.PI*0.25;
                            break;
                        case 2:
                            val=Math.PI*1.75;
                            break;
                        case 5:
                            val=Math.PI*1.25;
                            break;
                        default:
                            val=0;
                    }
                }
                if ( elem && elem.data('curval') != val )
                    elem.val( val ).trigger('change');
			}
	});
    isUpdating=false;
    },
});
