#!/bin/sh
if [ ! -d "bin" ] 
then
  mkdir -v "bin"
fi
if [ -f "bin/nodyn" ] 
then 
  echo "Removing old nodyn executable"
  rm -f "bin/nodyn"
fi
echo "Creating nodyn executable"
ARGS='"$@"'
(echo '#!/bin/sh
exec java $NODYN_OPTS -jar "$0" "$@"
'; cat target/nodyn-standalone.jar) > bin/nodyn && chmod +x bin/nodyn


