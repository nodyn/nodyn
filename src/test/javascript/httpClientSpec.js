"use strict";

var helper = require('./specHelper');
var http   = require('http');
var net    = require('net');

describe( "http.request", function() {

  beforeEach(function() {
    helper.testComplete(false);
  });

  afterEach(function(){
  });

  it( "should allow the creation of an unsent request", function() {
    var request = http.request( {}, function(response) {
      // nothing
    });
    expect( request ).not.toBe( undefined );
    request.abort();
  });

  it( "should send the request when headers are implicitly sent", function() {
    waitsFor(helper.testComplete, "page to load", 5000 );
    var page = '';
    var request = http.request( { host: 'nodyn.io' }, function(response) {
      response.on('data', function(d) {
        page += d.toString();
      })
      response.on( 'end', function() {
        request.socket.end();
        expect( page.indexOf( 'Red Hat' ) ).not.toBe( 0 );
        helper.testComplete(true);
      });
    });
    request.end();
  });

  it('should receive a "socket" event', function() {
      waitsFor(helper.testComplete, "page to load", 5000 );
      var socket;
      var request = http.request( { host: 'nodyn.io' }, function(response) {
        response.on('data',function(){});
        response.on('end', function() {
          expect( socket ).not.toBe( undefined );
          helper.testComplete(true);
        });
      });
      request.on( "socket", function(s) {
        socket = s;
      })
      System.err.println( "AND GO!" );
      request.end();
  });

  it('should allow later binding of a response-handler', function(){
      waitsFor(helper.testComplete, "page to load", 5000 );
      var page = '';
      var request = http.request( { host: 'nodyn.io' } );
      request.on('response', function(response) {
        response.on('data', function(d) {
          page += d.toString();
        })
        response.on( 'end', function() {
          request.socket.end();
          expect( page.indexOf( 'Red Hat' ) ).not.toBe( 0 );
          helper.testComplete(true);
        });
      });
      request.end();
  });
});


