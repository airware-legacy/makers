/*!
 * Custom Mobile Menu
 */

(function () {
    'use-strict';

    function Hamburger(menu) {
        this.css = { zIndex: 0 };
        this.menu = menu;
        this.$el = $('.airware-nav-hamburger');
        this.$el.on('click', this.onClick.bind(this));
    }

    Hamburger.prototype.onClick = function () {
        if (this.isActive()) {
            this.$el.removeClass('active');
            this.menu.hide();
        } else {
            this.$el.addClass('active');
            this.menu.show();
        }
    };

    Hamburger.prototype.isActive = function () {
        return this.$el.hasClass('active');
    };

    Hamburger.prototype.onShow = function (zIndex) {
        this.css.zIndex = zIndex + 1;
        this.$el.css(this.css);
    };

    Hamburger.prototype.onHide = function () {
        this.css.zIndex = 0;
        this.$el.css(this.css);
    };

    function MobileMenu() {
        // jquery elements
        this.$body = $('body');
        this.$window = $(window);
        this.$el = $('.airware-mobile-menu');

        // views
        this.hamburger = new Hamburger(this);

        this.options = {
            transitions: {
                in: 'transition.expandIn',
                out: 'transition.expandOut'
            },
            duration: 200,
            breakpoint: 992
        };

        this.$window.on('resize', this.onResize.bind(this));
    }

    MobileMenu.prototype.onResize = function () {
        if (this.$window.outerWidth() >= this.options.breakpoint) {
            this.hide();
        }
    };

    MobileMenu.prototype.show = function () {
        var self = this;

        this.$el.velocity('stop').velocity(this.options.transitions.in, {
            duration: this.options.duration,

            begin: function () {
                self.hamburger.onShow(self.getZIndex());
                self.$el.removeClass('hidden');
                self._scrollLock(true);
            }
        });
    };

    MobileMenu.prototype.getZIndex = function () {
        return +this.$el.css('z-index');
    };

    MobileMenu.prototype.hide = function () {
        var self = this;

        this.$el.velocity('stop').velocity(this.options.transitions.out, {
            duration: this.options.duration,

            begin: function () {
                self.hamburger.onHide();
            },

            complete: function () {
                self.$el.addClass('hidden');
                self._scrollLock(false);
            }
        });
    };

    MobileMenu.prototype._scrollLock = function (isLock) {
        if (isLock) {
            this.$body.addClass('scroll-lock');
        } else {
            this.$body.removeClass('scroll-lock');
        }
    };

    $(document).ready(function () {
        new MobileMenu();
    });
})();