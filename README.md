## Bound

a simple way do a large amount of event bindings. Heavily inspired by backbones event bindings in views.
![Bound2](http://media.giphy.com/media/V1Qwtvtb32L3a/giphy.gif)

### To Install

    $ component install honeinc/bound


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
