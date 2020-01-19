'use strict';

const decisionTable = (indentCount) => ({
    '$<prog>': [
        { terminals: ['$id', 'if', 'def', 'for', 'print', '#'], rules: ['$<op_list>'] }
    ],
    '$<op_list>': [
        {
            terminals: ['$id', 'if', 'def', 'for', 'print', '#'].concat(indentCount ? '$tab' : []),
            rules: Array(indentCount).fill('$tab').concat(['$<op>', '$<op_list_end>']).reverse()
        }
    ],
    '$<op_list_end>': [
        { terminals: ['$nl'].concat(indentCount ? '$tab' : []), rules: ['$<op_list*>'] },
        { terminals: ['$'], rules: [] }
    ],
    '$<op_list*>': [
        {
            terminals: ['$nl'].concat(indentCount ? '$tab' : []),
            rules: ['$nl'].concat(Array(indentCount).fill('$tab'), ['$<op>', '$<op_list_end>']).reverse()
        }
    ],
    '$<op>': [
        { terminals: ['$id'], rules: ['$<assign>'] },
        { terminals: ['if'], rules: ['$<cond>'] },
        { terminals: ['def'], rules: ['$<func>'] },
        { terminals: ['for'], rules: ['$<cycle>'] },
        { terminals: ['print'], rules: ['$<out>'] },
        { terminals: ['#'], rules: ['$<comment>'] }
    ],
    '$<assign>': [
        { terminals: ['$id'], rules: ['$id', '=', '$<exp>'].reverse() }
    ],
    '$<cond>': [
        { terminals: ['if'], rules: ['if', '$<cond_exp>', ':', '$<code_block>'].reverse() }
    ],
    '$<cond_exp>': [
        { terminals: ['$id', '$lit'], rules: ['$<value>', '$<cond_op>', '$<value>'].reverse() }
    ],
    '$<value>': [
        { terminals: ['$id'], rules: ['$id'] },
        { terminals: ['$lit'], rules: ['$lit'] }
    ],
    '$<cond_op>': [
        { terminals: ['=='], rules: ['=='] },
        { terminals: ['!='], rules: ['!='] },
        { terminals: ['>='], rules: ['>='] },
        { terminals: ['<='], rules: ['<='] },
        { terminals: ['>'], rules: ['>'] },
        { terminals: ['<'], rules: ['<'] }
    ],
    '$<code_block>': [
        { terminals: ['$id', 'if', 'def', 'for', 'print', '#'], rules: ['$<op>'] },
        { terminals: ['$nl'], rules: ['$nl', '$indent', '$<op_list>', '$dedent'].reverse() }
    ],
    '$<func>': [
        { terminals: ['def'], rules: ['def', '$id', '(', '$<var_list>', ')', ':', '$<code_block>'].reverse() }
    ],
    '$<var_list>': [
        { terminals: ['$id'], rules: ['$id', '$<var_list_end>'].reverse() }
    ],
    '$<var_list_end>': [
        { terminals: [','], rules: ['$<var_list*>'] },
        { terminals: [')'], rules: [] }
    ],
    '$<var_list*>': [
        { terminals: ['$id'], rules: [',', '$id', '<var_list_end>'].reverse() }
    ],
    '$<cycle>': [
        { terminals: ['for'], rules: ['for', '$id', 'in', '(', '$<value>' ,',', '$<value>', ')', ':', '$<code_block>'].reverse() }
    ],
    '$<comment>': [
        { terminals: ['#'], rules: ['#', '$any'].reverse() }
    ],
    '$<out>': [
        { terminals: ['print'], rules: ['print', '(', '$<value>', ')'].reverse() }
    ]
});

module.exports = {
    decisionTable
};