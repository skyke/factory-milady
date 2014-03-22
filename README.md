[![Build Status](https://travis-ci.org/skyke/factory-milady.svg?branch=master)](https://travis-ci.org/skyke/factory-milady)

# factory-milady.js

Factory-milady is a factory library for [Node.js](http://nodejs.org/) inspired
 by [factory-lady](https://github.com/petejkim/factory-lady) by Peter Jihoon
 Kim. The module of Peter is great but in one of my projects we
 bumped into a few issues which we did not really like and thus
 factory-milady was born! Maybe Peter had his reasons for these 'issues' but
 somehow they were *blocking* for us.

 So for a full explanation please see [here](https://github.com/petejkim/factory-lady).

 ## Issues with factory-lady:

1. The library only works with models which support the `new` keyword and
`save` method to persist the data. But what if you just wanted to have a
literal object returned?

2. The code isn't always following the node callback convention `callback
(err, result)`. When an error occurs during the save method the code throws an
Exception instead of calling the callback function with the error.

## Installation

Node.js:

```
npm install factory-milady
```

## Defining Factories

JavaScript:

```javascript
var Factory = require('factory-milady')
  , User    = require('../../app/models/user')
  , Post    = require('../../app/models/post');

var emailCounter = 1;

Factory.define('user', User, {
  email    : function(cb) { cb('user' + emailCounter++ + '@example.com'); } // lazy attribute
, state    : 'activated'
, password : '123456'
});

Factory.define('post', Post, {
  user_id  : Factory.assoc('user', 'id') // simply Factory.assoc('user') for user object itself
, subject  : 'Hello World'
, content  : 'Lorem ipsum dolor sit amet...'
});
```

## Using Factories

JavaScript:

```javascript
Factory.build('post', function(post) {
  // post is a Post instance that is not saved
});

Factory.build('post', { title: 'Foo', content: 'Bar' }, function(post) {
  // build a post and override title and content
});

Factory.create('post', function(post) {
  // post is a saved Post instance
});

Factory('post', function(post) {
  // post is a saved Post instance
  // same as Factory.create
});
```

## License

Copyright (c) 2014 Niels Clauwers. This software is licensed under the [MIT
 License](https://raw.githubusercontent.com/skyke/factory-milady/master/LICENSE).

