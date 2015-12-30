/*!
 * Custom Layout
 */

(function () {
    'use-strict';

    function Layout() {
        this.$window = $(window);
        this.$header = $('.airware-header');
        this.$hero = $('.airware-hero');

        this.options = {
            header: {
                css: {
                    opacity: 0
                }
            },
            hero: {
                transition: 'transition.slideDownBigIn',
                duration: 500
            }
        };

        this.$window.scroll(this.onScroll.bind(this));
        this.slideInHero();
    }

    Layout.prototype.slideInHero = function () {
       this.$hero.velocity(this.options.hero.transition, {
           duration: this.options.hero.duration
       });
    };

    Layout.prototype.onScroll = function () {
        if (!this._isHeaderInViewport()) {
            this.options.header.css.opacity = 0;
        } else {
            this.options.header.css.opacity = 1;
        }
        this.$header.css(this.options.header.css);
    };

    Layout.prototype._isHeaderInViewport = function () {
        return this.$header.outerHeight() >= this.$window.scrollTop();
    };

    $(document).ready(function () {
        new Layout();
    });
})();