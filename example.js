var levelObj = require('./');
var level = require('level-test')({ mem: true });

var db = level(__dirname + '/db');

var obj = levelObj(db);
var received = 0;

function test () {
  obj.set('name', 'foo', 'bar');
  obj.set('name', 'foo', 'baz');

  setTimeout(function () {
    obj.get('name', 'foo', function (err, val) {
      if (err) throw err;
      if (val != 'baz') throw new Error('no');
      console.log(val);
      if (received++ < 10) test();
    });
  }, 100);
}

test();
