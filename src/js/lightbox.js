/*!
 * Custom Lightbox
 */

(function () {
    function Lightbox() {
        this.$el = $('.airware-lightbox');
        this.$content = this.$el.find('.airware-lightbox-content');

        this.$close = this.$el.find('.airware-lightbox-dismiss');
        this.$close.on('click', this.hide.bind(this));

        this._current = -1;
    }

    Lightbox.prototype.next = function () {

    };

    Lightbox.prototype.prev = function () {

    };

    Lightbox.prototype.show = function ($current, $imgs) {
        var self = this, html = '';

        this._current = $current.data('lightbox-img');

        $imgs.each(function (index) {
            var src = $(this).attr('src');
            html += '<img src="' + src + '" class="' + (index === self._current ? 'active': 'hidden') + '">';
        });

        // add content
        this.$content.append(html);

        this.$el.velocity('transition.fadeIn', {
            duration: 100,

            begin: function () {
                self.$el.removeClass('hidden');

                self.$content.velocity('transition.expandIn', {
                    delay: 100,
                    duration: 200
                });
            }
        });
    };

    Lightbox.prototype.hide = function () {
        var self = this;

        this.$content.velocity('transition.expandOut', {
            duration: 200,

            begin: function () {
                self.$el.velocity('transition.fadeOut', {
                    delay: 100,
                    duration: 200,

                    complete: function () {
                        self.$el.addClass('hidden');
                        self.$content.html('');
                    }
                });
            }
        });
    };

    var $document = $(document);
    $document.ready(function () {
        var lightbox = new Lightbox();

        $document.on('click', '[data-lightbox-img]', function (e) {
            var $currentImg = $(e.currentTarget);
            var $imgs = $currentImg.closest('[data-lightbox]').find('[data-lightbox-img]');

            if ($imgs.length) {
                lightbox.show($currentImg, $imgs);
            }
        });
    });
})();