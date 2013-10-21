#!/bin/bash
echo "Bash version ${BASH_VERSION}..."

for i in {1980..2012}
  do
     `curl http://www.ldeo.columbia.edu/~billr/PolarExplorer/GreenlandMeltingGraph_jpg/${i}_orig.jpg > ${i}.jpg`
  done