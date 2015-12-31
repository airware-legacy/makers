/*!
 * Custom Post
 */

(function () { //eslint-disable-line no-extra-semi
    'use-strict';

    function Post($el) {
        this.$el = $el;
        this.$imgs = this.$el.find('img');
        this.$links = this.$el.find('a');
        this.$tables = this.$el.find('table');

        this.initTables();
        this.initLinks();
    }

    Post.prototype.initTables = function () {
        this.$tables.each(function () {
            $(this)
               .addClass('table')
               .wrap('<div class="table-responsive"></div>');
        });
    };

    Post.prototype.initLinks = function () {
        this.$links.each(function () {
            $(this).attr('target', '_blank');
        });
    };

    $(document).ready(function () {
        new Post($('.post'));
    });
})();