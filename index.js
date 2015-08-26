var map = require('map-stream');
var toArray = require('stream-to-array');
var defaults = require('levelup-defaults');
var bytewise = require('bytewise');

module.exports = Obj;

function Obj (db) {
  if (!(this instanceof Obj)) return new Obj(db);
  this.db = defaults(db, {
    keyEncoding: bytewise,
    valueEncoding: 'json'
  });
};

Obj.prototype.get = function (obj, key, cb) {
  this.db.get([obj, key], cb);
};

Obj.prototype.set = function (obj, key, value, cb) {
  this.db.put([obj, key], value, cb);
};

Obj.prototype.del = function (obj, key, cb) {
  this.db.del([obj, key], cb);
};

Obj.prototype.patch = function (ops, cb) {
  ops = ops.map(function(op){
    return {
      key: [op.object, op.key],
      value: op.value,
      type: {
        set: 'put',
        'del': 'del'
      }[op.type]
    };
  });
  this.db.batch(ops, cb);
};

Obj.prototype.keys = function (obj, cb) {
  toArray(this.db.createKeyStream({
    gt: [obj, null],
    lt: [obj, undefined] 
  }), function(err, keys){
    if (err) return cb(err);
    cb(null, keys.map(function(key){
      return key[1];
    }));
  });
};

Obj.prototype.toJSON = function (obj, cb) {
  var self = this;
  var ended = false;
  var res = {};
  self.db.createReadStream({
    gt: [obj, null],
    lt: [obj, undefined]
  })
  .on('data', function (kv) {
    res[kv.key[1]] = kv.value;
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
