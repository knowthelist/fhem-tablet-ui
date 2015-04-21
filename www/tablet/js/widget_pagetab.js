var widget_pagetab= {
    widgetname : 'pagetab',
    lastPage : '',
    _pagetab : null,
    loadPage: function (goUrl){
        $("div.gridster").fadeOut('fast');
        $.get(goUrl, function (data_html) {
            $("div.gridster")
              .html($(data_html).closest('div.gridster').html())
              .fadeIn('slow');
            initPage();
        });
    },
    init: function () {
      _pagetab=this;
      this.elements = $('div[data-type="'+this.widgetname+'"]');
      this.elements.each(function(index) {
          var elem_url=$(this).data('url');
          var isCurrent=false;
          if (elem_url.indexOf(filename)>-1 && !window.location.hash
                  || window.location.hash.indexOf(elem_url,1)>-1){
              isCurrent=true;
          }

          var elem = $(this).famultibutton({
              backgroundIcon: 'fa-circle',
              onColor: '#222222',
              onBackgroundColor: '#606060',
              offColor: '#606060',
              offBackgroundColor: 'transparent',
              mode: 'toggle',

              // Called in toggle on state.
              toggleOn: function( ) {
                  lastPage=elem_url;
                  window.location.hash = elem_url;
                  _pagetab.loadPage(elem_url);
              },
              toggleOff: function( ) {
                    setInterval(function() {elem.setOn()}, 50);
              },

           })
           .attr('title',$(this).data('url'));

          if (isCurrent)
              elem.setOn();
          else
              elem.setOff();
        });

        window.onpopstate = function(event) {
            var hashUrl=window.location.hash.replace('#','');
            if (lastPage!=hashUrl){
                    _pagetab.loadPage(hashUrl);
            }
        };
    },
  
    update: function (dev,par) {

    }       
};
