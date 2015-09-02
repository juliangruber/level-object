
# level-object

Store objects in leveldb.

__It's recommended to use [level-pathwise](https://github.com/juliangruber/level-pathwise) instead since it's a lot more flexible and the api isn't more complicated. `store.set('userid', 'name', 'fritz')` becomes `store.put(['userid', 'name'], 'fritz')`.__

[![build status](https://secure.travis-ci.org/juliangruber/level-object.png)](http://travis-ci.org/juliangruber/level-object)

[![testling badge](https://ci.testling.com/juliangruber/level-object.png)](https://ci.testling.com/juliangruber/level-object)

## Rationale

The idea is that storing JSON in leveldb sucks, because it's hard
to update without risiking inconsistencies.

Say you have `{foo:'bar', bar:'baz'}` stored in a leveldb and want
to add a field:

```js
db.get('obj', function (err, obj) {
  obj.aNew = 'field';
  db.set('obj', obj);
});
```

Now at the same time some other code wants to e.g. modify the value
of one field:

```js
db.get('obj', function (err, obj) {
  obj.foo = 'bar, but changed';
  db.set('obj', obj);
});
```

And you will either get

```json
{
  "foo": "bar",
  "bar": "baz",
  "aNew": "field"
}
```

**or**

```json
{
  "foo": "bar, but changed",
  "bar": "baz"
}
```

but **not**

```js
{
  "foo": "bar, but changed",
  "bar": "baz",
  "aNew": "field"
}
```

There needs to be a mechanism that merges changes together, that still
allows you to retrieve the whole object.

## Usage

```js
var levelObj = require('level-object');
var level = require('level');
var db = level(__dirname + '/db');

var store = levelObj(db);
store.set('name', 'key', 'value', function (err) {
  store.toJSON('name', function (err, json) {
    console.log(json);
    // => { "key": "value" }
  });
});
```

## API

### Obj(db)

Create a new store on the passed `db` object.

### Obj#get(name, key, cb)

Call `cb` with `(err, value)`.

### Obj#set(name, key, value[, cb])

Set `name`'s `key` to `value` and call `cb`, possibly with an error object.

### Obj#del(name, key[, cb])

Delete `name`'s `key` and call `cb`, possibly with an error object.

### Obj#patch(ops, cb)

Modify multiple values and objects at once. `ops` is an array containing objects.

To write / modify a value, add `{ type: 'set', object: name, key: key, value: value }`.

To delete a value, add `{ type: 'del', object: name, key: key }`.

### Obj#keys(name, cb)

Call `cb` with `err` and an array of all set keys, like `Object.keys`.

### Obj#toJSON(name, cb)

Call `cb` with `err` and a JavaScript representation of `name`.

## Installation

With [npm](http://npmjs.org) do

```bash
$ npm install level-object
```

## License

Copyright (c) 2013 Julian Gruber &lt;julian@juliangruber.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
