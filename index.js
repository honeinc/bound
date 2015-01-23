/* jshint browser: true */
/* jshint node: true */

'use strict';

module.exports = _bound.bind( null, 'on', false );

function noop () {}
// here to store refs to bound functions
var md5 = require( 'blueimp-md5' ).md5,
    utils = require( './src/utils' );

var bindEvent = 
module.exports.bindEvent = function ( fn, eventName, handler, context, removeCache ) {
    if ( typeof handler !== 'function' ) {
        return;
    }
    var _id = md5( handler.toString() + JSON.stringify( utils.decycleObject( context.slice( 1 ) ) ) ),
        _context = context[ 0 ];
    /* 
      this is to cache the function so it can be unbound from the event
      because fn.bind( ) create a new function, which mean fn === fn.bind() is false
    */
    _context._boundListeners = _context._boundListeners || {};

    if ( !_context._boundListeners[ eventName ] ) {
        _context._boundListeners[ eventName ] = {};
    }

    if ( !_context._boundListeners[ eventName ][ _id ] ) {
        _context._boundListeners[ eventName ][ _id ] = handler.bind.apply( handler, context );
    }
    handler = _context._boundListeners[ eventName ][ _id ];

    fn( eventName, handler );
    // clear cache on unbind
    if ( removeCache ) {
        delete _context._boundListeners[ eventName ][ _id ];
    }
};

var getMethod =
module.exports.getMethod = function ( handleName, context ) {
    if ( typeof context !== 'object' ) {
        return;
    }
    return typeof handleName === 'function' ? handleName : ( context || window )[ handleName ];
};

var eachEvent = 
module.exports.eachEvent = function ( fn, eventObj, context, removeCache ) {
    var event,
        eventHandle,
        bindTo;
    for ( var _event in eventObj ) {
        event = eventObj[ _event ];
        if ( Array.isArray( event ) ) {
            if ( typeof event[ 0 ] === 'object' && !context ) {
                bindTo = event[ 0 ];
                if ( typeof event[ 1 ]  === 'string' ) {
                    eventHandle = getMethod( event[ 1 ], bindTo );
                } else {
                    eventHandle = event[ 1 ];
                }
                bindTo = [ bindTo ];
            } else {
                eventHandle = getMethod( event.shift(), context );
                event.unshift( context );
                bindTo = event;
            }
        } else if ( typeof event === 'string' ) {
            eventHandle = getMethod( event, context );
        } else {
            eventHandle = event;
        }

        bindEvent( fn, _event, eventHandle, bindTo || [ context ], removeCache );
    }
};

module.exports.bind = 
module.exports.on =
module.exports.addEventListener =
module.exports.addListener = _bound.bind( null, 'on', false );

module.exports.unbind =
module.exports.off =
module.exports.removeEventListener =
module.exports.removeListener = _bound.bind( null, 'off', true );

module.exports.setMethod = function ( method, removeCache ) {
    return _bound.bind( null, method, removeCache );
};

function _bound( method, removeCache, emitter, eventObj, context  ) {
    
    var eventMethod = emitter ? emitter[ method ] : null;
    if ( !eventMethod && emitter ) {
        switch( method ) {
            case 'on':
                eventMethod = emitter.addEventListener || emitter.addListener;
                break;
            case 'off':
                eventMethod = emitter.removeEventListener || emitter.removeListener;
                break;
        }
    }
    
    if ( !eventMethod ) {
        throw new Error( 'Could not bind to method "' + method + '".' );
    }

    eventMethod = eventMethod.bind( emitter );
    eachEvent( eventMethod, eventObj, context, removeCache );
}
