var Store = require('level-store');
var map = require('map-stream');

module.exports = Obj;

function Obj (db) {
  if (!(this instanceof Obj)) return new Obj(db);
  this.store = Store(db);
};

Obj.prototype.get = function (key, cb) {
  this.store.head(key, cb);
};

Obj.prototype.set = function (key, value, cb) {
  this.store.append(key, value, { capped: 1 }, cb);  
};

Obj.prototype.keys = function (cb) {
  this.store.keys(cb);
};

Obj.prototype.toJSON = function (cb) {
  var self = this;
  var ended = false;
  var res = {};
  self.store.createKeyStream()
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
