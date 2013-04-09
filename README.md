[![Build Status](https://secure.travis-ci.org/projectodd/nodej.png)](http://travis-ci.org/projectodd/nodej)

[![Build Status](https://buildhive.cloudbees.com/job/projectodd/job/nodej/badge/icon)](https://buildhive.cloudbees.com/job/projectodd/job/nodej/)

## Hey, What's NodeJ?

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

NodeJ is a new project - a baby, really. So, there's a lot yet to be done. In
addition, some aspects of node.js don't really translate from C++ very well.
For example, we will never support C/C++ addons. This project, however, is not
yet a pure cleanroom implementation. Some of the javascript source code from
node.js - specifically those bits of source that do not depend on any of the
C++ backend - work just fine out of the box. In other cases, only minor
modifications have been made to the node.js source files to take advantage of
Java instead of C++ backend functionality. For now, here's the Node.js API and
it's current NodeJ status. Where we've used any of the node.js source files
directly, it's been noted below.

API implementation is prioritized by the current Node.js [Stability
Index](http://nodejs.org/api/documentation.html#documentation_stability_index).
Features with a stability index of 2 or below are noted below. Since those APIs
that are unstable are likely a moving target, we'll wait for a while to
implement those until they've settled down. And in the meantime, we may just
provide our own (e.g. Clustering).

* <strike>Assert</strike> - complete[1]
* Buffer - incomplete but functional
* C/C++ Addons - unsupported
* Child Processes
* Cluster - Stability 1
* Crypto - Stability 2
* Debugger
* DNS
* Domain - Stability 1
* <strike>Events</strike> - complete[1]
* File System
* <strike>Globals</strike> - complete
* <strike>HTTP</strike> - Complete except for http.Agent
* HTTPS
* <strike>Modules</strike> - complete
* <strike>Net</strike> - complete
* <strike>OS</strike> - complete[3]
* <strike>Path</strike> - complete[1]
* Process - incomplete but functional
* <strike>Punycode</strike> - complete[1] - Stability 2
* <strike>Query Strings</strike> - complete
* Readline - Stability 2
* REPL
* <strike>STDIO</strike> - complete
* <strike>Stream</strike> complete[1] - Stability 2
* String Decoder
* <strike>Timers</strike> - complete
* TLS/SSL
* TTY - Stability 2
* UDP/Datagram
* <strike>URL</strike> - complete[3]
* <strike>Utilities</strike> - complete[2]
* VM - Stability 2
* ZLIB

[1] Direct copy of Node.js source code

[2] Modified copy of Node.js source code

[3] Node.js javascript utilizing Java instead of C++ backend
