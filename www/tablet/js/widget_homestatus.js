if(typeof widget_knob == 'undefined') {
    loadplugin('widget_knob');
}

if (!$.fn.knob){
    dynamicload('lib/jquery.knob.mod.js', null, null, false);
}

var widget_homestatus = $.extend({}, widget_knob, {
    widgetname : 'homestatus',
    isUpdating:false,
    drawDial: function () {
	var sector=0;
	var c = this.g; // context
    var x=this.tx; // touch x position
    var y=this.ty; // touch y position
	var mx=this.x+this.w2;
	var my=this.y+this.w2;
	var r=this.radius*0.4;
    var texts = this.$.data('texts');
    var icons = this.$.data('icons');

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
                if (texts.length > 4){
                    end=0.5*Math.PI;
                }
			}
            else if (this.cv > Math.PI*1.0 && this.cv <= Math.PI*1.5){
                start=0; end=Math.PI; sector=3;
                if (texts.length > 4){
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
        c.arc(this.xy, this.xy, this.radius*0.7, 0, 0.025);
		c.stroke();
		c.beginPath();
        c.arc(this.xy, this.xy, this.radius*0.7, Math.PI-0.025, Math.PI);
		c.stroke();
		c.beginPath();
        c.arc(this.xy, this.xy, this.radius*0.7, 1.5 * Math.PI-0.025, 1.5 * Math.PI);
		c.stroke();
        if (texts.length > 4){
            c.beginPath();
            c.arc(this.xy, this.xy, this.radius*0.7, 0.5 * Math.PI-0.025, 0.5 * Math.PI);
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
        var cfafont=22*window.devicePixelRatio +"px "+this.$.data("icon-font");
        var coffset=5*window.devicePixelRatio;

		c.fillStyle = (sector==1)?this.o.minColor:this.o.maxColor;
        c.font = cfont;
        c.fillText(texts[0], this.xy-15, this.xy+10+coffset);
        c.font = cfafont;
        c.fillText(getIconId(icons[0]), this.xy-12, this.xy+2);

        c.fillStyle = (sector==2)?this.o.minColor:this.o.maxColor;
        c.font = cfafont;
        c.fillText(getIconId(icons[1]), this.xy-this.radius*0.7, this.xy-this.radius*0.4);
        c.font = cfont;
        c.fillText(texts[1], this.xy-this.radius*0.85, this.xy-10);

        c.fillStyle = (sector==4)?this.o.minColor:this.o.maxColor;
        c.font = cfafont;
        c.fillText(getIconId(icons[3]), this.xy+this.radius*0.35, this.xy-this.radius*0.4);
        c.font = cfont;
        c.fillText(texts[3], this.xy+this.radius*0.44, this.xy-10);

        if (texts.length > 4){
            c.fillStyle = (sector==3)?this.o.minColor:this.o.maxColor;
            c.font = cfafont;
            c.fillText(getIconId(icons[2]), this.xy+this.radius*0.4, this.xy+this.radius*0.5+coffset);
            c.font = cfont;
            c.fillText(texts[2], this.xy+this.radius*0.44, this.xy+this.radius*0.3-coffset);
            c.fillStyle = (sector==5)?this.o.minColor:this.o.maxColor;
            c.font = cfafont;
            c.fillText(getIconId(icons[4]), this.xy-this.radius*0.7, this.xy+this.radius*0.5+coffset);
            c.font = cfont;
            c.fillText(texts[4], this.xy-this.radius*0.85, this.xy+this.radius*0.3-coffset);
        }
        else{
            c.fillStyle = (sector==3)?this.o.minColor:this.o.maxColor;
            c.font = cfafont;
            c.fillText(getIconId(icons[2]), this.xy-this.radius*0.15, this.xy+this.radius*0.65+coffset);
            c.font = cfont;
            c.fillText(texts[2], this.xy-12, this.xy+this.radius*0.82+coffset);
        }

		this.o.status = sector;
	return false;
    },
    onChange: function (v) {
    },
    onRelease: function (v) {
        if (!isUpdating){
            var section=this.o.status;
            var states=this.$.data('set-on');
            this.$.data('value',states[section-1] ||'1');
            this.$.transmitCommand();
            this.$.data('curval', v);
       }
    },
    onFormat: function(v) { return v; },
    init: function () {
        var base = this;
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            var elem = $(this);
            var defaultAlias =  ['Home','Night','Away','Holiday','Retire'];
            var defaultIcons =  ['fa-home','fa-bed','fa-car','fa-suitcase','fa-tint'];
            var defaultStates = ['1','2','3','4'];

            if ( elem.data('version')  && elem.data('version') != ''){
                defaultStates = ['home','asleep','absent','gone','gotosleep'];
            }
            elem.data('get',        elem.data('get') || 'STATE');
            elem.data('cmd',        elem.data('cmd') || 'set');
            elem.data('get-on',     typeof elem.data('get-on')  != 'undefined' ? elem.data('get-on')  : defaultStates);
            elem.data('set-on',     typeof elem.data('set-on')  != 'undefined' ? elem.data('set-on')  : elem.data('get-on'));
            elem.data('height', 1*elem.attr('data-height')||210);
            elem.data('width', 1*elem.attr('data-width')||210);
            if(elem.hasClass('small')) {
                elem.data('height', 160);
                elem.data('width', 160);
            }
            elem.addReading('get');

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
            elem.data('icon-font',       elem.data('icon-font')          || 'FontAwesome');
            elem.data('min',         0);
            elem.data('max',         2 * Math.PI);
            elem.data('step',        0.01);

            elem.data('bgcolor',     elem.data('bgcolor')      || getClassColor(elem) || getStyle('.homestatus','background-color')  || '#aaaaaa');
            elem.data('fgcolor',     elem.data('fgcolor')      || getClassColor(elem) || getStyle('.homestatus','color')  || '#aa6900');
            elem.data('tkcolor',     elem.data('tkcolor')      || getStyle('.homestatus.tkcolor','color') || '#696969');

            elem.data('mincolor',    elem.data('mincolor')     || getStyle('.homestatus.mincolor','color') || elem.data('mincolor') || '#2A2A2A');
            elem.data('maxcolor',    elem.data('maxcolor')     || getStyle('.homestatus.maxcolor','color') || elem.data('maxcolor') || '#696969');

            elem.data('angleoffset', 0);
            elem.data('anglearc',    360);
            elem.data('displayinput',false);

            base.init_attr(elem);
            base.init_ui(elem);

            // hack: force refresh
            setTimeout(function(){
                isUpdating=true;
                elem.find('input').val( elem.data('curval') ).trigger('change');
                isUpdating=false;
            }, 15000);
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
                if ( elem && $(this).data('curval') != val ){
                    elem.val( val ).trigger('change');
                    $(this).data('curval', val);
                }
			}
	});
    isUpdating=false;
    },
});
