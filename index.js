module.exports = bounds;

function noop () {}

var bindEvent = 
module.exports.bindEvent = function ( fn, eventName, handler, context ) {
    if ( typeof handler !== 'function' ) {
        return;
    }
    fn( eventName, handler.bind( context ) );
}

var getMethod =
module.exports.getMethod = function ( handleName, context ) {
    if ( typeof context !== 'object' ) {
        return;
    }
    return ( context || window )[ handleName ];
};

var eachEvent = 
module.exports.eachEvent = function ( fn, eventObj, context ) {
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
        bindEvent( fn, _event, eventHandle, bindTo || context );
    }
};

function bounds ( eventEmitter, eventObj, context ) {
    var eventMethod;
    if ( typeof eventEmitter === 'function' ) {
        eventMethod = eventMethod;
    } else {
        eventMethod = eventEmitter.on || noop;
    }

}