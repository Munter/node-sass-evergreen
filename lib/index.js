var version = require('node-sass/package.json').version;
var semver = require('semver');

console.log(version);

if (semver.satisfies(version, '0.x || 1.x')) {
  module.exports = require('./versions-0');
} else if (semver.satisfies(version, '2.x')) {
  module.exports = require('./versions-2');
} else {
  module.exports = require('./versions-3');
}
