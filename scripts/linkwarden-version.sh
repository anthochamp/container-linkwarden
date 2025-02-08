#!/usr/bin/env sh
set -eu

dockerDir=$1
imageName=${2:-$(mktemp -u tmp-XXXX | awk '{ print tolower($0) }')}

cleanup() {
	set +e

	docker --context default image rm -f "$imageName" 1>/dev/null
}

trap 'cleanup' EXIT INT TERM

docker --context default build -qt "$imageName" "$dockerDir" 1>/dev/null

docker --context default run --rm -i "$imageName" cat package.json | jq -r .version | cut -b2-
