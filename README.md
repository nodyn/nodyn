[![Build Status](https://secure.travis-ci.org/nodyn/nodyn.png)](http://travis-ci.org/nodyn/nodyn)

## Hey, What's Nodyn?

Nodyn is a [node.js](http://nodejs.org) compatible framework, running on the
JVM. It's powered by the [DynJS](https://github.com/dynjs/dynjs) Javascript
runtime and [Vert.x](http://vertx.io), the massively scalable, asynchronous,
polyglot application platform.

"Why do that?", you may ask. Well, imagine running your node app on
the JVM where you immediately have access to all that the Java world has to
provide - directly from Javascript. You've got the entire Java ecosystem at
your disposal. Since DynJS is cross-language compatible, why not throw in a
little JRuby or Clojure with your app if you want.  And with Vert.x built in,
clustering your applications are a breeze.

## Usage

There are two ways to run Nodyn: as a standalone REPL with vertx embedded, or
as as a [language module](http://vertx.io/language_support.html) in Vert.x.

### Running Nodyn in Standalone Mode

Nodyn doesn't yet have an initial release. Until then, to use it, you will need
to build from source or download a CI SNAPSHOT from
[Sontype](https://oss.sonatype.org/content/repositories/snapshots/org/projectodd/nodyn/0.1.1-SNAPSHOT/).
Download the latest zip file from Sonatype. It will contain a `./bin/nodyn` binary.
You can use the binary to start an application from a Javascript file, or use the
REPL to experiment with small snippets of code on the command line.

    $ ./bin/nodyn -h                                           ✭
    usage: nodyn --ast --classpath (-cp) <FILE:FILE:...> --clustered --console --debug --eval (-e) EXPR --help (-h) --properties --version (-v)

     ARGS                              : Arguments
     --ast                             : Displays sources AST
     --classpath (-cp) <FILE:FILE:...> : Append items to classpath
     --clustered                       : run a clustered instance on the localhost
     --console                         : Opens a REPL console.
     --debug                           : Enables debug mode.
     --eval (-e) EXPR                  : Evaluates the given expression
     --help (-h)                       : Shows this help screen.
     --properties                      : Shows config properties.
     --version (-v)                    : Shows current dynjs version.

It is possible to start a small cluster on a single machine by using the
`--clustered` option. For example this will start the REPL in clustered mode.

    $./bin/nodyn --clustered --console

Execute this in multiple terminals to experiment with the clustered event bus
provided by Vert.x

### Running Nodyn as a Vert.x Language Module

By default, Vert.x runs Javascript applications using the Rhino Javascript
runtime.  But this is configurable in vert.x. You can configure your
application to use Nodyn by creating a `langs.properties` file at the root of
your project that looks like this.

    nodyn=org.projectodd~nodyn-verticle~0.1.1-SNAPSHOT:org.projectodd.nodyn.NodeJSVerticleFactory
    .js=nodyn

Make sure that you have Vert.x 2.x or better installed, and start your application.

    $ vertx run myApplication.js

## Building Nodyn

To build nodyn from source, check out the repo, and run `mvn install`.

    $ git clone https://github.com/nodyn/nodyn.git
    $ cd nodyn
    $ mvn install

## API Completion Status

See http://nodyn.io/compatibility
