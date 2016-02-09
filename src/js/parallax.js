'use-strict';

/*!
 * Custom Parallax
 */

(function () {
    const parser = new UAParser();
    const device = parser.getDevice();
    const browser = parser.getBrowser();

    class Parallax {
        constructor () {
            this.$window = $(window);
            this.$header = $('.airware-header-bg');
            this.$hero = $('.airware-hero');

            this.options = {
                hero : {
                    transition : 'transition.slideDownBigIn',
                    duration   : 500
                }
            };

            this.slideInHero();
        }

        slideInHero () {
            const self = this;

            this.$hero.velocity(this.options.hero.transition, {
                duration : this.options.hero.duration,

                complete () {
                    if (self.shouldParallax()) {
                        self.parallax(self.$header, 0.1);
                        self.parallax(self.$hero, 0.5);
                    }
                }
            });
        }

        shouldParallax () {
            return typeof window.requestAnimationFrame !== 'undefined' && browser.name !== 'IE' && device.type !== 'mobile' && device.type !== 'tablet';
        }

        parallax ($el, rate) {
            const self = this;

            this.$window.scroll(() => {
                window.requestAnimationFrame(() => {
                    self.transform($el, (self.$window.scrollTop() / self.$window.outerHeight()) * ($el.outerHeight() * rate));
                });
            });
        }

        transform ($el, pos) {
            $el.css({ transform : `translate3d(0, ${pos}%, 0)` });
        }
    }

    $(document).ready(() => {
        new Parallax();
    });
})();

