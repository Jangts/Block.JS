/*!
 * tangram.js framework source code
 *
 * class forms/SimpleEditor
 * 
 * Date: 2015-09-04
 */
;
tangram.block([
    '$_/util/bool.xtd',
    '$_/dom/',
    '$_/dom/Events.cls',
    '$_/data/',
    '$_/data/Uploader.cls'
], function(pandora, global, undefined) {
    var _ = pandora,
        cache = pandora.locker,
        basePath = _.core.dir() + 'form/SimpleEditor/';

    var parameters = {
        basePath: basePath,
        langPath: basePath + 'Lang/',
        langType: 'zh_CN',
        minWidth: 650,
        minHeight: 100,
        emoticonsTable: 'default',
        emoticonsCodeFormat: '[CODE]'
    };
    cache.save(parameters, 'EDITOR_PARAMS');
});