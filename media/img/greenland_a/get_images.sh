#!/bin/bash

for i in {1979..2007}
  do
     `curl http://www.ldeo.columbia.edu/~billr/PolarExplorer/GreenlandMeltDays_png/GreenlandMeltDays_${i}.png > ${i}.png` 
 done