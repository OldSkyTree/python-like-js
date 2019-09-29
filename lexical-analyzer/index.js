'use strict';

const _ = require('lodash');

const { printLexemeTable } = require('../utils/out');

const constants = require('./constants');
const utils = require('./utils');

const removeComments = (lines) => lines.trim().replace(constants.comment, '');

const determineLexeme = (lexeme) => {
    if (utils.isDigit(lexeme[0])) {
        if (constants.literal.test(lexeme)) {
            return {
                text: lexeme,
                type: 'литерал'
            };
        } else {
            throw 'Lexical error';
        }
    } else if (utils.isLetterOr_(lexeme[0])) {
        if (constants.identifier.test(lexeme)) {
            return {
                text: lexeme,
                type: 'идентефикатор'
            };
        } else {
            throw 'Lexical error';
        }
    } else {
        if (constants.operator.test(lexeme)) {
            return {
                text: lexeme,
                type: 'разделитель'
            };
        } else {
            throw 'Lexical error';
        }
    }
};

module.exports = (code) => {
    const lexemes = [];
    const lines = _.split(code, constants.lineSeparator);

    for (let i = 0; i < lines.length; i++) {
        const line = removeComments(lines[i]);

        let j = 0;
        while (j < line.length) {
            const separator = line.slice(j).match(constants.separator);
            const index = _.isNull(separator)
                ? line.length - 1
                : separator.index;
            const lexeme = line.slice(j, j + index);
            
            try {
                !_.isEmpty(lexeme) && lexemes.push(determineLexeme(lexeme));
                if (separator !== null && constants.operator.test(separator[0])) {
                    lexemes.push(determineLexeme(separator[0]));
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
    printLexemeTable(lexemes);
};
