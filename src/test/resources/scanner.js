var FILE_SYSTEM = java.nio.file.FileSystems.getDefault(),
    VISIT_RESULT = java.nio.file.FileVisitResult,
    FILES = java.nio.file.Files;

module.exports = {

  findSpecs: function(pattern) {

    if(!pattern.startsWith("./")){
        pattern = "./" + pattern;
    }

    var pathMatcher = FILE_SYSTEM.getPathMatcher("glob:" + pattern),
        paths = [];

    function visit(file, attrs) {
      if (pathMatcher.matches(file)) {
        paths.push(file.toAbsolutePath().toString());
      }
      return VISIT_RESULT.CONTINUE;
    }

    try{
      var visitor = new java.nio.file.SimpleFileVisitor({ visitFile: visit });
      FILES.walkFileTree(FILE_SYSTEM.getPath(".", [""]), visitor);
    } catch (e) {
      console.error(e);
    }
    return paths;
  }

};


