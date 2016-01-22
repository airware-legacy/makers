'use-strict';

/*!
 * Custom Layout
 */

(function () {
    class Layout {
        constructor () {
            this.$window = $(window);
            this.$header = $('.airware-header');
            this.$hero = $('.airware-hero');

            this.options = {
                header : {
                    css : {
                        opacity : 0
                    }
                },
                hero : {
                    transition : 'transition.slideDownBigIn',
                    duration   : 500
                }
            };

            this.$window.scroll(this.onScroll.bind(this));
            this.slideInHero();
            this.setGlobalLinkClickListener();
        }

        setGlobalLinkClickListener () {
            $(document).on('click', '.external', e => {
                e.stopPropagation();
                e.preventDefault();
                window.open($(e.currentTarget).attr('href'), '_blank');
            });
        }

        slideInHero () {
            this.$hero.velocity(this.options.hero.transition, { duration : this.options.hero.duration });
        }

        onScroll () {
            if (this._isHeaderInViewport()) {
                this.options.header.css.opacity = 1;
            } else {
                this.options.header.css.opacity = 0;
            }

            this.$header.css(this.options.header.css);
        }

        _isHeaderInViewport () {
            return this.$header.outerHeight() >= this.$window.scrollTop();
        }
    }

    $(document).ready(() => {
        new Layout();
    });
})();
