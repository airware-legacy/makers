/*!
 * Custom Headline
 */

(function () {
    'use-strict';

    function Headline ($el) {
        this.$el = $el;
    }

    Headline.prototype.isEmpty = function () {
        return this.$el.length === 0;
    };

    Headline.prototype.isExternal = function () {
        return this.$el.hasClass('external');
    };

    Headline.prototype.onClick = function () {
        if (this.isExternal()) {
            window.open(this.$el.data('href'), '_blank');
        } else {
            window.location.href = this.$el.data('href');
        }
    };

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
