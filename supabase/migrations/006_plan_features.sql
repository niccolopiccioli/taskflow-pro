-- Plan features: due dates, workspace settings, attachments, audit, API keys, guest links

ALTER TABLE tasks ADD COLUMN IF NOT EXISTS due_date TIMESTAMPTZ;

ALTER TABLE workspaces ADD COLUMN IF NOT EXISTS is_private BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE workspaces ADD COLUMN IF NOT EXISTS accent_color TEXT;

CREATE TABLE IF NOT EXISTS task_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES profiles(id),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key_prefix TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS board_guest_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  created_by UUID NOT NULL REFERENCES profiles(id),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_task_attachments_task ON task_attachments(task_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_workspace ON audit_log(workspace_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_api_keys_user ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_guest_links_token ON board_guest_links(token);

ALTER TABLE task_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_guest_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view task attachments" ON task_attachments
  FOR SELECT USING (is_workspace_member(task_workspace_id(task_id)));

CREATE POLICY "Members can upload attachments" ON task_attachments
  FOR INSERT WITH CHECK (
    auth.uid() = uploaded_by AND is_workspace_member(task_workspace_id(task_id))
  );

CREATE POLICY "Uploaders can delete attachments" ON task_attachments
  FOR DELETE USING (auth.uid() = uploaded_by);

CREATE POLICY "Members can view audit log" ON audit_log
  FOR SELECT USING (is_workspace_member(workspace_id));

CREATE POLICY "Users can view own api keys" ON api_keys
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create api keys" ON api_keys
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own api keys" ON api_keys
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Board members can manage guest links" ON board_guest_links
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM boards b
      WHERE b.id = board_guest_links.board_id
        AND is_workspace_member(b.workspace_id)
    )
  );

CREATE OR REPLACE FUNCTION log_audit_event(
  p_workspace_id UUID,
  p_action TEXT,
  p_entity_type TEXT,
  p_entity_id UUID DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
  v_actor UUID := auth.uid();
BEGIN
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'Non autenticato';
  END IF;

  IF NOT is_workspace_member(p_workspace_id) THEN
    RAISE EXCEPTION 'Permesso negato';
  END IF;

  INSERT INTO audit_log (workspace_id, actor_id, action, entity_type, entity_id, metadata)
  VALUES (p_workspace_id, v_actor, p_action, p_entity_type, p_entity_id, p_metadata)
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION validate_api_key(p_key_hash TEXT)
RETURNS TABLE(user_id UUID, workspace_id UUID)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  UPDATE api_keys ak
  SET last_used_at = NOW()
  WHERE ak.key_hash = p_key_hash
  RETURNING ak.user_id, ak.workspace_id;
END;
$$;

GRANT EXECUTE ON FUNCTION log_audit_event(UUID, TEXT, TEXT, UUID, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION validate_api_key(TEXT) TO authenticated;

INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('task-attachments', 'task-attachments', false, 104857600)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Members can read attachments" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'task-attachments'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Members can upload attachments" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'task-attachments'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Uploaders can delete attachments" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'task-attachments'
    AND auth.role() = 'authenticated'
  );
