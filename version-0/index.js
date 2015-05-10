'use strict';

var sass = require('node-sass');
var extend = require('extend');

var version = require('node-sass/package.json').version;

function typesError() {
  throw new Error('types are not available in node-sass ' + version);
}

function polyFillOptions(options, cb) {
  var successCallback, errorCallback;
  var stats = {};

  if (typeof options.importer === 'function' || Array.isArray(options.importer)) {
    throw new Error('options.importer is not supported in node-sass ' + version);
  }

  if (options.indentedSyntax === true) {
    throw new Error('options.indentedSyntax is not supported in node-sass ' + version);
  }

  if (cb) {
    successCallback = function(css) {
      cb(undefined, {
        css: new Buffer(css, 'utf8'),
        map: new Buffer('', 'utf8'),
        stats: stats
      });
    };

    errorCallback = function (err) {
      var file = err.match(/^[^:]+/)[0];
      var line = parseInt(err.match(/:(\d+):/)[1] || 0);
      var message = err.match(/error: (.*)/)[1];

      cb({
        message: message,
        line: line,
        file: file
      });
    };
  }

  return extend({}, options, {
    success: successCallback,
    error: errorCallback,
    stats: stats,
    sourceComments: options.sourceComments === true ? 'normal' : 'none'
  });
}

module.exports = extend({}, sass, {
  version: version,

  info: 'node-sass\t' + version + '\t(Wrapper)\t[JavaScript]\nlibsass  \t?.?.?\t(Sass Compiler)\t[C/C++]',

  render: function (options, cb) {
    sass.render(polyFillOptions(options, cb));
  },

  types: {
    'Number': typesError,
    'String': typesError,
    'Color': typesError,
    'Boolean': typesError,
    'List': typesError,
    'Map': typesError,
    'Null': typesError
  }
});
