/*!
 * Custom Animations
 */

(function () {
    const defaultDuration = 200;
    const maxWidth = 1350;

    $.Velocity.RegisterEffect('airware.lightbox.slideLeftOut', {
        defaultDuration,
        calls : [
            [
                { opacity : [ 0, 1 ], translateX : -maxWidth, translateZ : 0 }
            ]
        ]
    });

    $.Velocity.RegisterEffect('airware.lightbox.slideRightIn', {
        defaultDuration,
        calls : [
            [
                { opacity : [ 1, 0 ], translateX : [ 0, maxWidth ], translateZ : 0 }
            ]
        ]
    });

    $.Velocity.RegisterEffect('airware.lightbox.slideRightOut', {
        defaultDuration,
        calls : [
            [
                { opacity : [ 0, 1 ], translateX : maxWidth, translateZ : 0 }
            ]
        ]
    });

    $.Velocity.RegisterEffect('airware.lightbox.slideLeftIn', {
        defaultDuration,
        calls : [
            [
                { opacity : [ 1, 0 ], translateX : [ 0, -maxWidth ], translateZ : 0 }
            ]
        ]
    });

    $.Velocity.RegisterEffect('airware.expandIn', {
        defaultDuration,
        calls : [
            [
                { opacity : [ 1, 0 ], transformOriginX : [ '50%', '50%' ], transformOriginY : [ '50%', '50%' ], scaleX : [ 1, 0.625 ], scaleY : [ 1, 0.625 ], translateZ : 1 }
            ]
        ]
    });

    $.Velocity.RegisterEffect('airware.expandOut', {
        defaultDuration,
        calls : [
            [
                { opacity : [ 0, 1 ], transformOriginX : [ '50%', '50%' ], transformOriginY : [ '50%', '50%' ], scaleX : 0.5, scaleY : 0.5, translateZ : 1 }
            ]
        ],
        reset : { scaleX : 1, scaleY : 1, translateZ : 1 }
    });
})();
