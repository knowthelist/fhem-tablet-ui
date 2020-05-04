// FTUI Widget widget_loading.js
// roman1528

var Modul_loading = function () {
	
	function runLoad (elem) {
		$(document).one("initWidgetsDone",function(){
			$('#loadingIcon').show();
			if (elem.data('shade')) {
				$('#shade').show();
			}
		});
		
		$(document).one("updateDone",function(){
			$('#loadingIcon').hide();
			if (elem.data('shade')) {
				$('#shade').hide();
			}
			
			$(document).on("loadPage",function(){
				$('#loadingIcon').show();
			if (elem.data('shade')) {
				$('#shade').show();
			}
			});
			
			$(document).on("initWidgetsDone",function(){
				$('#loadingIcon').hide();
			if (elem.data('shade')) {
				$('#shade').hide();
			}
			});
		});
	};
	
    function init () {
        var me = this;
        this.elements = $('div[data-type="'+this.widgetname+'"]',this.area);
        this.elements.each(function(index) {
            var elem = $(this);
			var zindex = '2';
			
			elem.initData('color'	,'#222');
			elem.initData('icon'	,'fa-cog');
			elem.initData('effect'	,'fa-spin');
			elem.initData('shade'	,false);
			
			if (elem.data('shade')) {
				zindex = '1002';
			}
			
			$('<i id="loadingIcon" />')
				.addClass('fa '+elem.data('icon')+' '+elem.data('effect')+'')
				.css({'position': 'absolute',
						'z-index': zindex,
						'color': elem.data('color'),
					})
				.appendTo(elem)
				.hide();
			
			runLoad(elem);
        });
    };

    return $.extend(new Modul_widget(), {
        widgetname: 'loading',
        init: init,
    });
};
