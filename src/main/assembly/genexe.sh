#!/bin/sh
if [ ! -d "bin" ] 
then
  mkdir -v "bin"
fi
if [ -f "bin/node" ] 
then 
  echo "Removing old nodyn executable"
  rm -f "bin/node"
fi
echo "Creating node executable"
ARGS='"$@"'
(echo '#!/bin/sh
exec java -Dnodyn.binary=$0 $NODYN_OPTS -jar "$0" "$@"
'; cat target/nodyn-standalone.jar) > bin/node && chmod +x bin/node


