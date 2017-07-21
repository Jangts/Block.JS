/*!
 * Block.JS Framework Source Code
 *
 * static see.highlight.language
 *
 * Date: 2017-04-06
 */
;
block('$_/see/highlight/highlight.xtd', function(_, global, undefined) {
    _.see.highlight.languages.apl = {
        'comment': /(?:⍝|#[! ]).*$/m,
        'string': /'(?:[^'\r\n]|'')*'/,
        'number': /¯?(?:\d*\.?\d+(?:e[+¯]?\d+)?|¯|∞)(?:j¯?(?:\d*\.?\d+(?:e[\+¯]?\d+)?|¯|∞))?/i,
        'statement': /:[A-Z][a-z][A-Za-z]*\b/,
        'system-function': {
            pattern: /⎕[A-Z]+/i,
            alias: 'function'
        },
        'constant': /[⍬⌾#⎕⍞]/,
        'function': /[-+×÷⌈⌊∣|⍳?*⍟○!⌹<≤=>≥≠≡≢∊⍷∪∩~∨∧⍱⍲⍴,⍪⌽⊖⍉↑↓⊂⊃⌷⍋⍒⊤⊥⍕⍎⊣⊢⍁⍂≈⍯↗¤→]/,
        'monadic-operator': {
            pattern: /[\\\/⌿⍀¨⍨⌶&∥]/,
            alias: 'operator'
        },
        'dyadic-operator': {
            pattern: /[.⍣⍠⍤∘⌸]/,
            alias: 'operator'
        },
        'assignment': {
            pattern: /←/,
            alias: 'keyword'
        },
        'punctuation': /[\[;\]()◇⋄]/,
        'dfn': {
            pattern: /[{}⍺⍵⍶⍹∇⍫:]/,
            alias: 'builtin'
        }
    };
});