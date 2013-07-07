var levelObj = require('..');
var level = require('level-test')({ mem: true });
var test = require('tape');

test('to-json', function (t) {
  t.plan(4);
  var obj = levelObj(level());

  obj.set('foo', 'bar', function (err) {
    t.error(err);
    obj.set('bar', 'baz', function (err) {
      t.error(err);
      obj.toJSON(function (err, json) {
        t.error(err);
        t.deepEqual(json, {
          foo: 'bar',
          bar: 'baz'
        });
      });
    });
  })
});

