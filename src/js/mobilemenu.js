/*!
 * Custom Mobile Menu
 */

(function () {
    'use-strict';

    class Hamburger {
        constructor (menu) {
            this.css = { zIndex : 0 };
            this.menu = menu;
            this.$el = $('.airware-nav-hamburger');
            this.$el.on('click', this.onClick.bind(this));
        }

        onClick () {
            if (this.isActive()) {
                this.$el.removeClass('active');
                this.menu.hide();
            } else {
                this.$el.addClass('active');
                this.menu.show();
            }
        }

        isActive () {
            return this.$el.hasClass('active');
        }

        onShow (zIndex) {
            this.css.zIndex = zIndex + 1;
            this.$el.css(this.css);
        }

        onHide () {
            this.css.zIndex = 0;
            this.$el.css(this.css).removeClass('active');
        }
    }

    class MobileMenu {
        constructor () {
            // jquery elements
            this.$body = $('body');
            this.$window = $(window);
            this.$el = $('.airware-mobile-menu');

            // views
            this.hamburger = new Hamburger(this);

            this.options = {
                transitions : {
                    in  : 'airware.expandIn',
                    out : 'airware.expandOut'
                },
                breakpoint : 768
            };

            this.$window.on('resize', this.onResize.bind(this));

            // hack to fix iOS 8 positioning issue
            $.Velocity.hook(this.$el, 'translateZ', 1);
        }

        onResize () {
            if (this.$window.outerWidth() >= this.options.breakpoint) {
                this.hide();
            }
        }

        show () {
            const self = this;

            this.$el.velocity('stop').velocity(this.options.transitions.in, {
                begin () {
                    self.hamburger.onShow(self.getZIndex());
                    self.$el.removeClass('hidden');
                    self._scrollLock(true);
                }
            });
        }

        getZIndex () {
            return +this.$el.css('z-index');
        }

        hide () {
            const self = this;

            this.$el.velocity('stop').velocity(this.options.transitions.out, {
                begin () {
                    self.hamburger.onHide();
                },

                complete () {
                    self.$el.addClass('hidden');
                    self._scrollLock(false);
                }
            });
        }

        _scrollLock (isLock) {
            this.$body.toggleClass('scroll-lock', isLock);
        }
    }

    $(document).ready(() => {
        new MobileMenu();
    });
})();
