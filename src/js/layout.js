/*!
 * Custom Layout
 */

(function () {
    'use-strict';

    var headerCss = { opacity: 0 };

    function Layout() {
        this.$window = $(window);
        this.$header = $('.airware-header');
        this.$window.scroll(this.onScroll.bind(this));
    }

    Layout.prototype.onScroll = function () {
        if (!this._isHeaderInViewport()) {
            headerCss.opacity = 0;
        } else {
            headerCss.opacity = 1;
        }
        this.$header.css(headerCss);
    };

    Layout.prototype._isHeaderInViewport = function () {
        return this.$header.outerHeight() >= this.$window.scrollTop();
    };

    var $document = $(document);
    $document.ready(function () {
        new Layout();
    });
})();