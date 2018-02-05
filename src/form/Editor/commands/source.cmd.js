/*!
 * Block.JS Framework Source Code
 *
 * class forms/Editor
 * 
 * Date: 2015-09-04
 */
;
block([
    '$_/dom/',
    '$_/form/Editor/'
], function(pandora, global, undefined) {
    var _ = pandora,
        console = global.console;

    _.form.Editor.regCommand('source', function() {
        this.getValue();
        if (this.isRich) {
            this.range = null;
            _.dom.setStyle(this.richarea, {
                display: 'none'
            });
            _.dom.setStyle(this.codearea, {
                display: 'block'
            });
        } else {
            _.dom.setStyle(this.codearea, {
                display: 'none'
            });
            _.dom.setStyle(this.richarea, {
                display: 'block'
            });
            this.selection.getRange();
            this.onchange();

        }
        this.isRich = Math.abs(this.isRich - 1);
        _.each(_.query('.bc.editor-tool', this.toolarea), function(i, el) {
            _.dom.toggleClass(this, 'invalid');
        });
        var elem = _.query('.bc.editor-tool.source', this.toolarea)[0];
        _.dom.toggleClass(elem, 'invalid');
        _.dom.toggleClass(elem, 'active');
        typeof this.options.onSwitch == 'function' && this.options.onSwitch();
        return this;
    });



    _.form.Editor.extends({
        swtichView: function() {
            this.execCommand('source');
            return this;
        }
    });
});