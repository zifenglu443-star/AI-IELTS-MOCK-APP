# Austin deployment

The production service uses immutable release directories under
`/home/austin/services/ieltsmock/releases/<git-commit>`. The `current` symlink is
switched only after the new containers pass the internal health check. Public
HTTPS terminates on the Alibaba Caddy relay and forwards through Tailscale to
`100.97.86.42:8089`.

Required secrets live only in `/home/austin/services/ieltsmock/.env` on Austin.
Generate independent random values for the database password, encryption master
key, and initial administrator password. Never add this file to Git.

```sh
cd /home/austin/services/ieltsmock/repository
./deploy/ieltsmock/release.sh origin/main
```

The bootstrap administrator is created only while the user table is empty.
After the first successful login, change the temporary password. Removing the
bootstrap password from the server environment after that is safe.

Install `backup.sh` in Austin's crontab for a daily run. It creates a PostgreSQL
custom-format dump plus an attachment-volume archive, retains seven daily copies
and four weekly copies, and can export to another target directory passed as its
first argument. These local backups do not protect against loss of the whole
Austin machine, so copy periodic snapshots to separate storage.

Restore into a maintenance instance first: use `pg_restore --clean --if-exists`
for the database dump and extract the matching file archive into the
`ieltsmock_user_files` volume. Verify `/api/health`, login, a protected file, and
an existing result before directing production traffic to it.

For rollback, invoke `release.sh <previous-commit>`. Database migrations are
forward-only: application rollback never runs a destructive down migration, and
the previous application must remain compatible with already-applied columns.
