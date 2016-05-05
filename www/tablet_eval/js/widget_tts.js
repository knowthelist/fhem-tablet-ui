// load responsicevoice lib

function depends_tts() {
    if (!$.fn.tts) {
        return ['lib/responsivevoice.js'];
    }
}

var Modul_tts = function () {

    function init_attr(elem) {
        elem.initData('get'  , 'state');
        elem.initData('voice', 'Deutsch Female');
        elem.initData('pitch', 1.0);
        elem.initData('rate',  1.0);
        elem.initData('volume', 1.0);

        this.addReading(elem, 'get');
    };

    function init_ui(elem) {
        // dynamically loading prevents responsivevoice from initializing
        // ...so do it manually
        responsiveVoice.init();
        // hide the widget
        elem.hide();
    };

    function update_cb(elem) {
    };

    function update(dev,par) {

        me = this;
        // update from normal state reading
        me.elements.filterDeviceReading('get',dev,par)
        .each(function(index) {
            var elem = $(this);

            var updateTime = elem.getReading('get').date;

            // do not playback
            // if it is the first time update was called (initialization)?
            if( !me.lastUpdateTime ) {
                me.lastUpdateTime = updateTime;
                return;
            }

            // do not playback
            // if timestamp did not change
            if (me.lastUpdateTime == updateTime) {
                return;
            }

            // now lets start tts synthesis

            // remember time
            me.lastUpdateTime = updateTime;

            // start playback
            responsiveVoice.speak(
                  elem.getReading('get').val
                , elem.data('voice')
                , {
                      pitch: parseFloat(elem.data('pitch'))
                    , rate: parseFloat(elem.data('rate'))
                    , volume: parseFloat(elem.data('volume'))
                }
            );
        });
    };

    // public
    // inherit all public members from base class
    var me = this;
    return $.extend(new Modul_widget(), {
        //override or own public members
        widgetname: 'tts',
        init_attr: init_attr,
        init_ui:init_ui,
        update: update,
        update_cb: update_cb,
    });
};
