var widget_readingsgroup = {
  _readingsgroup: null,
  elements: null,
  init: function () {
  	_readingsgroup=this;
  	_readingsgroup.elements = $('div[data-type="readingsgroup"]');
  },

  update: function (dev,par) {

//    console.log('readingsgroup update'); 
    var deviceElements= _readingsgroup.elements.filter('div[data-device="'+dev+'"]');
    deviceElements.each(function(index) {
      var dNow = new Date();
      
      var lUpdate = $(this).data('lastUpdate') || null;
      var lMaxUpdate = parseInt( $(this).data('max-update'));
      if ( isNaN(lMaxUpdate) || (lMaxUpdate < 1) )
          lMaxUpdate = 10;
      
//        console.log('readingsgroup update time stamp diff : ', dNow - lUpdate, '   param maxUPdate :' + lMaxUpdate + '    : ' + $(this).data('max-update') ); 
      lUpdate = ( ((dNow - lUpdate)/1000) > lMaxUpdate ) ? null : lUpdate;
      if ( lUpdate == null ) {
//        console.log('readingsgroup DO update' ); 
        $(this).data('lastUpdate', dNow);
      
        var cmd =[
             'get',
             dev,
             "html"
        ];
        DEBUG && console.log('readingsgroup update', dev, ' - ', cmd.join(' ') ); 
        $.ajax({
            url: $("meta[name='fhemweb_url']").attr("content") || "../fhem/",
            async: true,
            cache: false,
            context: {elem: $(this)},
            data: {
                cmd: cmd.join(' '),
                XHR: "1"
            },
        }).done(function( data, dev ) {
  //          console.log('received update for dynamic html : ', $(this) ); 
              $( this.elem ).html( data );
          });
        }
        
    });

    }
			 
};
