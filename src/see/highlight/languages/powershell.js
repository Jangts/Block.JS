/*!
 * tangram.js framework source code
 *
 * static see.highlight.language
 *
 * Date: 2017-04-06
 */
;
tangram.block('$_/see/highlight/languages/clike', function(_, global, undefined) {
    var doc = global.document,
        location = global.location,
        highlight = _.see.highlight;
    highlight.languages.powershell = {
        'comment': [{
                pattern: /(^|[^`])<#[\w\W]*?#>/,
                lookbehind: true
            },
            {
                pattern: /(^|[^`])#.+/,
                lookbehind: true
            }
        ],
        'string': [{
                pattern: /"(`?[\w\W])*?"/,
                inside: {
                    'function': {
                        pattern: /[^`]\$\(.*?\)/,
                        // Populated at end of file
                        inside: {}
                    }
                }
            },
            /'([^']|'')*'/
        ],
        // Matches name spaces as well as casts, attribute decorators. Force starting with letter to avoid matching array indices
        'namespace': /\[[a-z][\w\W]*?\]/i,
        'boolean': /\$(true|false)\b/i,
        'variable': /\$\w+\b/i,
        // Cmdlets and aliases. Aliases should come last, otherwise "write" gets preferred over "write-host" for example
        // Get-Command | ?{ $_.ModuleName -match "Microsoft.PowerShell.(Util|Core|Management)" }
        // Get-Alias | ?{ $_.ReferencedCommand.Module.Name -match "Microsoft.PowerShell.(Util|Core|Management)" }
        'function': [/\b(Add-(Computer|Content|History|Member|PSSnapin|Type)|Checkpoint-Computer|Clear-(Content|EventLog|History|Item|ItemProperty|Variable)|Compare-Object|Complete-Transaction|Connect-PSSession|ConvertFrom-(Csv|Json|StringData)|Convert-Path|ConvertTo-(Csv|Html|Json|Xml)|Copy-(Item|ItemProperty)|Debug-Process|Disable-(ComputerRestore|PSBreakpoint|PSRemoting|PSSessionConfiguration)|Disconnect-PSSession|Enable-(ComputerRestore|PSBreakpoint|PSRemoting|PSSessionConfiguration)|Enter-PSSession|Exit-PSSession|Export-(Alias|Clixml|Console|Csv|FormatData|ModuleMember|PSSession)|ForEach-Object|Format-(Custom|List|Table|Wide)|Get-(Alias|ChildItem|Command|ComputerRestorePoint|Content|ControlPanelItem|Culture|Date|Event|EventLog|EventSubscriber|FormatData|Help|History|Host|HotFix|Item|ItemProperty|Job|Location|Member|Module|Process|PSBreakpoint|PSCallStack|PSDrive|PSProvider|PSSession|PSSessionConfiguration|PSSnapin|Random|Service|TraceSource|Transaction|TypeData|UICulture|Unique|Variable|WmiObject)|Group-Object|Import-(Alias|Clixml|Csv|LocalizedData|Module|PSSession)|Invoke-(Command|Expression|History|Item|RestMethod|WebRequest|WmiMethod)|Join-Path|Limit-EventLog|Measure-(Command|Object)|Move-(Item|ItemProperty)|New-(Alias|Event|EventLog|Item|ItemProperty|Module|ModuleManifest|Object|PSDrive|PSSession|PSSessionConfigurationFile|PSSessionOption|PSTransportOption|Service|TimeSpan|Variable|WebServiceProxy)|Out-(Default|File|GridView|Host|Null|Printer|String)|Pop-Location|Push-Location|Read-Host|Receive-(Job|PSSession)|Register-(EngineEvent|ObjectEvent|PSSessionConfiguration|WmiEvent)|Remove-(Computer|Event|EventLog|Item|ItemProperty|Job|Module|PSBreakpoint|PSDrive|PSSession|PSSnapin|TypeData|Variable|WmiObject)|Rename-(Computer|Item|ItemProperty)|Reset-ComputerMachinePassword|Resolve-Path|Restart-(Computer|Service)|Restore-Computer|Resume-(Job|Service)|Save-Help|Select-(Object|String|Xml)|Send-MailMessage|Set-(Alias|Content|Date|Item|ItemProperty|Location|PSBreakpoint|PSDebug|PSSessionConfiguration|Service|StrictMode|TraceSource|Variable|WmiInstance)|Show-(Command|ControlPanelItem|EventLog)|Sort-Object|Split-Path|Start-(Job|Process|Service|Sleep|Transaction)|Stop-(Computer|Job|Process|Service)|Suspend-(Job|Service)|Tee-Object|Test-(ComputerSecureChannel|Connection|ModuleManifest|Path|PSSessionConfigurationFile)|Trace-Command|Unblock-File|Undo-Transaction|Unregister-(Event|PSSessionConfiguration)|Update-(FormatData|Help|List|TypeData)|Use-Transaction|Wait-(Event|Job|Process)|Where-Object|Write-(Debug|Error|EventLog|Host|Output|Progress|Verbose|Warning))\b/i, /\b(ac|cat|chdir|clc|cli|clp|clv|compare|copy|cp|cpi|cpp|cvpa|dbp|del|diff|dir|ebp|echo|epal|epcsv|epsn|erase|fc|fl|ft|fw|gal|gbp|gc|gci|gcs|gdr|gi|gl|gm|gp|gps|group|gsv|gu|gv|gwmi|iex|ii|ipal|ipcsv|ipsn|irm|iwmi|iwr|kill|lp|ls|measure|mi|mount|move|mp|mv|nal|ndr|ni|nv|ogv|popd|ps|pushd|pwd|rbp|rd|rdr|ren|ri|rm|rmdir|rni|rnp|rp|rv|rvpa|rwmi|sal|saps|sasv|sbp|sc|select|set|shcm|si|sl|sleep|sls|sort|sp|spps|spsv|start|sv|swmi|tee|trcm|type|write)\b/i],
        // per http://technet.microsoft.com/en-US/library/hh847744.aspx
        'keyword': /\b(Begin|Break|Catch|Class|Continue|Data|Define|Do|DynamicParam|Else|ElseIf|End|Exit|Filter|Finally|For|ForEach|From|Function|If|InlineScript|Parallel|Param|Process|Return|Sequence|Switch|Throw|Trap|Try|Until|Using|Var|While|Workflow)\b/i,
        'operator': {
            pattern: /(\W?)(!|-(eq|ne|gt|ge|lt|le|sh[lr]|not|b?(and|x?or)|(Not)?(Like|Match|Contains|In)|Replace|Join|is(Not)?|as)\b|-[-=]?|\+[+=]?|[*\/%]=?)/i,
            lookbehind: true
        },
        'punctuation': /[|{}[\];(),.]/
    };

    // Variable interpolation inside strings, and nested expressions
    highlight.languages.powershell.string[0].inside.boolean = highlight.languages.powershell.boolean;
    highlight.languages.powershell.string[0].inside.variable = highlight.languages.powershell.variable;
    highlight.languages.powershell.string[0].inside.
    function.inside = _.copy(highlight.languages.powershell);
    highlight.languages.processing = highlight.languages.extend('clike', {
        'keyword': /\b(?:break|catch|case|class|continue|default|else|extends|final|for|if|implements|import|new|null|private|public|return|static|super|switch|this|try|void|while)\b/,
        'operator': /<[<=]?|>[>=]?|&&?|\|\|?|[%?]|[!=+\-*\/]=?/
    });
    highlight.languages.insertBefore('processing', 'number', {
        // Special case: XML is a type
        'constant': /\b(?!XML\b)[A-Z][A-Z\d_]+\b/,
        'type': {
            pattern: /\b(?:boolean|byte|char|color|double|float|int|XML|[A-Z][A-Za-z\d_]*)\b/,
            alias: 'variable'
        }
    });

    // Spaces are allowed between function name and parenthesis
    highlight.languages.processing['function'].pattern = /[a-z0-9_]+(?=\s*\()/i;

    // Class-names is not styled by default
    highlight.languages.processing['class-name'].alias = 'variable';
    highlight.languages.prolog = {
        // Syntax depends on the implementation
        'comment': [/%.+/, /\/\*[\s\S]*?\*\//],
        // Depending on the implementation, strings may allow escaped newlines and quote-escape
        'string': /(["'])(?:\1\1|\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
        'builtin': /\b(?:fx|fy|xf[xy]?|yfx?)\b/,
        'variable': /\b[A-Z_]\w*/,
        // FIXME: Should we list all null-ary predicates (not followed by a parenthesis) like halt, trace, etc.?
        'function': /\b[a-z]\w*(?:(?=\()|\/\d+)/,
        'number': /\b\d+\.?\d*/,
        // Custom operators are allowed
        'operator': /[:\\=><\-?*@\/;+^|!$.]+|\b(?:is|mod|not|xor)\b/,
        'punctuation': /[(){}\[\],]/
    };
});