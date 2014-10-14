

//Native extension for .jar
Module._extensions['.jar'] = process.jaropen.bind(process);
