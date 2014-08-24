var assert = require('assert'),
    Emitter = require('component-emitter'),
    emitter = new Emitter();
    bounds = require('../index.js');

describe( 'bounds', function ( ) {
    describe( '#getMethod', function ( ) {
        it('should return undefined if a bad method name is given', function ( ) {
            assert.equal( undefined, bounds.getMethod('hello') );
        });
        it('should return a function if a good method name is given', function ( ) {
            function world ( ) { }
            assert.equal( world.toString(), bounds.getMethod('hello', { hello : world }).toString() );
        });
    });
    describe( '#bindEvents', function ( ) {
        it('should bind an event to an emitter if given the emitters bind function', function ( done ) {
            function handle ( msg ) {
                assert.equal( 'hello', msg );
                assert.equal( 'yeah', this.test );
                done();
            }
            // need to bind this
            bounds.bindEvent( emitter.on.bind(emitter), 'test', handle, { test : 'yeah' });
            emitter.emit('test', 'hello');
        });
    });
    describe( '#eachEvent', function ( ) {
        it('should bind each event given in a object to the function given', function ( done ) {
            function handle ( msg ) {
                assert.equal( 'hello', msg );
                assert.equal( 'yeah', this.test );
            }
            function handle2 ( msg ) {
                assert.equal( 'hello', msg );
                assert.equal( 'yeah', this.test );
                done();
            }
            // need to bind this
            bounds.eachEvent( emitter.on.bind( emitter ), {
                'test2': handle,
                'test2.another': handle2
            }, { test : 'yeah' });
            emitter.emit('test2', 'hello');
            emitter.emit('test2.another', 'hello');
        });

        it('should bind to the event emitter and also bind context ( first param ) of the handler ( second param ) when array is given', function ( done ) {
            function handle ( msg ) {
                assert.equal( 'hello', msg );
                assert.equal( true, this.testing );
            }
            function handle2 ( msg ) {
                assert.equal( 'jeeze', msg );
                assert.equal( 'beans', this.cool );
                done();
            }
            // need to bind this
            bounds.eachEvent( emitter.on.bind( emitter ), {
                'test3': [ { testing : true }, handle ],
                'test3.another': [ { cool : 'beans' }, handle2 ]
            });
            emitter.emit('test3', 'hello');
            emitter.emit('test3.another', 'jeeze');
        });

        it('should bind to the event emitter to method from the context when a string is given', function ( done ) {
            var handles = {
                one : function ( msg ) {
                    assert.equal( 'hamburger', msg );
                    assert.equal( true, this.testing );
                },
                two : function ( msg ) {
                    assert.equal( 'louise', msg );
                    assert.equal( 'cucumbers', this.cool );
                    done();
                },
                testing : true,
                cool : 'cucumbers'
            };
            // need to bind this
            bounds.eachEvent( emitter.on.bind( emitter ), {
                'test4': 'one',
                'test4.another': 'two' 
            }, handles );
            emitter.emit('test4', 'hamburger');
            emitter.emit('test4.another', 'louise');
        });

        it('should bind to the event emitter to method from the context when a string is given inside of an Array with a context', function ( done ) {
            var handles = {
                one : function ( msg ) {
                    assert.equal( 'hamburger', msg );
                    assert.equal( true, this.testing );
                },
                two : function ( msg ) {
                    assert.equal( 'louise', msg );
                    assert.equal( 'cucumbers', this.cool );
                    done();
                },
                testing : true,
                cool : 'cucumbers'
            };
            // need to bind this
            bounds.eachEvent( emitter.on.bind( emitter ), {
                'test5': [ handles, 'one' ],
                'test5.another': [ handles, 'two' ] 
            });
            emitter.emit('test5', 'hamburger');
            emitter.emit('test5.another', 'louise');
        });
    });

    it('should bind an event to an object given if a proper handler is given', function( done ){
        function handle ( msg ) {
            assert.equal( 'hello world', msg );
            assert.equal( 'ice', this.nice );
            done();
        }
        bounds( emitter, {
            'test6' : 'handle'
        }, { 
            handle : handle,
            nice : 'ice'
        });
        emitter.emit('test6', 'hello world');
    });

    it('should not throw an error if an improper handler is given', function( ){
        bounds( emitter, {
            'test6' : 'handle'
        }, {});
    });

    describe( '#unbind', function ( ) {
            it('should unbind an event to an emitter', function ( done ) {
                function handle ( msg ) {
                    throw new Error('Error event handle executed when it should not have');
                }
                setTimeout( done, 500 );
                bounds( emitter, {
                    'test7' : handle
                });
                bounds.unbind( emitter, {
                    'test7' : handle
                });
                emitter.emit('test7', 'hello world');
        });
    });

    describe( '#unbind', function ( ) {
        it('should bind an event to an object given if a proper handler is given', function( done ){
            function handle ( msg ) {
                assert.equal( 'hello world', msg );
                assert.equal( 'ice', this.nice );
                done();
            }
            bounds.bind( emitter, {
                'test8' : 'handle'
            }, { 
                handle : handle,
                nice : 'ice'
            });
            emitter.emit('test8', 'hello world');
        });    
    });

    describe( '#setMethod', function ( ) {
        it('should return a function', function( ){
            var getRoutes = bounds.setMethod( 'get' );
            assert.equal( typeof getRoutes, 'function' );
        });    
    });
    
});