[![Build Status](https://secure.travis-ci.org/nodyn/nodyn.png)](http://travis-ci.org/nodyn/nodyn)

## Hey, What's Nodyn?

Nodyn is a [node.js](http://nodejs.org) compatible framework on the JVM.

Run node.js applications on the JVM and access to all that the Java world has to
provide - directly from Javascript. You've got the entire Java ecosystem at
your disposal. Nodyn supports NPM module loading and a large portion of the
current node.js API.

## Usage

Nodyn doesn't yet have an initial release. Until then, to use it, you will need
to build from source or download a CI SNAPSHOT from
[Sonatype](https://oss.sonatype.org/content/repositories/snapshots/io/nodyn/nodyn/0.1.1-SNAPSHOT/).
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

## Building Nodyn

To build nodyn from source, check out the repo, and run `mvn install`.

    $ git clone https://github.com/nodyn/nodyn.git
    $ cd nodyn
    $ mvn install

## API Completion Status

See http://nodyn.io/compatibility
