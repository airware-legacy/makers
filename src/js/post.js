/*!
 * Custom Post
 */

(function () {
    'use-strict';

    const FULL_WIDTH = 'full-width';
    const POST_CONTENT = '.post-content';

    class Post {
        constructor ($el) {
            this.$el = $el;
            this.$imgs = this.$el.find('img');
            this.$links = this.$el.find('a');
            this.$tables = this.$el.find('table');
            this.init();
        }

        init () {
            this.initImages();
            this.initTables();
            this.initTables();
            this.initLinks();
        }

        initImages () {
            this.$imgs.each(function (index) {
                let $img = $(this);
                $img.attr('data-lightbox-img', index);

                let color = $img.data(FULL_WIDTH);
                if (color) {
                    $img.parent().addClass(FULL_WIDTH).css({ 'background-color': color });
                }
            });
        }

        initTables () {
            this.$tables.each(function () {
                $(this)
                    .addClass('table')
                    .wrap('<div class="table-responsive"></div>');
            });
        }

        initLinks () {
            this.$links.each(function () {
                $(this).attr('target', '_blank');
            });
        }
    }

    $(document).ready(() => {
        new Post($(POST_CONTENT));
    });
})();
