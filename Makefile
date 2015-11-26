BIN = ./node_modules/.bin

SRCJS = $(wildcard src/*.js) $(wildcard src/*/*.js) $(wildcard src/*/*/*.js)
LIBJS = $(SRCJS:src/%.js=lib/%.js)

SRCSASS = $(wildcard src/assets/scss/*.scss)
ENTRYSASS = src/assets/readings.scss

SRCASSETS = $(wildcard src/assets/static/*)
LIBASSETS = $(SRCASSETS:src/assets/static/%=lib/assets/static/%)

build: $(LIBJS) $(LIBASSETS) lib/assets/readings.css lib/assets/readings.js lib/assets/material.js

# Rebuilding breaks permissions if application is linked via npm-link
lib/server.js: src/server.js
	@mkdir -p lib/assets
	@$(BIN)/babel $< --out-file $@
	@chmod +x $@

# Compile all sass files into a single file for the client
lib/assets/readings.css: $(SRCSASS) $(ENTRYSASS)
	@mkdir -p $(@D)
	@$(BIN)/node-sass $(ENTRYSASS) $@

# Compile the assets into a single file for the client
lib/assets/readings.js: $(LIBJS)
	@mkdir -p lib/assets
	@$(BIN)/browserify lib/client.js --outfile $@

# Copy over the material.min.js file so the client can grab it
lib/assets/material.js: node_modules/material-design-lite/material.min.js
	@mkdir -p $(@D)
	@cp $< $@

# Copy over all static assets
lib/assets/static/%: src/assets/static/%
	@mkdir -p $(@D)
	@cp $< $@

# Run all js files through babel to compile into ES5 code
lib/%.js: src/%.js
	@mkdir -p $(@D)
	@$(BIN)/babel $< --out-file $@

# Cleanup
clean:
	@rm -rf lib
	@rm -rf example

# Lint all the source code
lint:
	@$(BIN)/eslint src

# Rebuild on change
watch:
	@rerun --dir src make -- --no-print-directory run

# Create an example directory and run inside of it
run: build
	@git init example
	@node lib/server.js example

# Bump the version in package.json and add a commit for it
release-major: build lint
	@npm version major

release-minor: build lint
	@npm version minor

release-patch: build lint
	@npm version patch

# Publish to git and npm
publish:
	@git push --tags origin HEAD:master
	@npm publish
