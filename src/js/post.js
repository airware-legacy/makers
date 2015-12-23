;(function () { //eslint-disable-line no-extra-semi
    'use-strict';

    function Post($el) {
        this.$el = $el;
        this.$imgs = this.$el.find('img');
        this.$links = this.$el.find('a');

        this.initImages();
        this.initLinks();
    }

    Post.prototype.initImages = function () {
        var self = this;

        this.$imgs.each(function () {
            var $img = $(this);
            var source = $img.attr('src');

            if (source.length) {
                $img
                    .attr('data-modal', 'open')
                    .attr('data-modal-autoclose', true)
                    .attr('data-modal-lightbox', self._getLargeImageURL(source));
            }
        });
    };

    Post.prototype.initLinks = function () {
        this.$links.each(function () {
            $(this).attr('target', '_blank');
        });
    };

    Post.prototype._getLargeImageURL = function (source) {
        var sourceParts = source.split('.');
        var ext = sourceParts.pop();
        var filename = sourceParts.join('');

        return filename + '_large.' + ext;
    };

    $(document).ready(function () {
        new Post($('.post'));
    });
})();