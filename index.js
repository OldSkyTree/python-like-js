'use strict';

const LexicalAnalyzer = require('./lexical-analyzer');
const SyntaxAnalyzer = require('./syntax-analyzer');
const { showError } = require('./utils/out');

const examples = [
`if 10*(2+39)-5 == 100: print(lol + 1)`
// `if 10 == 10:
//     print(1)`,
// `def func (a):
//     a = 10
//     b = a + 15`,
// `for i in (0, 10):
//     print(i)
//     if i == 1:
//         print(j)`
];

examples.forEach((example) => {
    try {
        const lexicalAnalyzer = LexicalAnalyzer.create(example);

        lexicalAnalyzer.analyze();
        lexicalAnalyzer.print();

        const syntaxAnalyzer = SyntaxAnalyzer.create(lexicalAnalyzer);

        syntaxAnalyzer.analyze();

    } catch (err) {
        if (err.type === 'lexical') {
            showError(example, err);
        } else {
            console.error(err);
        }
    }
});
