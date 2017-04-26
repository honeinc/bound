## Bound [![Build Status](https://travis-ci.org/honeinc/bound.svg?branch=master)](https://travis-ci.org/honeinc/bound)

a simple way do a large amount of event bindings. Heavily inspired by backbones event bindings in views.
![Bound2](http://media.giphy.com/media/PbEnCbd9rLPi0/giphy.gif)

### To Install

    $ npm install node-bound

This also works with [browserify](http://browserify.org).

### Example Usage

Lets say you have a controller, that you want to consume some events from a common messaging system that uses events.

```javascript
var emitter = new ( require( 'events' ).EventEmitter )(), // new EventEmitter()
    bound = require('node-bound');

function UserController ( data ) {
    bound( emitter, {
        'user:save' : 'handleSave', // emit.addListener( 'user:save', this.handleSave.bind( this ) );
        'user:create' : [ 'handleCreate', data.anonId ] , // support for partials
        'user:delete' : this.handleDelete // pass a function instead
    }, this );
}

UserController.prototype.handleSave = function ( ) { 
    console.log( this ); // [ Object UserController ] 
};
UserController.prototype.handleCreate = function ( partialParam ) { /* ... */ };
UserController.prototype.handleDelete = function ( ) { /* ... */ };

```

This will bind all the events in the given context to the right method and keep the context that is given, which is great when in the context of a constructor.

```javascript
    bound( emitter, eventMethodObject, context );
// eventEmitter ^ event : method ^        ^ context of method
```
There is also a bunch of aliases: `bound.on`, `bound.bind`, `bound.addEventListener`, `bound.addListener`

You can also unbind events that get bound by `bound`.

```javascript
    bound.unbind( emitter, eventMethodObject, context );
```
Unbinding also has aliases: `bound.off`, `bound.unbind`, `bound.removeEventListener`, `bound.removeListener`


## Contributing

To contribute you will need to make sure all the test are passing. To run the test you will need [mocha](http://mochajs.org/). Then install the dependecies.

    $ npm install

Then to run the test

    $ npm test

