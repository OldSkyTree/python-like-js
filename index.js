'use strict';

const lexicalAnalyzer = require('./lexical-analyzer');

const examples = [
    `if 10 === 10:\n\tprint('Hey, this looks nice');`,
    `def func ():\n\ta = 10\n\tb = a + 15`,
    `for i in (0, 10):\n\tprint('iteration {}').format(i)`
];
// console.log(examples[0]);
examples.forEach((example) => {
    console.log(`INPUT:\n${example}`);
    lexicalAnalyzer(example);
});
// lexicalAnalyzer(examples[0]);
