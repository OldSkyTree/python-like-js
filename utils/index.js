'use strict';

exports.stringInsert = (string, index, substring) => string.slice(0, index) + substring + string.slice(index);
