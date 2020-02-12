build: | build_clean build_tsc build_cjs build_umd build_finish
.PHONY: build

build_clean:
	@rm -rf .cache dist
.PHONY: build_clean

build_finish:
	@rm -rf ./dist/*.spec.d.ts
	@rm -rf ./dist/nanoid
	@rm -rf ./dist/alphabets.d.ts
.PHONY: build_finish

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
.PHONY: build_umd
