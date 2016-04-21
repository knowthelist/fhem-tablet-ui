
function depends_joinedlabel (){
    if(typeof Modul_label == 'undefined')
        return ["label"];
};

var Modul_joinedlabel = function() {

    function init_attr(elem) {
        console.log('init_attr start');

        _base.init_attr.call(this,elem);
        
        elem.initData('glue', ' ');
        elem.initData('mask', '');
        console.log('init_attr end');
    };
    
    function update_value_cb(value) {
        return value;
    };
    
    function update(dev,par) {
        console.log('update start');
        var me = this;
        me.elements.filterDeviceReading('get',dev,par).each(function(index) {

            var elem = $(this);
            var get = elem.data('get');
            var part = elem.data('part');
            var val = new Array();

            for(var i=0,len=get.length; i<len; i++) {
                var value = elem.getReading('get',i).val;
                value = getPart(value,part);
                value = me.update_value_cb(value);
                if(value)
                    val[i] = '<span class="' + me.widgetname + '_get_' + i + '">' + value + '</span>';
            }
                
            var html;
            elem.empty();
            if(! elem.data('mask')) {
                html = val.join(elem.data('glue'));
            } else {
                var mask = elem.data('mask');
                for(var i=0,len=get.length; i<len; i++)  {
                    v=1*i+1;
                    // "[ pre $1 suf ]"
                    // is replaced with
                    // " pre " + val[1] + " suf "
                    mask = mask.replace(new RegExp('\\[(.*?)\\$'+v+'(.*?)\\]'), (val[i]?'$1'+val[i]+'$2':''));
                    // "$1"
                    // is replaced with
                    // val[1]
                    mask = mask.replace(new RegExp('\\$'+v), val[i]);
                }
                html = mask;
            }
            html = me.update_substitution(html, elem.data('substitution'));
            html = me.update_fix(html, elem.data('fix'));

            var unit = elem.data('unit');
            if(unit) {
                html += "<span style='font-size: 50%;'>"+unit+"</span>";
            }

            elem.html(html);

            me.update_colorize(html, elem);
        });
    };

    // public
    // inherit members from base class
    var base = new Modul_label();
    var _base = {};
    _base.init_attr = base.init_attr;
    return $.extend(base, {
        //override members
        widgetname:         'joinedlabel',
        init_attr:          init_attr,
        update:             update,
        update_value_cb:    update_value_cb,
    });
}
