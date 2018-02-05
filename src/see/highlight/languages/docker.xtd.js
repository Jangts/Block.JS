/*!
 * Block.JS Framework Source Code
 *
 * static see.highlight.language
 *
 * Date: 2017-04-06
 */
;
block('$_/see/highlight/highlight.xtd', function(_, global, undefined) {
    _.see.highlight.languages.docker = {
        'keyword': {
            pattern: /(^\s*)(?:ONBUILD|FROM|MAINTAINER|RUN|EXPOSE|ENV|ADD|COPY|VOLUME|USER|WORKDIR|CMD|LABEL|ENTRYPOINT)(?=\s)/mi,
            lookbehind: true
        },
        'string': /("|')(?:(?!\1)[^\\\r\n]|\\(?:\r\n|[\s\S]))*?\1/,
        'comment': /#.*/,
        'punctuation': /---|\.\.\.|[:[\]{}\-,|>?]/
    };
});