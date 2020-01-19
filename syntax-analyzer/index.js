'use strict';

const _ = require('lodash');

const constants = require('./constants');

module.exports = class SyntaxAnalyzer {
    static create(...args) {
        return new SyntaxAnalyzer(...args);
    }

    constructor(lexicalAnalyzer) {
        this._input = lexicalAnalyzer.standardCharacterTable;

        this._serviceWordTable = lexicalAnalyzer.serviceWordTable;
        this._operatorTable = lexicalAnalyzer.operatorTable;
        this._symbolicNameTable = lexicalAnalyzer.symbolicNameTable;
        this._literalTable = lexicalAnalyzer.literalTable;

        this._analyzerStack = ['$', '$<prog>'];

        this._indentCount = 0;
    }

    get decisionTable() {
        return constants.decisionTable(this._indentCount);
    }

    analyze() {
        const input = _.concat([], this._input).reverse();

        while(_.last(this._analyzerStack) != '$') {
            const lastStack = _.last(this._analyzerStack);
            const lastInput = _.last(input);

            console.log('------------Values------------');
            console.log('_analyzerStack:');
            console.log(this._analyzerStack);
            console.log('input:');
            console.log(_.map(input, 'text'));
            console.log('lastInput:');
            console.log(lastInput);
            console.log('lastStack:');
            console.log(lastStack);

            if (this._isTerminal(lastStack)) {
                if (_.eq(lastStack, lastInput.text)) {
                    this._analyzerStack.pop();
                    input.pop();
                    continue;
                } else {
                    throw new Error('lol');
                }
            } else {
                if (!this._prepareIndent(input)) continue;

                if (this._isComplexNonTerminal(lastStack)) {
                    const rule = _.find(this.decisionTable[lastStack], (rule) => {
                        return rule.terminals.some((terminal) => this._compareTerminals(terminal, lastInput));
                    });

                    this._analyzerStack.pop();
                    this._analyzerStack = this._analyzerStack.concat(rule.rules);
                } else {
                    if (lastStack === lastInput.type) {
                        this._analyzerStack.pop();
                        this._analyzerStack.push(lastInput.text);
                    } else if (lastStack === lastInput.text) {
                        this._analyzerStack.pop();
                        input.pop();
                    } else {
                        throw new Error('lol');
                    }
                }
            }
        }
        console.log('here we go');
    }

    _isTerminal(word) {
        return !_.startsWith(word, '$');
    }

    _isComplexNonTerminal(word) {
        return /\$\<\w+\*?>/.test(word);
    }

    _compareTerminals(simpleTerminal, inputTerminal) {
        if (simpleTerminal.startsWith('$')) {
            return _.eq(simpleTerminal, inputTerminal.text)
                || _.eq(simpleTerminal, inputTerminal.type);
        } else {
            return _.eq(simpleTerminal, inputTerminal.text);
        }
    }

    _prepareIndent(input) {
        if (_.last(this._analyzerStack) === '$indent') {
            this._indentCount++;
            this._analyzerStack.pop();

            return false;
        }

        if (_.last(this._analyzerStack) === '$tab' && _.last(input).text !== '$tab') {
            console.log('I AM HERE');
            const nextDedentIndex = this._findNextDedent();

            if (nextDedentIndex === -1) throw new Error('Wrong code block');

            this._indentCount--;
            this._analyzerStack.splice(nextDedentIndex, 1);
            this._analyzerStack.pop();

            return false;
        }

        if (_.last(this._analyzerStack) === '$dedent') {
            this._indentCount--;
            this._analyzerStack.pop();

            return false;
        }

        return true;
    }

    _findNextDedent() {
        return _.findLastIndex(this._analyzerStack, (element) => element === '$dedent');
    }
};