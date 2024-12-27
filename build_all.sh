#!/usr/bin/env bash

## no +e 
set +x

DIRECTORIES="$(find src -maxdepth 1 -mindepth 1 -type d)"

for DIRECTORY in $DIRECTORIES; do
    npx tsc -p "$DIRECTORY"
done
