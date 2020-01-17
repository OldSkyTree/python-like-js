'use strict';

const simpleSeparator = /\s/;
const lineSeparator = /\n/;
const operator = /==|=|\+=|\+|-=|-|\*\*=|\*\*|\*=|\*|\/\/=|\/\/|\/=|\/|%=|%|:|\.|,|'|"|\(|\)/;
const string = /^['"].*['"]$/;
const comment = /#.*$/;
const separator = new RegExp(`${simpleSeparator.source}|${lineSeparator.source}|${operator.source}`);
const identifier = /^[a-z_]\w*$/i;
const literal = /^\d+$/;

const serviceWordTable = [
    'and',
    'break',
    'continue',
    'def',
    'else',
    'False',
    'for',
    'if',
    'in',
    'is',
    'None',
    'not',
    'or',
    'return',
    'True',
    'while',
];

const operatorTable = [
    '==', '=', '+=', '+',
    '-=', '-', '**=', '**',
    '*=', '*', '//=', '//',
    '/=', '/', '%=', '%',
    ':', '.', ',', "'",
    '"', '(', ')'
];

module.exports = {
    simpleSeparator,
    lineSeparator,
    operator,
    comment,
    separator,
    identifier,
    literal,
    serviceWordTable,
    operatorTable
};
