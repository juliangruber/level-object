var levelObj = require('..');
var level = require('level-test')({ mem: true });
var test = require('tape');

test('patch', function (t) {
  t.plan(6);
  var db = level();
  var obj = levelObj(db);

  obj.patch([
    { type: 'set', object: 'obj', key: 'foo', value: 'bar' },  
    { type: 'set', object: 'obj', key: 'bar', value: 'baz' },  
  ], function (err) {
    t.error(err);
    obj.toJSON('obj', function (err, json) {
      t.error(err);
      t.deepEqual(json, {
        foo: 'bar',
        bar: 'baz'
      });
      obj.patch([
        { type: 'set', object: 'obj', key: 'foo', value: 'nope' },  
        { type: 'del', object: 'obj', key: 'bar' },
      ], function (err) {
        t.error(err);
        obj.toJSON('obj', function (err, json) {
          t.error(err);
          t.deepEqual(json, {
            foo: 'nope'
          });
        });
      });
    });
  });
});
