CREATE TABLE IF NOT EXISTS schema_migrations (
  name text PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
  id text PRIMARY KEY,
  username text NOT NULL,
  username_normalized text NOT NULL UNIQUE,
  display_name text NOT NULL DEFAULT '',
  password_hash text NOT NULL,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  disabled boolean NOT NULL DEFAULT false,
  must_change_password boolean NOT NULL DEFAULT true,
  quota_bytes bigint NOT NULL DEFAULT 2147483648,
  used_bytes bigint NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sessions (
  id text PRIMARY KEY,
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  csrf_token text NOT NULL,
  user_agent text NOT NULL DEFAULT '',
  ip_address text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  absolute_expires_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id);

CREATE TABLE IF NOT EXISTS library_entries (
  id text PRIMARY KEY,
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  version integer NOT NULL DEFAULT 1,
  title text NOT NULL DEFAULT '',
  test_type text NOT NULL DEFAULT '',
  source text NOT NULL DEFAULT '',
  test_json jsonb NOT NULL,
  generated_assets jsonb NOT NULL DEFAULT '[]'::jsonb,
  imported_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, id)
);
CREATE INDEX IF NOT EXISTS library_entries_user_id_idx ON library_entries(user_id, updated_at DESC);

CREATE TABLE IF NOT EXISTS attempts (
  id text PRIMARY KEY,
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  library_entry_id text,
  test_snapshot jsonb NOT NULL,
  mode text NOT NULL CHECK (mode IN ('mock', 'practice')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'submitted', 'expired', 'abandoned')),
  version integer NOT NULL DEFAULT 1,
  idempotency_key text NOT NULL,
  lease_token_hash text,
  lease_expires_at timestamptz,
  started_at timestamptz NOT NULL DEFAULT now(),
  deadline_at timestamptz,
  paused_at timestamptz,
  remaining_seconds integer,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  review_ids jsonb NOT NULL DEFAULT '[]'::jsonb,
  current_question_id text,
  current_section_index integer NOT NULL DEFAULT 0,
  audio_state jsonb NOT NULL DEFAULT '{}'::jsonb,
  full_mock_state jsonb NOT NULL DEFAULT '{}'::jsonb,
  result_json jsonb,
  submitted_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, idempotency_key)
);
CREATE INDEX IF NOT EXISTS attempts_user_status_idx ON attempts(user_id, status, updated_at DESC);

CREATE TABLE IF NOT EXISTS stored_files (
  id text PRIMARY KEY,
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  attempt_id text REFERENCES attempts(id) ON DELETE SET NULL,
  library_entry_id text,
  purpose text NOT NULL,
  original_name text NOT NULL,
  mime_type text NOT NULL DEFAULT 'application/octet-stream',
  size_bytes bigint NOT NULL DEFAULT 0,
  storage_path text NOT NULL,
  complete boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS stored_files_user_idx ON stored_files(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS upload_sessions (
  id text PRIMARY KEY,
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file_id text NOT NULL REFERENCES stored_files(id) ON DELETE CASCADE,
  total_chunks integer NOT NULL,
  received_chunks jsonb NOT NULL DEFAULT '[]'::jsonb,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS model_settings (
  user_id text PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  settings_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  encrypted_secrets text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ai_jobs (
  id text PRIMARY KEY,
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  feature text NOT NULL,
  stage text NOT NULL DEFAULT 'queued',
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'succeeded', 'failed', 'cancelled')),
  input_hash text,
  request_meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  result_json jsonb,
  error_code text,
  error_message text,
  retry_count integer NOT NULL DEFAULT 0,
  cancel_requested boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);
CREATE INDEX IF NOT EXISTS ai_jobs_user_idx ON ai_jobs(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS review_records (
  id text PRIMARY KEY,
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  attempt_id text REFERENCES attempts(id) ON DELETE CASCADE,
  question_id text,
  kind text NOT NULL,
  data_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_documents (
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  document_key text NOT NULL,
  version integer NOT NULL DEFAULT 1,
  data_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, document_key)
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id bigserial PRIMARY KEY,
  actor_user_id text REFERENCES users(id) ON DELETE SET NULL,
  action text NOT NULL,
  target_user_id text REFERENCES users(id) ON DELETE SET NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  ip_address text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS migration_receipts (
  id text PRIMARY KEY,
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  migration_key text NOT NULL,
  result_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, migration_key)
);
