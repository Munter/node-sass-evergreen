'use strict';

var sass = require('node-sass');
var extend = require('extend');

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

          tmpMap.sources[0] = options.file || 'stdin';

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
