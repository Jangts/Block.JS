/*!
 * Block.JS Framework Source Code
 * 
 * Date: 2015-09-04
 */
;
block('$_/form/SimpleEditor/commands/insertemoticon.cmd', function(pandora, global, undefined) {
    var _ = pandora,
        cache = pandora.locker,
        regEmoticon = cache.read(new _.Identifier('EDITOR_REG_EMT').toString());

    regEmoticon('default', {
        '微笑': 'wx.gif',
        '晕': 'y.gif',
        '心花怒放': 'xhnf.gif',
        '鼓掌': 'gz.gif',
        '哈欠': 'hax.gif',
        '憨笑': 'sx.gif',
        '汗': 'han.gif',
        '吃惊': 'cj.gif',
        '鄙视': 'bs.gif',
        '闭嘴': 'bz.gif',
        '呲牙': 'cy.gif',
        '害羞': 'hx.gif',
        '衰': 'shuai.gif',
        '偷笑': 'tx.gif',
        '折磨': 'zm.gif',
        '难过': 'ng.gif',
        '示爱': 'sa.gif',
        '可爱': 'ka.gif',
        '泪': 'lei.gif',
        '酷': 'cool.gif'
    });
});