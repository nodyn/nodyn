#!/bin/sh

MVN=/usr/local/bin/mvn
OUTFILE=./tmp/build
TASK="clean verify"

# command line interpolation is broken, I think
# OPTS='-Dtest.pattern="**/netPauseSpec.js"'

if [ ! -e ./tmp ] ; then
  mkdir tmp
fi

for i in {1..1000}
do
  #${MVN} ${TASK} ${OPTS} > ${OUTFILE}-${i}.log 2>&1
  ${MVN} ${TASK} -Dtest.pattern="**/netPauseSpec.js" > ${OUTFILE}-${i}.log 2>&1
done
