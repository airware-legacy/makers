'use-strict';

/*!
 * Custom Layout
 */

(function () {
    const parser = new UAParser();
    const device = parser.getDevice();

    class Layout {
        constructor () {
            this.$body = $('body');
            this.$header = $('.airware-header-bg');
        }

        setGlobalLinkClickListener () {
            $(document).on('click', '.external', e => {
                e.stopPropagation();
                e.preventDefault();
                window.open($(e.currentTarget).attr('href'), '_blank');
            });
        }

        fadeInCards () {
            $('.card').each(function () {
                $(this).velocity('transition.fadeIn', { duration : 300, easing : 'ease-in-out' });
            });
        }

        setAuthorBackground () {
            const $authorHeroName = $('.author-hero-cnt .author-name');

            if ($authorHeroName.length) {
                /* eslint camelcase: ["error", {properties: "never"}] */ // eslint-disable-line
                window.rand = 2; // hack to make this work with babel
                window.ctx = document.createElement('canvas'); // hack to make this work with babel
                const pattern = window.Trianglify({
                    cell_size : 15,
                    variance  : 60,
                    x_colors  : 'random',
                    width     : 1800,
                    height    : 500,
                    seed      : $authorHeroName.text().toUpperCase()
                });

                $('.airware-header-bg').css({ backgroundImage : `url('${pattern.png()}')` });
            }
        }

        setViliHeader () {
            if (!this.$body.hasClass('vili')) {
                return;
            }

            if (device.type !== 'mobile' && device.type !== 'tablet') {
                const $video = $($('#vili-header').html());
                $video.css({ opacity : 0 });

                this.$header.append($video);

                $video.on('play', () => {
                    $video.css({ opacity : 1 });
                });

                $video.find('source').last().on('error', () => {
                    $video.css({ opacity : 1 });
                });
            } else {
                this.$header.css({ backgroundImage : 'url(/img/vili/poster.png)', backgroundPosition : '32%' });
            }
        }
    }

    $(document).ready(() => {
        const layout = new Layout();
        layout.setGlobalLinkClickListener();
        layout.fadeInCards();
        layout.setAuthorBackground();
        layout.setViliHeader();
    });
})();
