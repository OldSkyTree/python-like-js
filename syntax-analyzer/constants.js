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
        { terminals: ['$id'], rules: ['$id', '$<assign_oper>', '$<exp>'].reverse() }
    ],
    '$<assign_oper>': [
        { terminals: ['='], rules: ['='] },
        { terminals: ['+='], rules: ['+='] },
        { terminals: ['-='], rules: ['-='] },
        { terminals: ['/='], rules: ['/='] },
        { terminals: ['*='], rules: ['*='] }
    ],
    '$<exp>': [
        { terminals: ['$id', '$lit'], rules: ['$<value>', '$<exp_end>'].reverse() },
        { terminals: ['('], rules: ['$<brack_exp>', '$<exp_end>'].reverse() }
    ],
    '$<exp_end>': [
        { terminals: ['$nl', ',', ')', ':', '$'], rules: [] },
        { terminals: ['+', '-', '*', '/', '==', '!=', '>', '>=', '<', '<='], rules: ['$<oper>', '$<exp>'].reverse() }
    ],
    '$<value>': [
        { terminals: ['$id'], rules: ['$id'] },
        { terminals: ['$lit'], rules: ['$lit'] }
    ],
    '$<oper>': [
        { terminals: ['+'], rules: ['+'] },
        { terminals: ['-'], rules: ['-'] },
        { terminals: ['/'], rules: ['/'] },
        { terminals: ['*'], rules: ['*'] },
        { terminals: ['=='], rules: ['=='] },
        { terminals: ['!='], rules: ['!='] },
        { terminals: ['>'], rules: ['>'] },
        { terminals: ['>='], rules: ['>='] },
        { terminals: ['<'], rules: ['<'] },
        { terminals: ['<='], rules: ['<='] }
    ],
    '$<brack_exp>': [
        { terminals: ['$id', '$lit'], rules: ['$<value>', '$<exp_end>'].reverse() },
        { terminals: ['('], rules: ['(', '$<exp>', ')'].reverse() }
    ],
    '$<cond>': [
        { terminals: ['if'], rules: ['if', '$<exp>', ':', '$<code_block>'].reverse() }
    ],
    '$<code_block>': [
        { terminals: ['$id', 'if', 'def', 'for', 'print', '#'], rules: ['$<op>'] },
        { terminals: ['$nl'], rules: ['$nl', '$indent', '$<op_list>', '$dedent'].reverse() }
    ],
    '$<func>': [
        { terminals: ['def'], rules: ['def', '$id', '(', '$<var_list>', ')', ':', '$<code_block>'].reverse() }
    ],
    '$<var_list>': [
        { terminals: ['$id'], rules: ['$id', '$<var_list_end>'].reverse() },
        { terminals: [')'], rules: [] }
    ],
    '$<var_list_end>': [
        { terminals: [','], rules: ['$<var_list*>'] },
        { terminals: [')'], rules: [] }
    ],
    '$<var_list*>': [
        { terminals: ['$id'], rules: [',', '$id', '<var_list_end>'].reverse() }
    ],
    '$<cycle>': [
        { terminals: ['for'], rules: ['for', '$id', 'in', '(', '$<exp>' ,',', '$<exp>', ')', ':', '$<code_block>'].reverse() }
    ],
    '$<comment>': [
        { terminals: ['#'], rules: ['#', '$any'].reverse() }
    ],
    '$<out>': [
        { terminals: ['print'], rules: ['print', '(', '$<exp>', ')'].reverse() }
    ]
});

module.exports = {
    decisionTable
};