'use-strict';

/*!
 * Custom Layout
 */

(function () {
    class Layout {
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
    }

    $(document).ready(() => {
        const layout = new Layout();
        layout.setGlobalLinkClickListener();
        layout.fadeInCards();
    });
})();
