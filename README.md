node-sass-evergreen
===================

[![NPM version](https://badge.fury.io/js/node-sass-evergreen.svg)](http://badge.fury.io/js/node-sass-evergreen)
[![Build Status](https://travis-ci.org/Munter/node-sass-evergreen.svg?branch=master)](https://travis-ci.org/Munter/node-sass-evergreen)
[![Coverage Status](https://img.shields.io/coveralls/Munter/node-sass-evergreen.svg)](https://coveralls.io/r/Munter/node-sass-evergreen?branch=master)
[![Dependency Status](https://david-dm.org/Munter/node-sass-evergreen.svg)](https://david-dm.org/Munter/node-sass-evergreen)

This project is designed to be a compatibility layer across [node-sass](https://github.com/sass/node-sass) major versions by always exposing the latest major version API, but have it work for older major versions as well.

This is useful for tool integrations like task runner wrappers or any other tool plugin layers, since it allows them to implement against a single API, leave the node-sass version up to the developer of the individual project, and still be compatible even if the project is a major version ot two behind.

This module is primarily targeted towards tool developer and integrators that create tools for environments they can't entirely control. If you are using node-sass directly in your own project, keep doing so.

**Current API: node.sass 3.x**


Installation and usage
----------------------

Install node-sass-evergreen as a dependency of your project, but don't install node-sass as a dependency. Chosing the specific node-sass version should be up to the consumer of your tool or plugin. You may want to install node-sass as a dev dependency in order to run local tests.

```
npm install --save node-sass-evergreen
npm install --save-dev node-sass
```

In your tool integration include node-sass-evergreen instead of node-sass

```js
var sass = require('node-sass-evergreen');
```

Now you are ready to start using node-sass in your tool. Please refer to the [node-sass README](https://github.com/sass/node-sass) for API specifications.

Example:

```js
sass.render({
  file: './foo.scss',
  outFile: 'foo.css',
  omitSourceMapUrl: true,
  sourceMap: true,
  sourceMapContents: true,
}, function (err, result) {
  // Use the resulting output here
});
```


License
-------

The MIT License (MIT)

Copyright (c) 2015 Peter Müller <munter@fumle.dk>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
