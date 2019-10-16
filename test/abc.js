console.log("abc.js");
const gthis = Function('return this')();
gthis.expect = require("expect.js");
gthis.localStorage = gthis.localStorage || require('mock-local-storage');
require('./common');
