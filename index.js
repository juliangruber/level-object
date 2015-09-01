var Pathwise = require('level-pathwise');

module.exports = Obj;

function Obj (db) {
  if (!(this instanceof Obj)) return new Obj(db);
  this._store = new Pathwise(db);
};

Obj.prototype.get = function (obj, key, cb) {
  this._store.get([obj, key], cb);
};

Obj.prototype.set = function (obj, key, value, cb) {
  this._store.put([obj, key], value, cb);
};

Obj.prototype.del = function (obj, key, cb) {
  this._store.del([obj, key], cb);
};

Obj.prototype.patch = function (ops, cb) {
  ops = ops.map(function(op){
    return op.type == 'set'
      ? { type: 'put', path: [op.object, op.key], data: op.value }
      : { type: 'del', path: [op.object, op.key] }
  });
  this._store.batch(ops, cb);
};

Obj.prototype.keys = function (obj, cb) {
  this._store.children([obj], cb);
};

Obj.prototype.toJSON = function (obj, cb) {
  this._store.get([obj], cb);
};

