/*!
 * Custom Headline
 */

(function () {
    'use-strict';

    class Headline {
        constructor ($el) {
            this.$el = $el;
        }

        isEmpty () {
            return this.$el.length === 0;
        }

        isExternal () {
            return this.$el.hasClass('external');
        }

        onClick () {
            if (this.isExternal()) {
                window.open(this.$el.data('href'), '_blank');
            } else {
                window.location.href = this.$el.data('href');
            }
        }
    }

    const $document = $(document);
    $document.ready(() => {
        $document.on('click', '.card', e => {
            const headline = new Headline($(e.currentTarget).find('.headline-cnt'));

            if (!headline.isEmpty()) {
                headline.onClick();
            }
        });
    });
})();
