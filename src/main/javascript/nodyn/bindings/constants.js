/*
 * Copyright 2014 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var nodyn = require('nodyn'),
    FileStat = Packages.jnr.posix.FileStat,
    ConstantSet = Packages.jnr.constants.ConstantSet;

module.exports.S_IFIFO = FileStat.S_IFIFO;  // named pipe (fifo)
module.exports.S_IFCHR = FileStat.S_IFCHR;  // character special
module.exports.S_IFDIR = FileStat.S_IFDIR;  // directory
module.exports.S_IFBLK = FileStat.S_IFBLK;  // block special
module.exports.S_IFREG = FileStat.S_IFREG;  // regular
module.exports.S_IFLNK = FileStat.S_IFLNK;  // symbolic link
module.exports.S_IFSOCK = FileStat.S_IFSOCK; // socket
module.exports.S_IFMT = FileStat.S_IFMT;   // file mask for type checks
module.exports.S_ISUID = FileStat.S_ISUID;  // set user id on execution
module.exports.S_ISGID = FileStat.S_ISGID;  // set group id on execution
module.exports.S_ISVTX = FileStat.S_ISVTX;  // save swapped text even after use
module.exports.S_IRUSR = FileStat.S_IRUSR;  // read permission, owner
module.exports.S_IWUSR = FileStat.S_IWUSR;  // write permission, owner
module.exports.S_IXUSR = FileStat.S_IXUSR;  // execute/search permission, owner
module.exports.S_IRGRP = FileStat.S_IRGRP;  // read permission, group
module.exports.S_IWGRP = FileStat.S_IWGRP;  // write permission, group
module.exports.S_IXGRP = FileStat.S_IXGRP;  // execute/search permission, group
module.exports.S_IROTH = FileStat.S_IROTH;  // read permission, other
module.exports.S_IWOTH = FileStat.S_IWOTH;  // write permission, other
module.exports.S_IXOTH = FileStat.S_IXOTH;  // execute permission, other

module.exports.SIGHUP       =  1;
module.exports.SIGINT       =  2;
module.exports.SIGQUIT      =  3;
module.exports.SIGILL       =  4;
module.exports.SIGTRAP      =  5;
module.exports.SIGABRT      =  6;
module.exports.SIGEMT       =  7;
module.exports.SIGFPE       =  8;
module.exports.SIGKILL      =  9;
module.exports.SIGBUS       = 10;
module.exports.SIGSEGV      = 11;
module.exports.SIGSYS       = 12;
module.exports.SIGPIPE      = 13;
module.exports.SIGALRM      = 14;
module.exports.SIGTERM      = 15;
module.exports.SIGURG       = 16;
module.exports.SIGSTOP      = 17;
module.exports.SIGTSTP      = 18;
module.exports.SIGCONT      = 19;
module.exports.SIGCHLD      = 20;
module.exports.SIGTTIN      = 21;
module.exports.SIGTTOU      = 22;
module.exports.SIGIO        = 23;
module.exports.SIGXCPU      = 24;
module.exports.SIGXFSZ      = 25;
module.exports.SIGVTALRM    = 26;
module.exports.SIGPROF      = 27;
module.exports.SIGWINCH     = 28;
module.exports.SIGINFO      = 29;
module.exports.SIGUSR1      = 30;
module.exports.SIGUSR2      = 31;

jnrConstants('OpenFlags');
jnrConstants('Errno');

function jnrConstants(name) {
  var constants = ConstantSet.getConstantSet(name);
  var iter = constants.iterator();
  while (iter.hasNext()) {
    var e = iter.next();
    module.exports[e.name()] = constants.getValue(e.name());
  }
}
