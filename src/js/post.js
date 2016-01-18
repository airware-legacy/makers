/*!
 * Custom Post
 */

(function () {
    'use-strict';

    function Post($el) {
        this.$el = $el;
        this.$imgs = this.$el.find('img');
        this.$links = this.$el.find('a');
        this.$tables = this.$el.find('table');

        this.init();
    }

    Post.prototype.init = function () {
        this.initImages();
        this.initTables();
        this.initLinks();
    };

    Post.prototype.initImages = function () {
        this.$imgs.each(function(index) {
            $(this).attr('data-lightbox-img', index);
        });
    };

    Post.prototype.initTables = function () {
        this.$tables.each(function() {
            $(this)
               .addClass('table')
               .wrap('<div class="table-responsive"></div>');
        });
    };

    Post.prototype.initLinks = function () {
        this.$links.each(function() {
            $(this).attr('target', '_blank');
        });
    };

    $(document).ready(() =>{
        new Post($('.post'));
    });
})();