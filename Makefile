KARMA=node_modules/.bin/karma
NCU=node_modules/.bin/ncu
PRETTIER=node_modules/.bin/prettier
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

.PHONY: prettier
prettier: node_modules
	$(PRETTIER) --write "**/*.{js,json,md,ts,tsx}"

.PHONY: upgrade
upgrade:
	# Waiting on:
	# - inferno-mobx to use latest mobx
	# - stylelint-webpack-plugin to use latest stylelint
	$(NCU) --upgrade --reject mobx,stylelint,stylelint-config-sass-guidelines

node_modules: package.json
	npm install
	touch $@
