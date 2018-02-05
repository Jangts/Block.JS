/*!
 * Block.JS Framework Source Code
 *
 * static math.easing
 *
 * Date: 2017-04-06
 */
;
block(function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document,
        console = global.console;

    _('math.qrcode', {
        glog: function(n) {

            if (n < 1) {
                throw new Error("glog(" + n + ")");
            }

            return _.math.qrcode.LOG_TABLE[n];
        },
        gexp: function(n) {

            while (n < 0) {
                n += 255;
            }

            while (n >= 256) {
                n -= 255;
            }

            return _.math.qrcode.EXP_TABLE[n];
        },
        EXP_TABLE: new Array(256),
        LOG_TABLE: new Array(256)
    });

    for (var i = 0; i < 8; i++) {
        _.math.qrcode.EXP_TABLE[i] = 1 << i;
    }

    for (var i = 8; i < 256; i++) {
        _.math.qrcode.EXP_TABLE[i] = _.math.qrcode.EXP_TABLE[i - 4] ^
            _.math.qrcode.EXP_TABLE[i - 5] ^
            _.math.qrcode.EXP_TABLE[i - 6] ^
            _.math.qrcode.EXP_TABLE[i - 8];
    }

    for (var i = 0; i < 255; i++) {
        _.math.qrcode.LOG_TABLE[_.math.qrcode.EXP_TABLE[i]] = i;
    }
});