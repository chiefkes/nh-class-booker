const loadFunctions = require("firebase-function-tools");
// const functions = require("firebase-functions");
const admin = require("firebase-admin");
// const config = functions.config().firebase;

// admin.initializeApp(config);
admin.initializeApp();

/* this library looks for files with ".func.js" in them and ensures they are exported as Cloud Functions.
ALSO the library uses process.env.FUNCTION_TARGET to reduce cold-start times...
...by only loading files and dependencies needed for a particular cloud function call*/
loadFunctions(__dirname, exports, false, ".func.js");
