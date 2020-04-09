
const sourceContext = require.context('../../main', true, /\.js$/);
sourceContext.keys().forEach(sourceContext);

const testsContext = require.context('.', true, /Spec\.js$/);
testsContext.keys().forEach(testsContext);