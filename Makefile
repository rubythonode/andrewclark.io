BIN = node_modules/.bin

MOCHA_ARGS= \
		--compilers js:babel/register \
		--require testInit.js
MOCHA_TARGET=app/**/*-test.js

build: clean
	NODE_ENV=production \
	$(MAKE) -j2 build-server build-client

watch:
	NODE_ENV=development \
	BUNDLE_PATH=http://localhost:3001/static/bundle.js \
	$(MAKE) -j2 watch-server dev-server

clean:
	rm -rf build

test:
	NODE_ENV=test $(BIN)/mocha $(MOCHA_ARGS) $(MOCHA_TARGET)

test-watch:
	NODE_ENV=test $(BIN)/mocha $(MOCHA_ARGS) -w $(MOCHA_TARGET)

build-server: build/normalize.css
	NODE_ENV=production $(BIN)/babel-node scripts/buildServer.js

watch-server: build/normalize.css
	NODE_ENV=development $(BIN)/babel-node scripts/buildServer.js --watch=true

dev-server:
	$(BIN)/babel-node app/devServer.js

build-client:
	NODE_ENV=production $(BIN)/babel-node scripts/buildClient.js

build/normalize.css: node_modules/normalize.css/normalize.css
	mkdir -p $(@D) && cp $< $@

MIGRATION_DIR = app/data
MIGRATION_OPTS = --chdir $(MIGRATION_DIR)

migrate:
	$(BIN)/babel-node scripts/migrate.js

migrate-create:
	$(BIN)/migrate $(MIGRATION_OPTS) create

.PHONY: build watch clean test test-watch build-server watch-server dev-server \
	build-client migrate migrate-create
