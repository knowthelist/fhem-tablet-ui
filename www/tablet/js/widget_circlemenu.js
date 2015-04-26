var widget_circlemenu= {
  _circlemenu: null,
  elements: null,
  init: function () {
    _circlemenu=this;
              if ($.fn.circleMenu){
    _circlemenu.elements = $('div[data-type="circlemenu"]>ul');
    _circlemenu.elements.each(function(index) {
            var parent = $(this).parent('div[data-type="circlemenu"]');
            $(this).circleMenu({item_diameter: parent.data('item-diameter')||52,
                trigger:'click',
                circle_radius:parent.data('circle-radius')||70,
                direction: parent.data('direction') || 'full',
                close_event:$(this).hasClass("keepopen")?'':'click',
                close:function() {
                    setTimeout(function(){showModal(false);},50);
                },
                select:function() {
                   setTimeout(function(){showModal(false);},50);
                },
                open:function(){
                    var elem=this;
                    if (elem.options.close_event!=''){
                        timeoutMenu=setTimeout(function(){
                            elem.close();
                            setTimeout(function(){showModal(false);},1000);
                        },parent.data('close-after')||Math.max(4000, parent.find('li').length-1));
                    }
                   showModal(true);
                },
            })
            .addClass('menu')
            .closest('.gridster>ul>li').css({overflow: 'visible'});

     });
            $('.menu li:not(:first-child)').on('click', function(){
                    clearTimeout(timeoutMenu);
            });

                   }
  },
  update: function (dev,par) {


   }
			 
};
