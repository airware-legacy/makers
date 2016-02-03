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
    }

    $(document).ready(() => {
        let layout = new Layout();
        layout.setGlobalLinkClickListener();
    });
})();
