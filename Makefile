test: install
	./node_modules/.bin/mocha --reporter list

install:
	@echo "xml2-config --version"; \
		xml2-config --version \
		|| (echo "Error: libxml2-dev not installed" && false)
	npm install -d
	@ls config.js > /dev/null 2>&1 \
		|| (echo "Error: file 'config.js' does not exist, copy/edit from config.js.tmpl" && false)

clean:
	@rm -fr ./node_modules

.PHONY: test
