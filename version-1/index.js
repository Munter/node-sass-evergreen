'use strict';

var sass = require('node-sass');
var extend = require('extend');

var fs = require('fs');
var when = require('when');
var node = require('when/node');

var version = require('node-sass/package.json').version;

function typesError() {
  throw new Error('types are not available in node-sass ' + version);
}

function qualifyError(err) {
  var parts = err.match(/^(.+?):(\d+): /);
  var file = parts[1];
  var line = parseInt(parts[2] || 0);
  var message = err.replace(parts[0], '').trim().replace(/\n$/, '');

  return {
    message: message,
    line: line,
    file: file
  };
}

function polyFillOptions(options, cb) {
  var successCallback, errorCallback;
  var stats = {};

  var sourceMap = options.sourceMap && (options.outFile || options.sourceMap);

  if (typeof options.importer === 'function' || Array.isArray(options.importer)) {
    throw new Error('options.importer is not supported in node-sass ' + version);
  }

  if (options.indentedSyntax === true) {
    throw new Error('options.indentedSyntax is not supported in node-sass ' + version);
  }

  if (sourceMap && !options.file) {
    throw new Error('options.sourceMap is not supported in node-sass ' + version + ' when using options.data');
  }

  if (cb) {
    successCallback = function(css) {
      var sourceMap;

      if (stats.sourceMap) {
        sourceMap = JSON.parse(stats.sourceMap);

        sourceMap.file = options.outFile;
      }

      delete stats.sourceMap;

      var doneCallback = function () {
        cb(null, {
          css: new Buffer(css, 'utf8'),
          map: sourceMap && new Buffer(JSON.stringify(sourceMap), 'utf8'),
          stats: stats
        });
      };

      if (sourceMap && options.sourceMapContents) {
        var readFile = node.lift(fs.readFile);
        when.map(sourceMap.sources, function (path) {
          return readFile(path, 'utf8');
        }).then(function (result) {
          sourceMap.sourcesContent = result;
        }).done(doneCallback, doneCallback);
      } else {
        doneCallback();
      }
    };

    errorCallback = function (err) {
      cb(qualifyError(err));
    };
  }

  var finalOptions = extend({}, options, {
    success: successCallback,
    error: errorCallback,
    stats: stats,
    sourceMap: sourceMap && (sourceMap + '.map')
  });

  return finalOptions;
}

module.exports = extend({}, sass, {
  version: version,

  info: 'node-sass\t' + version + '\t(Wrapper)\t[JavaScript]\nlibsass  \t?.?.?\t(Sass Compiler)\t[C/C++]',

  render: function (options, cb) {
    var compatOptions = polyFillOptions(options, cb);

    sass.render(compatOptions);
  },

  renderSync: function (options) {
    var compatOptions = polyFillOptions(options);
    var result;
    var sourceMap;

    try {
      result = sass.renderSync(compatOptions);
    } catch (err) {
      var qualified = qualifyError(err);
      var newErr = new Error(qualified.message);

      throw extend(newErr, qualified);
    }

    var returnValue = {
      css: new Buffer(result, 'utf8'),
      stats: compatOptions.stats
    };

    if (returnValue.stats.sourceMap) {
      sourceMap = JSON.parse(returnValue.stats.sourceMap);

      sourceMap.file = options.outFile;

      if (options.sourceMapContents) {
        sourceMap.sourcesContent = sourceMap.sources.map(function (path) {
          return fs.readFileSync(path, 'utf8');
        });
      }

      extend(returnValue, {
        map: sourceMap && new Buffer(JSON.stringify(sourceMap), 'utf8'),
      });
    }

    delete returnValue.stats.sourceMap;

    return returnValue;
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
