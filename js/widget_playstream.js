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
			
			// Called in toggle on state.
			toggleOn: function( ) {
                 $(this).data('audio').play();
			},
			toggleOff: function( ) {
                 $(this).data('audio').pause();
			},
		});
	 });
  },
  update: function (dev,par) {


   }
			 
};
