var levelObj = require('..');
var level = require('level-test')({ mem: true });
var test = require('tape');

test('patch', function (t) {
  t.plan(6);
  var obj = levelObj(level());

  obj.patch([
    { type: 'set', key: 'foo', value: 'bar' },  
    { type: 'set', key: 'bar', value: 'baz' },  
  ], function (err) {
    t.error(err);
    obj.toJSON(function (err, json) {
      t.error(err);
      t.deepEqual(json, {
        foo: 'bar',
        bar: 'baz'
      });
      obj.patch([
        { type: 'set', key: 'foo', value: 'nope' },  
        { type: 'del', key: 'bar' },
      ], function (err) {
        t.error(err);
        obj.toJSON(function (err, json) {
          t.error(err);
          t.deepEqual(json, {
            foo: 'nope'
          });
        });
      });
    });
  });
});

