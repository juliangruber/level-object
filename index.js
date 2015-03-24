var map = require('map-stream');
var toArray = require('stream-to-array');

module.exports = Obj;

function Obj (db) {
  if (!(this instanceof Obj)) return new Obj(db);
  this.db = db;
};

Obj.prototype.get = function (key, cb) {
  this.db.get(key, cb);
};

Obj.prototype.set = function (key, value, cb) {
  this.db.put(key, value, cb);
};

Obj.prototype.del = function (key, cb) {
  this.db.del(key, cb);
};

Obj.prototype.patch = function (ops, cb) {
  ops = ops.map(function(op){
    return {
      key: op.key,
      value: op.value,
      type: {
        set: 'put',
        'del': 'del'
      }[op.type]
    };
  });
  this.db.batch(ops, cb);
};

Obj.prototype.keys = function (cb) {
  toArray(this.db.createKeyStream(), cb);
};

Obj.prototype.toJSON = function (cb) {
  var self = this;
  var ended = false;
  var res = {};
  self.db.createKeyStream()
    .pipe(map(function (key, done) {
      self.get(key, function (err, value) {
        if (err) return done(err);
        done(null, { key: key, val: value });
      });
    }))
    .on('data', function (kv) {
      res[kv.key] = kv.val;
    })
    .on('end', onEnd)
    .on('error', onEnd);

  function onEnd (err) {
    if (ended) return;
    ended = true;
    if (err) cb(err);
    else cb(null, res);
  }
};
