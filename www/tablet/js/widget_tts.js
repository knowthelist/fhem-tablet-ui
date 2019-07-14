/* global ftui:true, Modul_widget:true */

var Modul_tts = function () {

  function init_attr(elem) {
    elem.initData('get', 'state');
    elem.initData('voice', 'de-DE');
    elem.initData('pitch', 0.9);
    elem.initData('rate', 1.0);
    elem.initData('volume', 1.0);

    this.addReading(elem, 'get');
  }

  function init_ui(elem) {
    // get all voices that browser offers
    var availableVoices = window.speechSynthesis.getVoices();

    // find voice by language
    for (var i = 0; i < availableVoices.length; i++) {
      if (availableVoices[i].lang === elem.data('voice')) {
        elem.data('synthVoice', availableVoices[i]);
        break;
      }
    }

    // hide the widget
    elem.hide();
  }

  function update(dev, par) {

    // update from normal state reading
    me.elements.filterDeviceReading('get', dev, par)
      .each(function () {
        var elem = $(this);

        var updateTime = elem.getReading('get').date;
        var text = elem.getReading('get').val;
        // do not playback
        // if it is the first time update was called (initialization)?
        if (!me.lastUpdateTime) {
          ftui.log(2, 'tts: initial update. setting timestamp to ' + updateTime);
          me.lastUpdateTime = updateTime;
          return;
        }

        // do not playback
        // if timestamp did not change
        if (me.lastUpdateTime === updateTime) {
          ftui.log(2, 'tts: update called but timestamp did not change (' + me.lastUpdateTime + ' = ' + updateTime + ')');
          return;
        }

        // now lets start tts synthesis

        // remember time
        ftui.log(2, 'tts: update called with new timestamp (' + me.lastUpdateTime + ' != ' + updateTime + '). Speak: ' + text + ')');

        me.lastUpdateTime = updateTime;

        // start playback
        var utter = new SpeechSynthesisUtterance();
        utter.rate = parseFloat(elem.data('rate'));
        utter.pitch = parseFloat(elem.data('pitch'));
        utter.volume = parseFloat(elem.data('volume'));
        utter.text = text;
        if (elem.isValidData('synthVoice') ) {
          utter.voice = elem.data('synthVoice');
        }
        

        window.speechSynthesis.speak(utter);

      });
  }

  // public
  // inherit all public members from base class
  var me = $.extend(new Modul_widget(), {
    //override or own public members
    widgetname: 'tts',
    init_attr: init_attr,
    init_ui: init_ui,
    update: update,
  });
  return me;
};
