/// <reference path="../../../typings/tsd.d.ts" />
require('source-map-support/register');
var assert = require('assert');
var index_1 = require('../../../src/lib/node/index');
describe("JsObjectUtil:", function () {
    context('Verify get object API methods', function () {
        it("(Native Object): get object from string notation", function () {
            var processOut = index_1.GetObjectFromName("process.stdout");
            assert.strictEqual(processOut, process.stdout, "should be the same object.");
        });
        it("(Module Object): get object from string notation and module path, with 2 layer deep", function () {
            var obj = index_1.GetObjectFromName("bunyan.stdSerializers", "bunyan");
            assert.ok(index_1.IsNotNullnorUndefined(obj), "got object should not be undefined or null.");
            var bunyan = require('bunyan');
            var target = bunyan.stdSerializers;
            assert.ok(index_1.IsNotNullnorUndefined(target), "bunyan bundled serializer should not be undefined.");
            assert.strictEqual(obj, target, "should be the same object.");
        });
        it("(Module Object): get object from string notation and module path, with 3 layer deep", function () {
            var obj = index_1.GetObjectFromName("bunyan.stdSerializers.req", "bunyan");
            assert.ok(index_1.IsNotNullnorUndefined(obj), "got object should not be undefined or null.");
            var bunyan = require('bunyan');
            var target = bunyan.stdSerializers.req;
            assert.ok(index_1.IsNotNullnorUndefined(target), "bunyan bundled serializer should not be undefined.");
            assert.strictEqual(obj, target, "should be the same object.");
        });
    });
    context('Verify check Null, Undefined object methods', function () {
        it("Verify check object null or undefined API methods", function () {
            var nullObj = null;
            var normalObj = {};
            var undefinedObj = normalObj['not exist property'];
            assert.ok(index_1.IsNullOrUndefined(nullObj) === true, "should return false when input argument is null.");
            assert.ok(index_1.IsNullOrUndefined(undefinedObj) === true, "should return false when input argument is undefined.");
            assert.ok(index_1.IsNullOrUndefined(normalObj) === false, "should return true when input argument is normal object");
            assert.ok(index_1.IsNotNullnorUndefined(nullObj) === false, "should return false when input argument is null.");
            assert.ok(index_1.IsNotNullnorUndefined(undefinedObj) === false, "should return false when input argument is undefined.");
            assert.ok(index_1.IsNotNullnorUndefined(normalObj) === true, "should return true when input argument is normal object");
        });
    });
});
//# sourceMappingURL=unittest.js.map