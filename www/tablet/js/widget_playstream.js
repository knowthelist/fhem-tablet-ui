var widget_playstream = {
  _playstream: null,
  elements: null,
  init: function () {
    _playstream=this;
    _playstream.elements = $('div[data-type="playstream"]');
    _playstream.elements.each(function(index) {

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


   }
			 
};
