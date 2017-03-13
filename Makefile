APP=polarexplorer
JS_FILES=media/js/crumble.js media/js/glacier.js media/js/interactive.js media/js/isostaticrebound.js media/js/vslider.js media/js/water.js
MAX_COMPLEXITY=5

all: jenkins

include *.mk

eslint: $(JS_SENTINAL)
	$(NODE_MODULES)/.bin/eslint $(JS_FILES)

.PHONY: eslint
