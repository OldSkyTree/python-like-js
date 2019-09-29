'use strict';

const chalk = require('chalk');
const Table = require('cli-table');
const _ = require('lodash');

const utils = require('.');

const pointer = '\u02C5';

exports.printLexemeTable = (lexemeList) => {
    const table = new Table({
        head: ['Лексема', 'Предварительный тип'],
        style: {head: ['yellow']}
    });

    lexemeList.forEach((lexeme) => {
        table.push([
            chalk.blue(lexeme.text),
            chalk.green(lexeme.type)
        ]);
    });

    console.info(table.toString());
};

exports.showError = (input, { message, lineIndex, symIndex }) => {
    console.error(message);

    const highlightedInput = _(input)
        .split('\n')
        .map((line, index) => index === lineIndex 
            ? utils.stringInsert(line, symIndex, chalk.red(pointer))
            : line)
        .join('\n');

    console.error(highlightedInput);
};
