#!/usr/bin/make -f

PATH := $(CURDIR)/deps/node/bin/:$(PATH)

all: deps/node/bin/node
	yarn build
	rm -rf dist/img dist/js/*.map

deps/node/bin/node:
	mkdir -p deps/node
	wget https://nodejs.org/dist/v12.14.1/node-v12.14.1-linux-x64.tar.xz
	tar -xvf node-v12.14.1-linux-x64.tar.xz -C deps/node --strip-components=1
	rm -f node-v12.14.1-linux-x64.tar.xz
	npm install --global yarn
	yarn install

distclean: clean
	rm -rf deps/

clean:
	rm -rf dist/
	rm -f package-lock.json 

.PHONY: clean distclean
