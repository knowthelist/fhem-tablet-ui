var widget_circlemenu= {
  _circlemenu: null,
  elements: null,
  init: function () {

    if (!$.fn.circleMenu)
        dynamicload('lib/jquery.circlemenu.js', null, null, false);

    _circlemenu=this;
    _circlemenu.elements = $('div[data-type="circlemenu"]>ul');
    _circlemenu.elements.each(function(index){
        var parent = $(this).parent('div[data-type="circlemenu"]');
        $(this).circleMenu({
            item_diameter   : parent.data('item-diameter') || 52,
            item_width      : parent.data('item-width'),
            item_height     : parent.data('item-height'),
            trigger         : 'click',
            circle_radius   : parent.data('circle-radius')||70,
            direction       : parent.data('direction') || 'full',
            border          : parent.data('border') || 'round',
            close_event     : ($(this).hasClass("keepopen")||parent.hasClass("keepopen"))?'':'click',
            close           : function() {
                setTimeout(function(){showModal(false);},50);
            },
            select          : function() {
               setTimeout(function(){showModal(false);},50);
            },
            open:function(){
                var elem=this;
                if (elem.options.close_event!=''){
                    parent.data('timeoutMenu',setTimeout(function(){
                        elem.close();
                        setTimeout(function(){showModal(false);},1000);
                    },parent.data('close-after')||Math.max(4000, 1000*(parent.find('li').length-1))));
                }
               if (!parent.hasClass("noshade"))
                showModal(true);
            },
        })
        .addClass('menu')
        parent.css({minWidth: parent.data('item-width')})
        .closest('.gridster>ul>li').css({overflow: 'visible'});


     });
        $('.menu li:not(:first-child)').on('click', function(){
            var timeoutMenu = $(this).parent().data('timeoutMenu');
            if (timeoutMenu)
                clearTimeout(timeoutMenu);
        });

  },
  update: function (dev,par) {}
};
