BIN = ./node_modules/.bin
SRC = $(wildcard src/*.js) $(wildcard src/*/*.js) $(wildcard src/*/*/*.js)
LIB = $(SRC:src/%.js=lib/%.js)
SRCSASS = $(wildcard src/assets/css/*.sass) $(wildcard src/assets/css/*.scss)
SRCASSETS = $(wildcard src/assets/static/*)
LIBASSETS = $(SRCASSETS:src/assets/static/%=lib/assets/static/%)

build: babel static browserify sass
	@cp node_modules/material-design-lite/material.min.js lib/assets/material.js

babel: $(LIB)
static: $(LIBASSETS)

sass: lib/assets/readings.css
browserify: lib/assets/readings.js

lib/assets/readings.js: $(LIB)
	@mkdir -p $(@D)
	@$(BIN)/browserify lib/client.js --outfile $@

lib/assets/readings.css: $(SRCSASS) src/assets/readings.scss
	@mkdir -p $(@D)
	@$(BIN)/node-sass src/assets/readings.scss $@

lib/assets/%: src/assets/%
	@mkdir -p $(@D)
	@cp $< $@

lib/%.js: src/%.js
	@mkdir -p $(@D)
	@$(BIN)/babel $< --out-file $@

clean:
	@rm -rf lib

lint:
	@$(BIN)/eslint src

watch:
	@rerun --dir src make -- --no-print-directory run

run: build
	@git init example
	@node lib/server.js example

release-major: build lint
	@$(BIN)/bump --major

release-minor: build lint
	@$(BIN)/bump --minor

release-patch: build lint
	@$(BIN)/bump --patch

publish:
	@npm publish
	@git push --tags origin HEAD:master
