'use strict';

const LexicalAnalyzer = require('./lexical-analyzer');
const { showError } = require('./utils/out');

const examples = [
    `if 10 == 10:
        print(True)`,
    `def func ():
        a = 10
        b = a + 15`,
    `for i in (0, 10):
        print(i + i)`
];

examples.forEach((example) => {
    const lexicalAnalyzer = LexicalAnalyzer.create(example);

    try {
        lexicalAnalyzer.analyze();
        lexicalAnalyzer.print();
    } catch (err) {
        if (err.type === 'lexical') {
            showError(example, err);
        } else {
            console.error(err);
        }
    }
});
