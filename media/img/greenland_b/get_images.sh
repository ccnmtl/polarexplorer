#!/bin/bash

for i in {1980..2012}
  do
     `curl http://www.ldeo.columbia.edu/~billr/PolarExplorer/GreenlandMeltingDotComTrimmed_jpg/${i}_orig.jpg > ${i}.jpg`
done