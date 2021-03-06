KARMA=node_modules/.bin/karma
NPM_CHECK=node_modules/.bin/npm-check
PRETTIER=node_modules/.bin/prettier
STYLELINT=node_modules/.bin/stylelint
TSLINT=node_modules/.bin/tslint
WEBPACK=node_modules/.bin/webpack
WEBPACK_DEV_SERVER=node_modules/.bin/webpack-dev-server

.PHONY: build
build: node_modules
	$(WEBPACK) -p
	rm dist/styles.*.js

.PHONY: test
test: node_modules
	$(KARMA) start --single-run

.PHONY: watch
watch: node_modules
	$(WEBPACK_DEV_SERVER) -d --host 0.0.0.0

.PHONY: watch-test
watch-test: node_modules
	$(KARMA) start

.PHONY: clean
clean:
	rm --recursive --force dist junit

.PHONY: clean-deps
clean-deps:
	rm --recursive --force node_modules

.PHONY: format
format: node_modules
	$(STYLELINT) --fix src/**/*.scss
	$(TSLINT) --fix src/**/*.{ts,tsx}
	$(PRETTIER) --write "**/*.{js,json,md,scss,ts,tsx}"

.PHONY: upgrade
upgrade:
	$(NPM_CHECK) --update --save-exact

node_modules: package.json
	npm install
	touch $@
