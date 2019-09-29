'use strict';

const lexicalAnalyzer = require('./lexical-analyzer');
const { showError } = require('./utils/out');

const examples = [
    `if 10 == 10:
        print('Hey, this looks nice')`,
    `def func ():
        a = 10
        b = a + 15`,
    `for i in (0, 10):
        print('iteration' + i)`
];

examples.forEach((example) => {
    try {
        lexicalAnalyzer(example);
    } catch (err) {
        if (err.type === 'lexical') {
            showError(example, err);
        } else {
            console.error(err);
        }
    }
});
