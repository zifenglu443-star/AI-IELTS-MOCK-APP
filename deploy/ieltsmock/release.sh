#!/bin/sh
set -eu

ref="${1:-origin/main}"
service_root="${IELTSMOCK_SERVICE_ROOT:-/home/austin/services/ieltsmock}"
repository="$service_root/repository"
releases="$service_root/releases"
shared_env="$service_root/.env"

test -d "$repository/.git"
test -f "$shared_env"
git -C "$repository" fetch --prune origin main
commit="$(git -C "$repository" rev-parse "$ref^{commit}")"
release="$releases/$commit"

mkdir -p "$releases"
if [ ! -d "$release" ]; then
  temporary="$(mktemp -d "$releases/.${commit}.XXXXXX")"
  git -C "$repository" archive "$commit" | tar -x -C "$temporary"
  mv "$temporary" "$release"
fi

compose="$release/deploy/ieltsmock/compose.austin.yaml"
export APP_VERSION="$commit"
docker compose -p ieltsmock --env-file "$shared_env" -f "$compose" build
docker compose -p ieltsmock --env-file "$shared_env" -f "$compose" up -d --remove-orphans

attempt=0
until curl -fsS "http://100.97.86.42:8089/api/health" | grep -q "\"version\":\"$commit\""; do
  attempt=$((attempt + 1))
  if [ "$attempt" -ge 30 ]; then
    docker compose -p ieltsmock --env-file "$shared_env" -f "$compose" ps
    exit 1
  fi
  sleep 2
done

ln -sfn "$release" "$service_root/current.next"
mv -Tf "$service_root/current.next" "$service_root/current"
printf '%s\n' "$commit"
