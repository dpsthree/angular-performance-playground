#!/bin/bash

yarn global add rimraf copyfiles
yarn clean
pushd ./packages/client
yarn
yarn build
popd
yarn postbuild