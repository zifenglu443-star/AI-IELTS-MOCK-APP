#!/bin/sh
set -eu

target_dir="${1:-/home/austin/backups/ieltsmock}"
stamp="$(date -u +%Y%m%dT%H%M%SZ)"
compose="/home/austin/services/ieltsmock/current/deploy/ieltsmock/compose.austin.yaml"
env_file="/home/austin/services/ieltsmock/.env"
mkdir -p "$target_dir/daily" "$target_dir/weekly"

docker compose -p ieltsmock --env-file "$env_file" -f "$compose" exec -T postgres \
  pg_dump -U ieltsmock -d ieltsmock -Fc > "$target_dir/daily/database-$stamp.dump"
docker run --rm -v ieltsmock_user_files:/source:ro -v "$target_dir/daily:/backup" alpine:3.20 \
  tar -czf "/backup/files-$stamp.tar.gz" -C /source .

find "$target_dir/daily" -type f -mtime +7 -delete
if [ "$(date -u +%u)" = "7" ]; then
  cp "$target_dir/daily/database-$stamp.dump" "$target_dir/weekly/"
  cp "$target_dir/daily/files-$stamp.tar.gz" "$target_dir/weekly/"
fi
find "$target_dir/weekly" -type f -mtime +28 -delete
