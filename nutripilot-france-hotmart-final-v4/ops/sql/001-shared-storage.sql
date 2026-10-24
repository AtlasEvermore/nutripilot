CREATE TABLE IF NOT EXISTS np_schema (module text PRIMARY KEY, version integer NOT NULL);
CREATE TABLE IF NOT EXISTS np_documents (
  kind text NOT NULL, key text NOT NULL, value jsonb NOT NULL CHECK (jsonb_typeof(value) = 'object'),
  updated_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY (kind,key)
);
CREATE INDEX IF NOT EXISTS np_store_accounts ON np_documents USING gin ((value->'storeAccounts')) WHERE kind='entitlement';
CREATE TABLE IF NOT EXISTS np_rate_limits (
  key text PRIMARY KEY, count integer NOT NULL CHECK(count>=0), reset_at bigint NOT NULL
);
CREATE INDEX IF NOT EXISTS np_rate_expiry ON np_rate_limits(reset_at);
INSERT INTO np_schema(module,version) VALUES('core',1) ON CONFLICT(module) DO NOTHING;
