-- Workspace member management: remove, change role, leave

CREATE OR REPLACE FUNCTION is_workspace_admin(ws_id UUID, u_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM workspaces w WHERE w.id = ws_id AND w.owner_id = u_id
  ) OR EXISTS (
    SELECT 1 FROM workspace_members wm
    WHERE wm.workspace_id = ws_id AND wm.user_id = u_id AND wm.role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION remove_workspace_member(
  p_workspace_id UUID,
  p_user_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller UUID := auth.uid();
  v_owner_id UUID;
  v_target_role member_role;
BEGIN
  IF v_caller IS NULL THEN
    RAISE EXCEPTION 'Non autenticato';
  END IF;

  SELECT owner_id INTO v_owner_id
  FROM workspaces
  WHERE id = p_workspace_id;

  IF v_owner_id IS NULL THEN
    RAISE EXCEPTION 'Workspace non trovato';
  END IF;

  IF p_user_id = v_owner_id THEN
    RAISE EXCEPTION 'Impossibile rimuovere il proprietario del workspace';
  END IF;

  IF NOT is_workspace_admin(p_workspace_id, v_caller) THEN
    RAISE EXCEPTION 'Permesso negato';
  END IF;

  SELECT role INTO v_target_role
  FROM workspace_members
  WHERE workspace_id = p_workspace_id AND user_id = p_user_id;

  IF v_target_role IS NULL THEN
    RAISE EXCEPTION 'Membro non trovato';
  END IF;

  IF v_target_role = 'admin' THEN
    IF (
      SELECT COUNT(*) FROM workspace_members
      WHERE workspace_id = p_workspace_id AND role = 'admin'
    ) <= 1 THEN
      RAISE EXCEPTION 'Deve restare almeno un admin nel workspace';
    END IF;
  END IF;

  DELETE FROM workspace_members
  WHERE workspace_id = p_workspace_id AND user_id = p_user_id;
END;
$$;

CREATE OR REPLACE FUNCTION update_workspace_member_role(
  p_workspace_id UUID,
  p_user_id UUID,
  p_role member_role
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller UUID := auth.uid();
  v_owner_id UUID;
  v_current_role member_role;
BEGIN
  IF v_caller IS NULL THEN
    RAISE EXCEPTION 'Non autenticato';
  END IF;

  SELECT owner_id INTO v_owner_id
  FROM workspaces
  WHERE id = p_workspace_id;

  IF v_owner_id IS NULL THEN
    RAISE EXCEPTION 'Workspace non trovato';
  END IF;

  IF p_user_id = v_owner_id THEN
    RAISE EXCEPTION 'Impossibile modificare il ruolo del proprietario';
  END IF;

  IF NOT is_workspace_admin(p_workspace_id, v_caller) THEN
    RAISE EXCEPTION 'Permesso negato';
  END IF;

  SELECT role INTO v_current_role
  FROM workspace_members
  WHERE workspace_id = p_workspace_id AND user_id = p_user_id;

  IF v_current_role IS NULL THEN
    RAISE EXCEPTION 'Membro non trovato';
  END IF;

  IF v_current_role = 'admin' AND p_role = 'member' THEN
    IF (
      SELECT COUNT(*) FROM workspace_members
      WHERE workspace_id = p_workspace_id AND role = 'admin'
    ) <= 1 THEN
      RAISE EXCEPTION 'Deve restare almeno un admin nel workspace';
    END IF;
  END IF;

  UPDATE workspace_members
  SET role = p_role
  WHERE workspace_id = p_workspace_id AND user_id = p_user_id;
END;
$$;

CREATE OR REPLACE FUNCTION leave_workspace(p_workspace_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller UUID := auth.uid();
  v_owner_id UUID;
  v_role member_role;
BEGIN
  IF v_caller IS NULL THEN
    RAISE EXCEPTION 'Non autenticato';
  END IF;

  SELECT owner_id INTO v_owner_id
  FROM workspaces
  WHERE id = p_workspace_id;

  IF v_owner_id IS NULL THEN
    RAISE EXCEPTION 'Workspace non trovato';
  END IF;

  IF v_caller = v_owner_id THEN
    RAISE EXCEPTION 'Il proprietario non può uscire dal workspace. Trasferisci la proprietà o elimina il workspace.';
  END IF;

  SELECT role INTO v_role
  FROM workspace_members
  WHERE workspace_id = p_workspace_id AND user_id = v_caller;

  IF v_role IS NULL THEN
    RAISE EXCEPTION 'Non sei membro di questo workspace';
  END IF;

  IF v_role = 'admin' THEN
    IF (
      SELECT COUNT(*) FROM workspace_members
      WHERE workspace_id = p_workspace_id AND role = 'admin'
    ) <= 1 THEN
      RAISE EXCEPTION 'Deve restare almeno un admin. Promuovi un altro membro prima di uscire.';
    END IF;
  END IF;

  DELETE FROM workspace_members
  WHERE workspace_id = p_workspace_id AND user_id = v_caller;
END;
$$;

CREATE OR REPLACE FUNCTION delete_workspace(p_workspace_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller UUID := auth.uid();
BEGIN
  IF v_caller IS NULL THEN
    RAISE EXCEPTION 'Non autenticato';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM workspaces
    WHERE id = p_workspace_id AND owner_id = v_caller
  ) THEN
    RAISE EXCEPTION 'Solo il proprietario può eliminare il workspace';
  END IF;

  DELETE FROM workspaces WHERE id = p_workspace_id;
END;
$$;

GRANT EXECUTE ON FUNCTION is_workspace_admin(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION remove_workspace_member(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION update_workspace_member_role(UUID, UUID, member_role) TO authenticated;
GRANT EXECUTE ON FUNCTION leave_workspace(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION delete_workspace(UUID) TO authenticated;
