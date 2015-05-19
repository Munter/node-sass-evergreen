'use strict';

var sass = require('node-sass');
var extend = require('extend');
var Path = require('path');

var version = require('node-sass/package.json').version;

function typesError() {
  throw new Error('types are not available in node-sass ' + version);
}

function polyFillOptions(options, cb) {
  var successCallback, errorCallback;

  if (cb) {
    successCallback = function(result) {
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
          } else {
            tmpMap.sources.push('stdin');
          }

          result.map = new Buffer(JSON.stringify(tmpMap), 'utf8');
        }
      }

      cb(null, result);
    };

    errorCallback = function (err) {
      cb(err);
    };
  }

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

    result.css = new Buffer(result.css, 'utf8');

    if (result.map === '{}') {
      delete result.map;
    }

    return result;
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
