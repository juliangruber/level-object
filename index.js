var Store = require('level-store');

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
  var errored = false;
  var called = false;
  var toGet = 0;
  var res = {};
  self.store.createKeyStream()
    .on('data', function (key) {
      toGet++;
      self.get(key, function (err, value) {
        if (errored || called) return;
        if (err) {
          errored = true;
          return cb(err);
        }
        res[key] = value;
        if (!--toGet && ended) {
          called = true;
          cb(null, res);
        }
      });
    })
    .on('error', function (err) {
      if (called) return;
      errored = true;
      cb(err);
    })
    .on('end', function () {
      ended = true;
      if (!toGet) {
        called = true;
        cb(null, res);
      }
    });
};
