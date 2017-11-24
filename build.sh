#!/bin/bash

yarn
npm run clean
npm run bootstrap
pushd ./packages/client
npm run build
popd
pushd ./packages/server
node strip-package.js
popd
npm run postbuild