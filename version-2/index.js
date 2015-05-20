'use strict';

var sass = require('node-sass');
var extend = require('extend');
var Path = require('path');

var version = require('node-sass/package.json').version;

function typesError() {
  throw new Error('types are not available in node-sass ' + version);
}

function qualifyResult(originalResult, options) {
  var result = extend({}, originalResult);

  result.css = new Buffer(result.css, 'utf8');

  if (result.map) {
    if (result.map === '{}') {
      result.map = undefined;
    } else {
      var tmpMap = JSON.parse(result.map);

      if (tmpMap.sources.length) {
        var dir = Path.dirname(options.file);
        tmpMap.sources = tmpMap.sources.map(function (sourcePath) {
          return Path.join(dir, sourcePath);
        });
      }

      result.map = new Buffer(JSON.stringify(tmpMap), 'utf8');
    }
  }

  return result;
}

function polyFillOptions(options, cb) {
  var successCallback, errorCallback;

  successCallback = function(result) {
    cb(null, qualifyResult(result, options));
  };

  errorCallback = function (err) {
    cb(err);
  };

  return extend({}, options, {
    success: successCallback,
    error: errorCallback
  });
}

module.exports = extend({}, sass, {
  version: version,

  info: sass.info(),

  render: function (options, cb) {
    var compatOptions = polyFillOptions(options, cb);

    sass.render(compatOptions);
  },

  renderSync: function (options) {
    var result;

    try {
      result = sass.renderSync(options);
    } catch (err) {
      var errJson = JSON.parse(err);
      var error = new Error(errJson.message);

      throw extend(error, errJson);
    }

    var qualityResult = qualifyResult(result, options);

    if (typeof qualityResult.map === 'undefined') {
      delete qualityResult.map;
    }

    return qualityResult;
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
