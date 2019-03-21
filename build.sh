#!/bin/bash

npm i -g add copyfiles
rm -rf packages/client/node_modules
rm -rf packages/client/dist
rm -rf www
pushd ./packages/client
npm i
npm run build
popd
npm run postbuild