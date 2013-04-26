[![Build Status](https://secure.travis-ci.org/projectodd/nodej.png)](http://travis-ci.org/projectodd/nodej)

[![Build Status](https://buildhive.cloudbees.com/job/projectodd/job/nodej/badge/icon)](https://buildhive.cloudbees.com/job/projectodd/job/nodej/)

## Hey, What's NodeJ?

**NOTE: The name is changing to nodyn soon.**

NodeJ is a [node.js](http://nodejs.org) compatible framework, running on the
JVM and powered by the [DynJS](https://github.com/dynjs/dynjs) Javascript
runtime. "Why do that?", you may ask. Well, imagine running your node app on
the JVM where you immediately have access to all that the Java world has to
provide - directly from Javascript. With this approach, extending node doesn't
require C++ addons. You've got the entire Java ecosystem at your disposal
instead. And since DynJS is cross-language compatible, why not throw in a
little JRuby or Clojure with your app if you want. It's all available on the
JVM. Neat, right? We thought so, and thus we decided to try and make it happen.

## How Do I Run It?

Be prepared to get your hands dirty. NodeJ is still a work in progress and it's
evolving daily. But for now, if you want to run it, you need to be willing to
build it from source. And to do that, you'll need to build vert.x from source.
But for now, because you asked....

    $ git clone https://github.com/vert-x/vert.x.git
    $ cd vert.x
    $ ./gradlew collectDeps
    $ ./gradelew distTar

This will put the complete vert.x installation in
`build/vert.x-2.0.0-SNAPSHOT`. Just update your `$PATH` to include
`/path/to/repo/vert.x/build/vert.x-2.0.0-SNAPSHOT/bin`. 

Then, you'll need to build nodej.

    $ git clone https://github.com/projectodd/nodej.git
    $ cd nodej
    $ mvn install

By default, vert.x runs Javascript with Rhino. Change this to use lang-dynjs
and nodej by creating a `langs.properties` file at the root of your project
that looks like this.

    nodejs=org.projectodd~nodej~0.1.1-SNAPSHOT:org.projectodd.nodej.NodeJSVerticleFactory
    .js=nodejs

Now you should be able to run nodej through vert.x like so.

    $ vertx run someFile.js

## API Completion Status

See http://nodyn.io/compatibility

