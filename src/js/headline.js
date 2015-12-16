;(function () { //eslint-disable-line no-extra-semi
    $(document).ready(function () {
        $(document).on('click', '.card', onHeadlineClick);
    });

    function onHeadlineClick(e) {
        var $headline = $(e.currentTarget).find('.headline-cnt');

        if ($headline.length) {
            window.location.href = $headline.data('href');
        }
    }
})();