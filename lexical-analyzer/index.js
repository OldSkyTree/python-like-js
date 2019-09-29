'use strict';

const _ = require('lodash');

const { printLexemeTable } = require('../utils/out');

const literalReg = /[a-zA-Z]\w*/g;
const stringReg = /['"].*['"]/g;
const numberReg = /\b\d+\b/g;
const operatorReg = /\+|-|%|==|=|\*|\/|\(|\)|\,|\.|\{|\}/g;
const blockStartReg = /:\n/g;
const blockSpaceReg = /\t+/g;

const splitIntoLexemes = (code) => {
    const strings = _(code)
        .words(stringReg)
        .map((string) => {
            code = _.replace(code, string, '');
            return {
                text: string,
                type: 'string'
            };
        })
        .value();

    const literals = _(code)
        .words(literalReg)
        .map((literal) => {
            code = _.replace(code, literal, '');
            return {
                text: literal,
                type: 'literal'
            };
        })
        .value();
    
    const numbers = _(code)
        .words(numberReg)
        .map((number) => {
            code = _.replace(code, number, '');
            return {
                text: number,
                type: 'number'
            };
        })
        .value();

    const operators = _(code)
        .words(operatorReg)
        .map((operator) => {
            code = _.replace(code, operator, '');
            return {
                text: operator,
                type: 'operator'
            };
        })
        .value();

    const blockStarts = _(code)
        .words(blockStartReg)
        .map((blockStart) => {
            code = _.replace(code, blockStart, '');
            return {
                text: ':',
                type: 'blockStart'
            };
        })
        .value();

    const blockSpaces = _(code)
        .words(blockSpaceReg)
        .map((blockSpace) => {
            code = _.replace(code, blockSpace, '');
            return {
                text: `x${blockSpace.length} blockSpace`,
                type: 'blockSpace'
            };
        })
        .value();

    if (_.trim(code)) {
        throw 'Lexical error';
    }

    return _.concat(
        [],
        strings,
        literals,
        numbers,
        operators,
        blockStarts,
        blockSpaces
    );
};

module.exports = (code) => {
    printLexemeTable(splitIntoLexemes(code));
};
