#!/bin/sh
set -e

VERSION=${1:?Version Required}

cd deb
./build.sh
cd ../
cd rpm
./build.sh
cd ../

mv deb/p3u_${VERSION}_x86_64.deb ../package/artifacts/P3U_linux_${VERSION}_x86_64.deb
mv rpm/p3u-${VERSION}-1.x86_64.rpm ../package/artifacts/P3U_linux_${VERSION}_x86_64.rpm
