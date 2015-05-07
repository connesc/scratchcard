gulp = node_modules/.bin/gulp

.PHONY: dist

dist: $(gulp)
	$< build

clean: $(gulp)
	$< clean

$(gulp):
	npm install --production false
