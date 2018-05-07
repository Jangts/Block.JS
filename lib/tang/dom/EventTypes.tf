$..Events.setType({
    'DOMMouseScroll': {
        type: 'mousewheel'
    },
    'mousewheel': {
        type: 'DOMMouseScroll'
    },
    'rclick': {
        type: 'mousedown',
        which: 3
    },
    'back': {
        type: 'keypress',
        which: 8
    },
    'enter': {
        type: 'keypress',
        which: 13
    }
});