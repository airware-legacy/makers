/*!
 * Custom Modal
 */

(function () { //eslint-disable-line no-extra-semi
    'use-strict';

    function Modal() {
        this.$el = $('.airware-modal');
        this.$body = $('body');
        this.$window = $(window);
        this.$content = this.$el.find('.airware-modal-content');
    }

    Modal.prototype.resize = function (breakpoint) {
        this.$window.on('resize', this.onResize.bind(this, breakpoint));
    };

    Modal.prototype.onResize = function (breakpoint) {
        if (this.$window.outerWidth() >= breakpoint) {
            this.hide();
        }
    };

    Modal.prototype.isVisible = function () {
        return !this.$el.hasClass('hidden');
    };

    Modal.prototype.autoclose = function () {
        this.$el.on('click', this.hide.bind(this));
    };

    Modal.prototype.setOptions = function (options) {
        if (!options) {
            return;
        }

        if (options.autoclose) {
            this.autoclose();
        }

        if (options.lightbox) {
            this._lightbox = options.lightbox;
        }

        if (typeof options.breakpoint === 'number') {
            this.resize(options.breakpoint);
        }

        if (typeof options.onShowBegin === 'function') {
            this._onShowBegin = options.onShowBegin;
        }

        if (typeof options.onHideBegin === 'function') {
            this._onHideBegin = options.onHideBegin;
        }
    };

    Modal.prototype.show = function ($template) {
        var self = this, html;

        if ($template.length) {
            html = $template.html();
        } else if (this._lightbox) {
            this.$el.addClass('lightbox');
            html = '<img src="' + this._lightbox + '" />';
        }

        if (this.isVisible() || html === this.$content.html()) {
            return;
        }

        this.$el.velocity('stop').velocity('transition.expandIn', {
            duration: 200,

            begin: function () {
                if (self._onShowBegin) {
                    self._onShowBegin();
                }

                self._updateContent(html);
                self.$el.removeClass('hidden');
                self._scrollLock(true);
            }
        });
    };

    Modal.prototype.getZIndex = function () {
        return +this.$el.css('z-index');
    };

    Modal.prototype.hide = function () {
        var self = this;

        if (!this.isVisible()) {
            return;
        }

        this.$el.velocity('stop').velocity('transition.expandOut', {
            duration: 100,

            begin: function () {
                if (self._onHideBegin) {
                    self._onHideBegin();
                }
            },

            complete: function () {
                self.$el.addClass('hidden');
                self._updateContent();
                self._scrollLock(false);
                self.destroy();
            }
        });
    };

    Modal.prototype.destroy = function () {
        this.$window.off('resize');
        this.$el.removeClass('lightbox');
        this._onShowBegin = null;
        this._onHideBegin = null;
    };

    Modal.prototype._updateContent = function (contentHTML) {
        this.$content.html(contentHTML || '');
    };

    Modal.prototype._scrollLock = function (isLock) {
        if (isLock) {
            this.$body.addClass('scroll-lock');
        } else {
            this.$body.removeClass('scroll-lock');
        }
    };

    var $document = $(document);
    $document.ready(function () {
        var modal = new Modal();

        $document.on('click', '[data-modal="open"]', function (e) {
            var $el = $(e.currentTarget);

            modal.setOptions({
                breakpoint: +$el.data('modal-breakpoint') || 0,
                autoclose: $el.data('modal-autoclose'),
                lightbox: $el.data('modal-lightbox'),

                onShowBegin: function () {
                    $el.attr('data-modal', 'close');
                    $el.css({ zIndex: modal.getZIndex() + 1 });
                },

                onHideBegin: function () {
                    $el.attr('data-modal', 'open');
                    $el.css({ zIndex: 0 });
                }
            });

            modal.show($($el.data('modal-template')));
        });

        $document.on('click', '[data-modal="close"]', function (e) {
            modal.hide();
        });
    });
})();