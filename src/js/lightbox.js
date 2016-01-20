/*!
 * Custom Lightbox
 */

(function () {
    const KEYS = {
        ESCAPE      : 27,
        ARROW_LEFT  : 37,
        ARROW_RIGHT : 39
    };

    function Lightbox () {
        this.hide = this.hide.bind(this);
        this.prev = this.prev.bind(this);
        this.next = this.next.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);

        this.$el = $('.airware-lightbox');
        this.$content = this.$el.find('.airware-lightbox-content');
        this.$counter = this.$el.find('.airware-lightbox-counter');

        this.$leftArrow = this.$el.find('.airware-lightbox-left-arrow');
        this.$leftArrow.on('click', this.prev);

        this.$rightArrow = this.$el.find('.airware-lightbox-right-arrow');
        this.$rightArrow.on('click', this.next);

        this.$body = $('body');
        this.$document = $(document);
        this.swipeManager = this.$document.hammer();

        this.$close = this.$el.find('.airware-lightbox-dismiss');
        this.$close.on('click', this.hide);

        this._current = -1;
        this._$images = null;
        this._isAnimating = false;

        this.options = {
            overlay : {
                transitions : {
                    delay    : 100,
                    duration : 100,
                    in       : 'transition.fadeIn',
                    out      : 'transition.fadeOut'
                }
            },
            content : {
                transitions : {
                    delay    : 100,
                    duration : 200,
                    in       : 'airware.expandIn',
                    out      : 'airware.expandOut'
                }
            }
        };

        // hack to fix fixed position scrolling bug in iOS 8
        $.Velocity.hook(this.$el, 'translateZ', '1px');
    }

    Lightbox.prototype.onKeyDown = function (e) {
        const keyCode = e.keyCode || e.which;

        if (keyCode === KEYS.ESCAPE) {
            this.hide();
        } else if (keyCode === KEYS.ARROW_LEFT) {
            this.prev();
        } else if (keyCode === KEYS.ARROW_RIGHT) {
            this.next();
        }
    };

    Lightbox.prototype.prev = function () {
        if (this._isAnimating || this._current <= 0) {
            return;
        }
        const $current = this._getCurrentImage();
        this._current--;
        this.updateCounter();
        this._slide($current, $current.prev(), 'airware.lightbox.slideRightOut', 'airware.lightbox.slideLeftIn');
    };

    Lightbox.prototype.next = function () {
        if (this._isAnimating || this._current >= this._$images.length - 1) {
            return;
        }
        const $current = this._getCurrentImage();
        this._current++;
        this.updateCounter();
        this._slide($current, $current.next(), 'airware.lightbox.slideLeftOut', 'airware.lightbox.slideRightIn');
    };

    Lightbox.prototype.show = function ($current, $imgs) {
        const self = this;
        let html = '';

        this._current = $current.data('lightbox-img');

        $imgs.each(function (index) {
            const src = $(this).attr('src');
            const cls = (index === self._current ? 'active' : 'hidden');
            html += `<img src="${src}" class="airware-lightbox-img ${cls}">`;
        });

        // set document events
        this.$document.on('keydown', this.onKeyDown);
        this.swipeManager.on('swiperight', this.prev);
        this.swipeManager.on('swipeleft', this.next);

        // add content
        this.$content.append(html);
        this._$images = this.$content.children();
        this.updateCounter();

        this.$el.velocity(this.options.overlay.transitions.in, {
            duration : this.options.overlay.transitions.duration,

            begin () {
                self.$el.removeClass('hidden');
                self._scrollLock(true);

                self.$content.velocity(self.options.content.transitions.in, {
                    delay    : self.options.content.transitions.delay,
                    duration : self.options.content.transitions.duration
                });
            },

            complete () {
                self.$close.addClass('active');
            }
        });
    };

    Lightbox.prototype.hide = function () {
        const self = this;

        // remove document events
        this.$document.off('keydown', this.onKeyDown);
        this.swipeManager.off('swiperight', this.prev);
        this.swipeManager.off('swipeleft', this.next);

        this.$content.velocity(this.options.content.transitions.out, {
            duration : this.options.content.transitions.duration,

            begin () {
                self.$close.removeClass('active');

                self.$el.velocity(self.options.overlay.transitions.out, {
                    delay    : self.options.overlay.transitions.delay,
                    duration : self.options.content.transitions.duration,

                    complete () {
                        self.$el.addClass('hidden');
                        self._scrollLock(false);
                        self.destroy();
                    }
                });
            }
        });
    };

    Lightbox.prototype.updateCounter = function () {
        const n = this._current + 1;
        const txt = `${n}/${this._$images.length}`;
        this.$counter.text(txt);
        this.$leftArrow.toggleClass('hidden', this._current === 0);
        this.$rightArrow.toggleClass('hidden', this._current === this._$images.length - 1);
    };

    Lightbox.prototype.destroy = function () {
        this.$content.html('');
        this._current = -1;
        this._$images = null;
    };

    Lightbox.prototype._getCurrentImage = function () {
        return this._$images.eq(this._current);
    };

    Lightbox.prototype._scrollLock = function (isLock) {
        if (isLock) {
            this.$body.addClass('scroll-lock');
        } else {
            this.$body.removeClass('scroll-lock');
        }
    };

    Lightbox.prototype._slide = function ($first, $second, firstTransition, secondTransition) {
        const self = this;

        $.Velocity.hook($first, 'translateY', '-50%');
        $.Velocity.hook($second, 'translateY', '-50%');

        $first.velocity(firstTransition, {
            display : 'block',

            begin () {
                self._isAnimating = true;
            },

            complete () {
                $first.removeClass('active').addClass('hidden');

                $second.velocity(secondTransition, {
                    display : 'block',

                    begin () {
                        $second.addClass('active').removeClass('hidden');
                    },

                    complete () {
                        self._isAnimating = false;
                    }
                });
            }
        });
    };

    const $document = $(document);
    $document.ready(() => {
        const lightbox = new Lightbox();

        $document.on('click', '[data-lightbox-img]', e => {
            const $currentImg = $(e.currentTarget);
            const $imgs = $currentImg.closest('[data-lightbox]').find('[data-lightbox-img]');

            if ($imgs.length) {
                lightbox.show($currentImg, $imgs);
            }
        });
    });
})();
