'use strict';

var sass = require('node-sass');
var extend = require('extend');

sass._version = require('node-sass/package.json').version;

function typesError() {
  throw new Error('types are not available in node-sass ' + sass._version);
}

function checkOptions(options) {
  if (typeof options.importer === 'function' || Array.isArray(options.importer)) {
    throw new Error('options.importer is not supported in node-sass ' + sass._version);
  }

  if (options.indentedSyntax === true) {
    throw new Error('options.indentedSyntax is not supported in node-sass ' + sass._version);
  }
}

module.exports = extend({}, sass, {
  render: function (options, cb) {
    checkOptions(options);

    var stats = {};

    var successCallback = function(css) {
      cb(undefined, {
        css: new Buffer(css, 'utf8'),
        map: new Buffer('', 'utf8'),
        stats: stats
      });
    };

    var errorCallback = function (err) {
      var file = err.match(/^[^:]+/)[0];
      var line = parseInt(err.match(/:(\d+):/)[1] || 0);
      var message = err.match(/error: (.*)/)[1];

      cb({
        message: message,
        line: line,
        file: file
      });
    };

    sass.render(extend({}, options, {
      success: successCallback,
      error: errorCallback,
      stats: stats,
      sourceComments: options.sourceComments === true ? 'normal' : 'none'
    }));
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
