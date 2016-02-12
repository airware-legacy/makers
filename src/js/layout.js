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
        layout.setViliHeader();
    });
})();
