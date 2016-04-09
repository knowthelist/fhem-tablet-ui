
var Modul_checkbox = function () {

    if (!$.fn.Switchery){
        ftui.dynamicload('lib/switchery.min.js', null, null, false);
        $('head').append('<link rel="stylesheet" href="'+ ftui.config.dir + '/../lib/switchery.min.css" type="text/css" />');
    }

  function clicked(elem,isClicked) {
      var value = isClicked ? elem.data('set-on') : elem.data('set-off');
      elem.data('value', value);
      elem.transmitCommand();
  };

  function init () {
     var me = this;
     me.elements = $('div[data-type="'+me.widgetname+'"]',me.area);
     me.elements.each(function(index) {
         var elem = $(this);
         elem.data('off-color',            elem.data('off-color')           || getStyle('.checkbox.off','color')              || '#bfbfbf');
         elem.data('off-background-color', elem.data('off-background-color')|| getStyle('.checkbox.off','background-color')   || '#505050');
         elem.data('on-color',             elem.data('on-color')            || getStyle('.checkbox.on','color')               || '#bfbfbf');
         elem.data('on-background-color',  elem.data('on-background-color') || getClassColor($(this)) || getStyle('.checkbox.on','background-color')    || '#aa6900');
         me.init_attr(elem);

         // base element that becomes a Switchery
         var input =  jQuery('<input/>', {
             type:      'checkbox',
             checked:   true,
         }).appendTo(elem);

        // transform the input element into a Switchery
         var switchery = new Switchery(input[0], {
             size:                  elem.hasClass('small')?'small':elem.hasClass('large')?'large':'default',
             color:                 elem.data('on-background-color'),
             secondaryColor:        elem.data('off-background-color'),
             jackColor:             elem.data('on-color'),
             jackSecondaryColor:    elem.data('off-color') ,
         });

         // hack for with() is 0 issue at start
         $(switchery.switcher).css( 'width',elem.hasClass('small')?'33px':elem.hasClass('large')?'66px':'50px');
         $(switchery.jack).css( 'width',elem.hasClass('small')?'20px':elem.hasClass('large')?'40px':'30px');

         // click handler
         var $switcherButton = elem.find('.switchery');
         var touchIsAllowed = false;
         $switcherButton.on('click', function(event) {
             touchIsAllowed = false;
             me.clicked(elem,input.is(":checked"));
         });

         // touch handler
         $switcherButton.on('touchend', function(e) {
             if (touchIsAllowed){
                switchery.setPosition(true);
                me.clicked(elem,input.is(":checked"));
             }
             touchIsAllowed = true;
         });

         $switcherButton.on('touchmove', function(e) {
             e.preventDefault();
         });

         // setState for switchery which lacks of such a function
         switchery.setState = function(checkedBool) {
             if((checkedBool && !switchery.isChecked()) || (!checkedBool && switchery.isChecked())) {
                  switchery.setPosition(true);
                  switchery.handleOnchange(true);
              }

         };

         // store input object for usage in update function of base class
         elem.data("famultibutton",input);

         // provide On / Off functions like a famultibutton
         input.setOn = function() {
           switchery.setState(true);
         };
         input.setOff = function() {
           switchery.setState(false);
         };

         // init state is off
         switchery.setState(false);
     });
  };

    // public
    // inherit members from base class
    return $.extend(new Modul_famultibutton(), {
        //override members
        widgetname: 'checkbox',
        clicked:clicked,
        init:init,
    });
};
