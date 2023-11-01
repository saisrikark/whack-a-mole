.PHONY: install 
install:
	@npm install

.PHONY: build
build:
	@npm run tauri build

.PHONY: run
run:
	@npm run tauri dev
