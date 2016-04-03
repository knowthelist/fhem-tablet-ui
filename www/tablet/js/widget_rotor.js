var Modul_rotor = function () {

   function switchElement ($elem,delay) {
       var base = this;
       var $nextElem = (!$elem.is(':last-child')) ? $elem.next() : $elem.parent().children().eq(0);
       $elem.removeClass('is-visible').addClass('is-hidden');
       $nextElem.removeClass('is-hidden').addClass('is-visible');
       setTimeout(function(){ switchElement($nextElem,delay) }, delay);
   };

  function init () {
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
             switchElement( $elem.find('.is-visible'),delay )
             }, delay
         );

     });
  };

  function update (dev,par) {};

 // public
 // inherit all public members from base class
 return $.extend(new Modul_widget(), {
     //override or own public members
     widgetname: 'rotor',
     init:init,
     update: update,
 });
};
