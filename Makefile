build: | build_clean build_tsc build_cjs build_umd build_finish
.PHONY: build

build_clean:
	@rm -rf .cache dist
.PHONY: build_clean

build_tsc:
	@tsc --outDir .cache --module es2015
.PHONY: build_tsc

build_cjs:
	@env MODULE_FORMAT=cjs MODULE_FILENAME=random rollup -c
	@env MODULE_FORMAT=cjs MODULE_FILENAME=crypto rollup -c
.PHONY: build_cjs

build_umd:
	@env MODULE_FORMAT=umd MODULE_FILENAME=random.browser rollup -c
	# @env MODULE_FORMAT=umd MODULE_FILENAME=crypto.browser rollup -c

	# build tsc commonjs only for index.ts file
	@tsc --sourceMap false --outDir .cache --module commonjs
.PHONY: build_umd

build_finish:
	# remove necessary files
	@rm -rf ./dist/nanoid
	@rm -rf ./dist/*.spec.d.ts
	@rm -rf ./dist/alphabets.d.ts

	# copy just the index by tsc
	@cp -rf .cache/index.js ./dist
	@cp -rf .cache/index.d.ts ./dist

	# copy necessary package files
	@cp -rf package.json ./dist
	@cp -rf README.md ./dist
	@cp -rf LICENSE.md ./dist
	@cp -rf .npmignore ./dist
.PHONY: build_finish
