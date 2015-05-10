if(typeof widget_widget == 'undefined') {
    loadplugin('widget_widget');
}
var widget_rotor  = $.extend({}, widget_widget, {
  widgetname : 'rotor',
   switchElement:function($elem,delay) {
       var base = this;
       var $nextElem = (!$elem.is(':last-child')) ? $elem.next() : $elem.parent().children().eq(0);
       $elem.removeClass('is-visible').addClass('is-hidden');
       $nextElem.removeClass('is-hidden').addClass('is-visible');
       setTimeout(function(){ base.switchElement($nextElem,delay) }, delay);
   },
  init: function () {
     var base = this;
     this.elements = $('div[data-type="'+this.widgetname+'"]');
     this.elements.each(function(index) {
         $(this).data('delay', $(this).data('delay') || 3500);
         var delay = $(this).data('delay');
         var $elem = $(this);
         $elem.addClass('rotor');
         $elem.find('ul').addClass('rotor-wrapper');
         $elem.find('li').not(":first").addClass('is-hidden');
         $elem.find('li:first').addClass('is-visible');
         setTimeout(function(){
             base.switchElement( $elem.find('.is-visible'),delay )
             }, delay
         );

     });
  },
  update: function (dev,par) {}
});
