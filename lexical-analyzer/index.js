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

    analyze() {
        const lines = _.split(this._input, constants.lineSeparator);
    
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
    }

    _prepareLine(line) {
        line = this._removeComments(line);

        return line.replace(/\s{4}/g, '\t').trim();
    }

    _removeComments(line) {
        return line.replace(constants.comment, '');
    }

    _determineLexeme(lexeme) {
        if (utils.isDigit(lexeme[0])) {
            if (constants.literal.test(lexeme)) {
                return {
                    text: lexeme,
                    type: 'литерал',
                    index: this._addTo('_literalTable', lexeme)
                };
            }
        } else if (utils.isLetterOr_(lexeme[0])) {
            if (constants.identifier.test(lexeme)) {
                let index = _.indexOf(this._serviceWordTable, lexeme);
                let type = null;

                if (index === -1) {
                    index = this._addTo('_symbolicNameTable', lexeme);
                    type = 'идентефикатор';
                } else {
                    type = 'служебное слово';
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
                    type: 'разделитель',
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