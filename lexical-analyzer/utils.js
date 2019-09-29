'use strict';

exports.isDigit = (char) => /^\d$/.test(char);

exports.isLetterOr_ = (char) => /^[a-z_]$/i.test(char);
