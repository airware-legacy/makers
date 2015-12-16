;(function () {
    var isIE = !_.isUndefined(window.ActiveXObject);
    var vendors = ['moz', 'webkit', 'o'];

    if (!window.requestAnimationFrame) {
        for (var i = 0; i < vendors.length; i++) {
            var fn = window[vendors[i] + 'RequestAnimationFrame'];

            if (typeof fn === 'function') {
                window.requestAnimationFrame = fn;
            }
        }
    }

    $(document).ready(function() {
        if (!isIE && window.requestAnimationFrame) {
            parallax($('.airware-header'), 0.3);
            parallax($('.airware-hero'), 0.1);
        }
    });

    function parallax($el, rate) {
        var $window = $(window);
        var windowHeight = $window.outerHeight();
        var elementHeight = $el.outerHeight();
        var elementOffset = $el.offset().top;
        var elementPosition = { x: 0, y: 0, z: 0 };

        $(document).scroll(function () {
            window.requestAnimationFrame(function () {
                var currentScrollTop = $window.scrollTop();

                if (isElementInViewPort($el, currentScrollTop)) {
                    elementPosition.y = Math.round((currentScrollTop - elementOffset) * rate);

                    if (elementPosition.y < 0) {
                        return;
                    }

                    transform($el, elementPosition);
                }
            });
        });
    }

    function isElementInViewPort(elementOffset, elementHeight, currentScrollTop) {
        return !(elementOffset <= currentScrollTop && elementOffset + elementHeight >= currentScrollTop);
    }

    function transform($el, pos) {
        $el.css({ transform: translate(pos) });

        for (var i = 0; i < vendors.length; i++) {
            var css = {};
            css[vendors[i] + 'Transform'] = translate(pos);
            $el.css(css);
        }
    }

    function translate(pos) {
        return 'translate3d(' + pos.x +'px, ' + pos.y + 'px, ' + pos.z + 'px)';
    }
})();