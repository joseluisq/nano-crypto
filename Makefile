build: | build_tsc build_cjs build_umd
.PHONY: build

build_tsc:
	@rm -rf .cache dist
	@tsc --outDir .cache --module es2015
.PHONY: build_tsc

build_cjs:
	@rm -rf .cache dist
	@env MODULE_FORMAT=cjs rollup -c
.PHONY: build_cjs

build_umd:
	@rm -rf .cache dist
	@env MODULE_FORMAT=umd rollup -c
.PHONY: build_umd
