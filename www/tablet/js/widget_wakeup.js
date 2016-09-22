function depends_wakeup (){
    if (!$.fn.wakeup){
         return ["lib/jquery.wakeup.js"];
    }
};

var Modul_wakeup= function () {

    // mandatory function, get called on start up
    function init () {
        var bell_id = $.wakeUp(function() {
          setTimeout(function(){
                ftui.setOnline();
            }, 3000);
        });
    };

    // mandatory function, get called after start up once and on every FHEM poll response
    // here the widget get updated
    function update (dev,par) { }

    // public
    // inherit all public members from base class
    return $.extend(new Modul_widget(), {
        //override or own public members
        widgetname: 'wakeup',
        init: init,
        update: update,
    });
};
