'use strict';

const _ = require('lodash');

const { printLexemeTable } = require('../utils/out');

const constants = require('./constants');
const utils = require('./utils');

module.exports = class LexicalAnalyzer {
    static create(...args) {
        return new LexicalAnalyzer(...args);
    }

    constructor(input) {
        this._input = input;
        this._serviceWordTable = constants.serviceWordTable;
        this._operatorTable = constants.operatorTable;
        this._symbolicNameTable = [];
        this._literalTable = [];
        this._standardCharacterTable = [];
    }

    get serviceWordTable() {
        return this._serviceWordTable;
    }

    get operatorTable() {
        return this._operatorTable;
    }

    get symbolicNameTable() {
        return this._symbolicNameTable;
    }

    get literalTable() {
        return this._literalTable;
    }

    get standardCharacterTable() {
        return this._standardCharacterTable;
    }

    analyze() {
        const lines = this._getLines(this._input, constants.lineSeparator);
    
        for (let i = 0; i < lines.length; i++) {
            const line = this._prepareLine(lines[i]);

            let j = 0;
            while (j < line.length) {
                const separator = line.slice(j).match(constants.separator);
                const index = _.isNull(separator)
                    ? line.length - 1
                    : separator.index;
                const lexeme = line.slice(j, j + index);
                
                try {
                    !_.isEmpty(lexeme) && this._standardCharacterTable.push(this._determineLexeme(lexeme));
                    if (separator !== null && constants.operator.test(separator[0])) {
                        this._standardCharacterTable.push(this._determineLexeme(separator[0]));
                    }
                } catch (err) {
                    if (err === 'Lexical error') {
                        throw {
                            type: 'lexical',
                            message: `${err}: in line ${i} at ${j}`,
                            lineIndex: i,
                            symIndex: j
                        };
                    }
                    throw err;
                }
    
                j += _.isNull(separator)
                    ? index + 1
                    : index + separator[0].length;
            }
        }
        this._standardCharacterTable.push({ text: '$', type: '$$', index: 0 });
    }

    _getLines(input, lineSeparator) {
        input = input.replace(lineSeparator, '$nl');
        const lines = [];
        let currIndex = 0;

        while(currIndex <= input.length) {
            let index = input.indexOf('$nl', currIndex);
            
            if (index === -1) index = input.length - 1;
            const line = input.split('').slice(currIndex, index + '$nl'.length).join('');
            console.log(line);

            lines.push(this._prepareLine(line));
            currIndex = index + '$nl'.length;
        }

        return lines;
    }

    _prepareLine(line) {
        line = this._removeComments(line);

        return line.replace(/\s{4}|\\t/g, '$tab').trim();
    }

    _removeComments(line) {
        return line.replace(constants.comment, '');
    }

    _determineLexeme(lexeme) {
        if (utils.isDigit(lexeme[0])) {
            if (constants.literal.test(lexeme)) {
                return {
                    text: lexeme,
                    type: '$lit',
                    index: this._addTo('_literalTable', lexeme)
                };
            }
        } else if (utils.isLetterOr_(lexeme[0])) {
            if (constants.identifier.test(lexeme)) {
                let index = _.indexOf(this._serviceWordTable, lexeme);
                let type = null;

                if (index === -1) {
                    index = this._addTo('_symbolicNameTable', lexeme);
                    type = '$id';
                } else {
                    type = '$ser';
                }

                return {
                    text: lexeme,
                    type,
                    index
                };
            }
        } else {
            if (constants.operator.test(lexeme)) {
                return {
                    text: lexeme,
                    type: '$sep',
                    index: _.indexOf(this._operatorTable, lexeme)
                };
            }
            
            throw 'Lexical error';
        }
    }

    _addTo(tableName, value) {
        if (!this[tableName].includes(value)) {
            this[tableName].push(value);
        }

        return _.indexOf(this[tableName], value);
    }

    print() {
        printLexemeTable(this._standardCharacterTable);
    }
}