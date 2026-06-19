-- Invite flow: workspace owners/admins must look up profiles by email for users
-- not yet in the workspace. RLS on profiles blocks that client-side SELECT.

CREATE OR REPLACE FUNCTION invite_member_by_email(
  p_workspace_id UUID,
  p_email TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_caller UUID := auth.uid();
BEGIN
  IF v_caller IS NULL THEN
    RAISE EXCEPTION 'Non autenticato';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM workspaces w
    WHERE w.id = p_workspace_id AND w.owner_id = v_caller
  ) AND NOT EXISTS (
    SELECT 1 FROM workspace_members wm
    WHERE wm.workspace_id = p_workspace_id
      AND wm.user_id = v_caller
      AND wm.role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Permesso negato';
  END IF;

  SELECT id INTO v_user_id
  FROM profiles
  WHERE lower(email) = lower(trim(p_email))
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Utente non trovato. Deve registrarsi prima.';
  END IF;

  IF EXISTS (
    SELECT 1 FROM workspace_members
    WHERE workspace_id = p_workspace_id AND user_id = v_user_id
  ) THEN
    RAISE EXCEPTION 'Utente già membro del workspace.';
  END IF;

  INSERT INTO workspace_members (workspace_id, user_id, role)
  VALUES (p_workspace_id, v_user_id, 'member');
END;
$$;

GRANT EXECUTE ON FUNCTION invite_member_by_email(UUID, TEXT) TO authenticated;
