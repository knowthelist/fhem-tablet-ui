
var Modul_readingsgroup = function () {

    function init_attr (elem) {
        elem.initData('get'             , 'STATE');
        elem.initData('max-update'      , 60);

        this.addReading(elem,'get');
    }

    //usage of "function init()" from Modul_widget()

    function update (dev,par) {
        var base = this;
        this.elements.filterDeviceReading('get',dev,par)
        .each(function(index) {
            var elem = $(this);
            var value = elem.getReading('get').val;
            //console.log('readingsgroup:',value);
            if (value) {
                var dNow = new Date();

                var lUpdate = elem.data('lastUpdate') || null;
                var lMaxUpdate = parseInt( elem.data('max-update'));
                if ( isNaN(lMaxUpdate) || (lMaxUpdate < 1) )
                    lMaxUpdate = 10;

                //console.log('readingsgroup update time stamp diff : ', dNow - lUpdate, '   param maxUPdate :' + lMaxUpdate + '    : ' + $(this).data('max-update') );
                lUpdate = ( ((dNow - lUpdate)/1000) > lMaxUpdate ) ? null : lUpdate;
                if ( lUpdate == null ) {
                  //console.log('readingsgroup DO update' );
                  elem.data('lastUpdate', dNow);

                  var cmd =[
                       'get',
                       elem.data('device'),
                       "html"
                  ];
                  ftui.log('readingsgroup update', dev, ' - ', cmd.join(' ') );
                  $.ajax({
                      url: $("meta[name='fhemweb_url']").attr("content") || "../fhem/",
                      async: true,
                      cache: false,
                      context: {elem: elem},
                      data: {
                          cmd: cmd.join(' '),
                          XHR: "1"
                      },
                  }).done(function( data, dev ) {
                      //console.log('received update for dynamic html : ', $(this) );
                        $( this.elem ).html( data );
                    });
                  }
                }
        });
    }

    // public
    // inherit all public members from base class
    return $.extend(new Modul_widget(), {
        //override or own public members
        widgetname: 'readingsgroup',
        init_attr: init_attr,
        update: update,
    });
};
