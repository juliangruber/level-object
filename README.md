
# level-object

Store objects in leveldb.

[![build status](https://secure.travis-ci.org/juliangruber/level-object.png)](http://travis-ci.org/juliangruber/level-object)

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

var obj = levelObj(db); // turn the whole db into a object
obj.set('foo', 'bar', function (err) {
  obj.toJSON(function (err, json) {
    console.log(json);
    // => { "foo": "bar" }
  });
});
```

As you see you can only pass a whole database object to `levelObj`.
That means, if you want your object to be at `a:b:c` e.g., you have
to *pass a [sublevel](https://github.com/dominictarr/level-sublevel)*:

```js
var obj = levelObj(db.sublevel('a:b:c'));
```

## API

### Obj(db)

Create a new object on the passed `db` object.

### Obj#get(key, cb)

Call `cb` with `(err, value)`.

### Obj#set(key, value[, cb])

Set `key` to `value` and call `cb`, possibly with an error object.

### Obj#keys(cb)

Call `cb` with `err` and an array of all set keys, like `Object.keys`.

### Obj#toJSON(cb)

Call `cb` with `err` and a JavaScript representation of `Obj`.

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
