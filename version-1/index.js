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
  var parts = err.split(/: */);
  var file = parts[0];
  var line = parseInt(parts[1] || 0);
  var message = parts[2].trim().replace(/\n$/, '');

  return {
    message: message,
    line: line,
    file: file
  };
}

function polyFillOptions(options, cb) {
  var successCallback, errorCallback;
  var sourcePromise = when.resolve();
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
    if (sourceMap && options.sourceMapContents) {
      sourcePromise = node.lift(fs.readFile)(options.file, 'utf8')
        .catch(function () {
          return undefined;
        });
    }

    successCallback = function(css) {
      var sourceMap;

      if (stats.sourceMap) {
        sourceMap = JSON.parse(stats.sourceMap);

        sourceMap.file = options.outFile;
      }

      delete stats.sourceMap;

      if (options.sourceComments === true && options.data) {
        css = css.replace(', source string */', ', stdin */');
      }

      var doneCallback = function () {
        cb(null, {
          css: new Buffer(css, 'utf8'),
          map: sourceMap && new Buffer(JSON.stringify(sourceMap), 'utf8'),
          stats: stats
        });
      };

      sourcePromise.then(function (source) {
        if (sourceMap && options.sourceMapContents) {
          sourceMap.sourcesContent.unshift(source);
        }
      }).done(doneCallback, doneCallback);
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

    if ('sourceMap' in compatOptions.stats) {
      extend(returnValue, {
        map: compatOptions.stats.sourceMap && new Buffer(compatOptions.stats.sourceMap, 'utf8'),
      });

      delete returnValue.stats.sourceMap;
    }

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
