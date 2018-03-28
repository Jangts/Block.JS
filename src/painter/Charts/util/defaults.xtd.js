/*!
 * tangram.js framework source code
 * Date: 2015-09-04
 */
;
tangram.block(['$_/painter/Charts/Charts.cls'], function(pandora, global, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,
        cache = pandora.locker,
        document = global.document,
        console = global.console;

    _.extend(_.painter.Charts.util.defaults, {
        backgroundColor: 'transparent',
        barColorDefaults: ['#A6CEE3', '#1F78B4', '#B2DF8A', '#33A02C', '#FB9A99', '#E31A1C', '#FDBF6F', '#FF7F00', '#CAB2D6', '#6A3D9A', '#B4B482', '#B15928'],
        barColorDefaultsEmphasis: ['#CEF6FF', '#47A0DC', '#DAFFB2', '#5BC854', '#FFC2C1', '#FF4244', '#FFE797', '#FFA728', '#F2DAFE', '#9265C2', '#DCDCAA', '#D98150'],
        lineColorDefaults: ['#C23531', '#2F4554', '#61A0A8', '#D48265', '#91C7AE', '#749F83', '#CA8622', '#BDA29A', '#6E7074', '#546570', '#C4CCD3'],
        areaColorDefaults: ['rgba(194,53,49,0.3)', 'rgba(47,69,84,0.3)', 'rgba(97,160,168,0.3)', 'rgba(212,130,101,0.3)', 'rgba(145,199,174,0.3)', 'rgba(116,159,131,0.3)', 'rgba(202,134,34,0.3)', 'rgba(189,162,154,0.3)', 'rgba(110,112,116,0.3)', 'rgba(84,101,112,0.3)', 'rgba(196,204,211,0.3)'],
        pointColorDefaults: ['#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360', '#B15928', '#B4B482', '#6A3D9A', '#CAB2D6', '#FF7F00'],
        pointColorDefaultsEmphasis: ['#FF5A5E', '#5AD3D1', '#FFC870', '#A8B3C5', '#616774', '#D98150', '#DCDCAA', '#9265C2', '#F2DAFE', '#FFA728'],

        textStyle: {
            color: '#fff',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontFamily: '\'Microsoft YaHei\', \'Hiragino Sans\', \'Helvetica Neue\', \'Helvetica\', \'Arial\', sans-serif',
            fontSize: 12,
        },
        animation: true,
        animationDuration: 1000,
        animationEasing: 'easeOutQuart',
        responsive: false,
        maintainAspectRatio: true,
        onAnimationProgress: function() {},
        onAnimationComplete: function() {},
        responsive: true
    });
});