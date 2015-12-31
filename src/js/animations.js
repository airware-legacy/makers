/*!
 * Custom Animations
 */

(function () {
    var maxWidth = 1350;

    $.Velocity.RegisterEffect('airware.lightbox.slideLeftOut', {
        defaultDuration: 200,
        calls: [
            [ { opacity: [0, 1], translateX: -maxWidth, translateZ: 0 } ]
        ]
    });

    $.Velocity.RegisterEffect('airware.lightbox.slideRightIn', {
        defaultDuration: 200,
        calls: [
            [ { opacity: [1, 0], translateX: [0, maxWidth], translateZ: 0 } ]
        ]
    });

    $.Velocity.RegisterEffect('airware.lightbox.slideRightOut', {
        defaultDuration: 200,
        calls: [
            [ { opacity: [0, 1], translateX: maxWidth, translateZ: 0 } ]
        ]
    });

    $.Velocity.RegisterEffect('airware.lightbox.slideLeftIn', {
        defaultDuration: 200,
        calls: [
            [ { opacity: [1, 0], translateX: [0, -maxWidth], translateZ: 0 } ]
        ]
    });
})();