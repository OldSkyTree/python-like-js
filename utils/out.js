'use strict';

const chalk = require('chalk');
const Table = require('cli-table');

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
