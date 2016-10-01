/*!
 * Custom Headline
 */

(function () {
    'use-strict';

    $('a.btn-open-source[data-github-user][data-github-repo]').each(function () {
        const user = $(this).attr('data-github-user');
        const repo = $(this).attr('data-github-repo');

        $.ajax(`https://api.github.com/repos/${user}/${repo}`)
            .done(data => {
                const span = $('<span/>').css('margin-left', '15px')
                    .append($('<i/>').addClass('fa fa-star'))
                    .append(` ${data.stargazers_count}`);
                $(this).append(span);
            });
    });
})();
