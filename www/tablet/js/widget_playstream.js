var widget_playstream = {
  _playstream: null,
  elements: null,
      init_attr : function(elem) {
        elem.data('get',        elem.data('get')        || 'STATE');
        elem.data('get-on',     typeof elem.data('get-on')  != 'undefined' ? elem.data('get-on')  : 'on');
        elem.data('get-off',    typeof elem.data('get-off') != 'undefined' ? elem.data('get-off') : 'off');
        elem.data('volume',     typeof elem.data('volume')  != 'undefined' ? elem.data('volume')  : 'volume');
        readings[elem.data('volume')] = true;
    },

  init: function () {
    _playstream=this;
    _playstream.elements = $('div[data-type="playstream"]');
    _playstream.elements.each(function(index) {

		_playstream.init_attr( $(this) );

        $(this).data('audio', new Audio($(this).data('url')));

		var elem = $(this).famultibutton({
            icon: 'fa-play',
			backgroundIcon: 'fa-circle',
			offColor: '#2A2A2A',
			onColor: '#2A2A2A',
			toggleOn: function( ) {
                //stop all streams
                _playstream.elements.each(function(index,el) {
                    $(this).data('audio').pause();
                 });
                 //switch all paused buttons to OFF after 500ms
                 setTimeout(function(){
                    _playstream.elements.each(function(index,el) {
                        if ($(this).data('audio').paused)
                                $(this).data('famultibutton').setOff();
                     });
                },500);
                //start stream
                $(this).data('audio').play();
			},
			toggleOff: function( ) {
                //stop this streams
                 $(this).data('audio').pause();
			},
		});
	 });
  },
  update: function (dev,par) {
		_playstream=this;
        var deviceElements= this.elements.filter('div[data-device="'+dev+'"]');
        deviceElements.each(function(index) {
            if ( $(this).data('get')==par){
                var state = getDeviceValue( $(this), 'get' );
                if (state) {
                    var states=$(this).data('get-on');
					var elem = $(this).data('famultibutton');
					if (elem){
						if ( state == $(this).data('get-on') ) {
							 elem.setOn();
							 $(this).data('audio').play();
						} else if ( state == $(this).data('get-off') ) {
							 elem.setOff();
							 $(this).data('audio').pause();
						} else if ( state.match(new RegExp('^' + $(this).data('get-on') + '$')) )
							 elem.toggleOn();
						else if ( state.match(new RegExp('^' + $(this).data('get-off') + '$')) )
							 elem.toggleOff();
						else if ( $(this).data('get-off')=='!on' && state != $(this).data('get-on') )
							 elem.toggleOff();
						else if ( $(this).data('get-on')=='!off' && state != $(this).data('get-off') )
							 elem.toggleOn();
					}
                }

            }
            if ( $(this).data('volume')==par){
                var volume = getDeviceValue( $(this), 'volume' );
                if ( $.isNumeric(volume) ) {
                    DEBUG && console.log('playstream - set volume to :',parseInt(volume)/100.0);
                    $(this).data('audio').volume = parseInt(volume)/100.0;
                }
            }
        });

   }
			 
};
