/**
 * jQuery Unveil
 * A very lightweight jQuery plugin to lazy load images
 * inspired from http://luis-almeida.github.com/unveil (2013 Luís Almeida)
 *
 * Copyright (c) 2017 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 * https://github.com/knowthelist/fhem-tablet-ui
 */

;(function($) {

$.fn.unveil = function (options) {

    var opts = $.extend({}, $.fn.unveil.defaults, options);

    var loaded,
        images = this;

    this.one("unveil", function () {
        //console.log('unveil');
        var elem = $(this).find('[' + opts.attrib + ']');
        var source = elem.attr(opts.attrib);
        if (source) {
            elem.attr("src", source);
            if (typeof opts.afterUnveil === "function") opts.afterUnveil.call(this);
        }
    });

    function unveil() {

        var inview = images.filter(function () {
            var elem = $(this);
            if (elem.is(":hidden")) return;

            var viewTop = opts.container.scrollTop(),
                viewBottom = viewTop + opts.container.height(),
                elemTop = elem.position().top,
                elemBottom = elemTop + elem.height();
            //console.log(elemTop,elemBottom ,viewTop - opts.threshold, viewBottom + opts.threshold);
            return elemBottom >= viewTop - opts.threshold && elemTop <= viewBottom + opts.threshold;
        });
        loaded = inview.trigger("unveil");
        images = images.not(loaded);
    }

    opts.container.on("scroll.unveil resize.unveil", unveil);
    $(document).on(opts.customEvent, unveil);

    unveil();

    return this;

};


// Plugin defaults
$.fn.unveil.defaults = {
    container: $(window),
    threshold: 0,
    attrib: "data-src",

};


})(window.jQuery);