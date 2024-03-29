#!/bin/sh
set -e

podman build -t p3u_rh_build:latest --build-arg NODE_VERSION=$(node --version) .

rm -rf build_root
mkdir -p build_root/package
cp package_rpm.js build_root
cp -r '../../package/PlayStation 3 Updater-linux-x64' build_root/package

podman run --rm --user root -v $(readlink -f build_root):/build_root:z p3u_rh_build:latest

cp build_root/package/artifacts/*.rpm .
rm -rf build_root
