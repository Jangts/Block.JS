/*!
 * Block.JS Framework Source Code
 *
 * class forms/Editor
 * 
 * Date: 2015-09-04
 */
;
block([
    '$_/util/bool.xtd',
    '$_/dom/',
    '$_/dom/Events.cls',
    '$_/data/',
    '$_/data/Uploader.cls'
], function(pandora, global, undefined) {
    var _ = pandora,
        cache = pandora.locker;

    var parameters = {
        fullscreenMode: false,
        filterMode: true,
        wellFormatMode: true,
        basePath: _.core.dir() + 'form/Editor/',
        styleSheet: undefined,
        themeType: 'default',
        langType: 'zh_CN',
        toolbarItems: undefined,
        toolbarType: 'default',
        newlineTag: 'p',
        pasteType: 2,
        dialogAlignType: 'page',
        useContextmenu: true,
        fullscreenShortcut: false,
        indentChar: '\t',
        cssPath: '',
        minWidth: 650,
        minHeight: 100,
        emoticonsTable: 'default',
        emoticonsCodeFormat: '[CODE]'
    };

    parameters.langPath = parameters.basePath + 'Lang/';
    parameters.pluginsPath = parameters.basePath + 'Plugins/';

    cache.save(parameters, 'EDITOR_PARAMS');

});