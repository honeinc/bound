
module.exports = _bound.bind( null, 'addEventListener', false );

function noop () {}
// here to store refs to bound functions
var _fns = {};

var bindEvent = 
module.exports.bindEvent = function ( fn, eventName, handler, context, removeCache ) {
    var handlerString = handler.toString();
    if ( typeof handler !== 'function' ) {
        return;
    }
    /* 
      this is to cache the function so it can be unbound from the event
      because fn.bind( ) create a new function, which mean fn === fn.bind() is false
    */ 
    if ( !_fns[ eventName ] ) {
        _fns[eventName] = {};
    }
    if ( !_fns[ eventName ][ handlerString ] ) {
        _fns[ eventName ][ handlerString ] = handler.bind( context );
    }
    handler = _fns[ eventName ][ handlerString ];

    fn( eventName, handler );
    // clear cache on unbind
    if ( removeCache ) {
        delete _fns[ eventName ][ handlerString ];
    }
}

var getMethod =
module.exports.getMethod = function ( handleName, context ) {
    if ( typeof context !== 'object' ) {
        return;
    }
    return ( context || window )[ handleName ];
};

var eachEvent = 
module.exports.eachEvent = function ( fn, eventObj, context, removeCache ) {
    var event,
        eventHandle,
        bindTo;
    for ( var _event in eventObj ) {
        event = eventObj[ _event ];
        if ( Array.isArray( event ) ) {
            if ( typeof event[ 0 ] === 'object' ) {
                bindTo = event[ 0 ];
                if ( typeof event[ 1 ]  === 'string' ) {
                    eventHandle = getMethod( event[ 1 ], bindTo );
                } else {
                    eventHandle = event[ 1 ];
                }
            } else {
                eventHandle = event[ 1 ];
            }
        } else if ( typeof event === 'string' ) {
            eventHandle = getMethod( event, context );
        } else {
            eventHandle = event;
        }
        bindEvent( fn, _event, eventHandle, bindTo || context, removeCache );
    }
};

module.exports.bind = 
module.exports.on =
module.exports.addEventListener = _bound.bind( null, 'addEventListener', false );

module.exports.unbind =
module.exports.off =
module.exports.removeListener = _bound.bind( null, 'removeListener', true );

module.exports.setMethod = function ( method, removeCache ) {
    return _bound.bind( null, method, removeCache );
};

function _bound ( method, removeCache, emitter, eventObj, context  ) {
    var eventMethod;
    if ( typeof emitter === 'function' ) {
        eventMethod = emitter;
    } else {
        eventMethod = ( emitter[ method ] ? emitter[method].bind( emitter ) : noop );
    }
    eachEvent( eventMethod, eventObj, context, removeCache );
}