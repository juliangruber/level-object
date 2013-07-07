var levelObj = require('..');
var level = require('level-test')({ mem: true });
var test = require('tape');

test('keys', function (t) {
  t.plan(4);
  var obj = levelObj(level());

  obj.set('foo', 'bar', function (err) {
    t.error(err);
    obj.set('bar', 'baz', function (err) {
      t.error(err);
      obj.keys(function (err, keys) {
        t.error(err);
        t.deepEqual(keys, ['bar', 'foo']);
      });
    });
  })
});

