var levelObj = require('..');
var level = require('level-test')({ mem: true });
var test = require('tape');

test('consistency', function (t) {
  var obj = levelObj(level());
  var iterations = 10;

  t.plan(iterations * 2);

  function run () {
    obj.set('obj', 'foo', 'bar');
    obj.set('obj', 'foo', 'baz');

    setTimeout(function () {
      obj.get('obj', 'foo', function (err, val) {
        t.error(err);
        t.equal(val, 'baz');
        if (--iterations) run();
      });
    }, 100);
  }

  run();
});

