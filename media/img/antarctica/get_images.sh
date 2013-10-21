#!/bin/bash


for i in {1979..2011}
  do
      `curl http://www.ldeo.columbia.edu/~billr/PolarExplorer/AntarcticSurfaceMeltImages_Trimmed_png/melt-map-ssmi-${i}.png > ${i}.png`
  done