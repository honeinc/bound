## Bound [![Build Status](https://travis-ci.org/honeinc/bound.svg?branch=master)](https://travis-ci.org/honeinc/bound)

a simple way do a large amount of event bindings. Heavily inspired by backbones event bindings in views.
![Bound2](http://media.giphy.com/media/PbEnCbd9rLPi0/giphy.gif)

### To Install

    $ component install honeinc/bound

or on node

    $ npm install node-bound


### Example Usage

Lets say you have a controller, that you want to consume some events from a common messaging system that uses events. Other component used in example is [honeinc/emit](https://github.com/honeinc/emit.git).

```javascript
var emit = require('emit'),
    bound = require('bound');

function UserController ( ) {
    bound( emit, {
        'user:save' : 'handleSave',
        'user:create' : 'handleCreate',
        'user:delete' : 'handleDelete'
    }, this );
}

UserController.prototype.handleSave = function ( ) { /* ... */ };
UserController.prototype.handleCreate = function ( ) { /* ... */ };
UserController.prototype.handleDelete = function ( ) { /* ... */ };

```

This will bind all the events in the given context to the right method and keep the context that is given, which is great when in the context of a constructor.

```javascript
    bound( emitter, eventMethodObject, context );
// eventEmitter ^ event : method ^        ^ context of method
```

You can also unbind events that get bound by `bound`.

```javascript
    bound.unbind( emitter, eventMethodObject, context );
```

## Contributing

To contribute you will need to make sure all the test are passing. To run the test you will need [mocha](http://visionmedia.github.io/mocha/). Then install the dependecies.

    $ npm install

Then to run the test

    $ npm test

