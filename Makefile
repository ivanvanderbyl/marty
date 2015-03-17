BIN = ./node_modules/.bin

.PHONY: bootstrap bootstrap-js bootstrap-ruby start test docs release-docs;

SRC = $(shell find ./lib ./index.js ./test -type f -name '*.js')

test: lint
	@./build/test.sh

test-watch: lint
	@./build/test-watch.sh

bootstrap: bootstrap-js bootstrap-ruby

bootstrap-js: package.json
	@npm install

bootstrap-ruby: docs/Gemfile
	@which bundle > /dev/null || gem install bundler
	@cd docs && bundle install

lint: bootstrap-js
	@$(BIN)/jsxcs $(SRC);
	@$(BIN)/jsxhint $(SRC);

release: test
	@inc=$(inc) sh ./build/release.sh

build: lint
	@mkdir -p dist
	@$(BIN)/browserify --require ./index.js  --standalone Marty > dist/marty.js
	@cat dist/marty.js | $(BIN)/uglifyjs > dist/marty.min.js
	@gzip dist/marty.min.js -c > dist/marty.min.js.gz

docs:
	@cd docs && bundle exec jekyll serve -w

release-docs: bootstrap-ruby
	@sh ./build/release-docs.sh

prerelease-docs:
	@sh ./build/prerelease-docs.sh
