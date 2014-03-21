[![build status](https://secure.travis-ci.org/petejkim/factory-lady.png)](http://travis-ci.org/petejkim/factory-lady)

# factory-milady.js

Factory-mlady is a factory library for [Node.js](http://nodejs.org/) inspired
 by [factory-lady](https://github.com/petejkim/factory-lady) by Peter Jihoon
 Kim. It's a great module but in one of my projects we bumped into a few
 issues which we did not really like and then factory-milady was born!

 So for a full explanation please see [here](https://github.com/petejkim/factory-lady).

## Installation

Node.js:

```
npm install factory-milady
```

## Defining Factories

JavaScript:

```javascript
var Factory = require('factory-lady')
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

CoffeeScript:

```coffeescript
Factory = require 'factory-lady'
User    = require '../../app/models/user'
Post    = require '../../app/models/post'

emailCounter = 1

Factory.define 'user', User,
  email    : (cb) -> cb("user#{emailCounter++}@example.com") # lazy attribute
  state    : 'activated'
  password : '123456'

Factory.define 'post', Post,
  user_id  : Factory.assoc 'user', 'id' # simply Factory.assoc 'user' for user object itself
  title    : 'Hello World'
  content  : 'Lorem ipsum dolor sit amet...'
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

CoffeeScript:

```coffeescript
Factory.build 'post', (post) ->
  # post is a Post instance that is not saved

Factory.build 'post', title: 'Foo', content: 'Bar', (post) ->
  # post is a Post instance that is not saved

Factory.create 'post', (post) ->
  # post is a saved Post instance

Factory 'post', (post) ->
  # post is a saved Post instance
  # same as Factory.create
```

## License

Copyright (c) 2011 Peter Jihoon Kim. This software is licensed under the [MIT License](http://github.com/petejkim/factory-lady/raw/master/LICENSE).

