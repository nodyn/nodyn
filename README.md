[![Build Status](https://secure.travis-ci.org/nodyn/nodyn.png)](http://travis-ci.org/nodyn/nodyn)
# NOTICE

This project is no longer being actively maintained. If you have interest in taking over the project, please file an issue.

## What is Nodyn

Nodyn is a [node.js](http://nodejs.org) compatible framework on the JVM.

Run node.js applications on the JVM and access to all that the Java world has to
provide - directly from Javascript. You've got the entire Java ecosystem at
your disposal. Nodyn supports NPM module loading and a large portion of the
current node.js API.

## Usage

Nodyn doesn't yet have an initial release. Until then, to use it, you will need
to build from source or download a CI SNAPSHOT from
[Sonatype](https://oss.sonatype.org/content/repositories/snapshots/io/nodyn/nodyn/0.1.1-SNAPSHOT/).
Download the latest zip file from Sonatype. It will contain a `./bin/node`
binary.  You can use the binary to start an application from a Javascript file,
or use the REPL to experiment with small snippets of code on the command line.
The `./bin/node` binary behaves nearly identically to the native `node` binary.

## Embedding

Nodyn can be embedded into existing Java programs and execute scripts like so:

    public class EmbedExample {

        private static final String SCRIPT = "" +
                "var main = require('./project/main.js');" +
                "main.run();";


        public void runMain(String... args) throws InterruptedException {
            // Use DynJS runtime
            RuntimeFactory factory = RuntimeFactory.init(
                EmbedExample.class.getClassLoader(), 
                RuntimeFactory.RuntimeType.DYNJS);

            // Set config to run main.js
            NodynConfig config = new NodynConfig( new String[] { "-e", SCRIPT } );

            // Create a new Nodyn and run it
            Nodyn nodyn = factory.newRuntime(config);
            nodyn.setExitHandler( new NoOpExitHandler() );
            try {
                int exitCode = nodyn.run();
                if (exitCode != 0) {
                    throw new TestFailureException();
                }
            } catch (Throwable t) {
                throw new TestFailureException( t );
            }
        }
    }


## Building Nodyn

To build nodyn from source, first check out the repo. Since nodyn uses
node.js sources for the javascript layer, you will also need to run 
`git submodule init` and `git submodule update` the first time you build.

    $ git clone https://github.com/nodyn/nodyn.git
    $ cd nodyn
    $ git submodule init
    $ git submodule update
    $ mvn install -s support/settings.xml

## Website

http://nodyn.io/
