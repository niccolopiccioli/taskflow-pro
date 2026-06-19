import type { MemberRole, WorkspaceWithMembers } from '@/lib/database.types';

export type WorkspaceAccessRole = 'owner' | 'admin' | 'member';

export function getWorkspaceAccessRole(
  workspace: WorkspaceWithMembers,
  userId: string
): WorkspaceAccessRole | null {
  if (workspace.owner_id === userId) return 'owner';
  const membership = workspace.members.find((m) => m.user_id === userId);
  if (!membership) return null;
  return membership.role;
}

export function isWorkspaceAdmin(workspace: WorkspaceWithMembers, userId: string): boolean {
  const role = getWorkspaceAccessRole(workspace, userId);
  return role === 'owner' || role === 'admin';
}

export function isWorkspaceOwner(workspace: WorkspaceWithMembers, userId: string): boolean {
  return workspace.owner_id === userId;
}

export function canInviteMembers(workspace: WorkspaceWithMembers, userId: string): boolean {
  return isWorkspaceAdmin(workspace, userId);
}

export function canManageMembers(workspace: WorkspaceWithMembers, userId: string): boolean {
  return isWorkspaceAdmin(workspace, userId);
}

export function canDeleteWorkspace(workspace: WorkspaceWithMembers, userId: string): boolean {
  return isWorkspaceOwner(workspace, userId);
}

export function canUpdateWorkspace(workspace: WorkspaceWithMembers, userId: string): boolean {
  return isWorkspaceAdmin(workspace, userId);
}

export function canDeleteBoard(workspace: WorkspaceWithMembers, userId: string): boolean {
  return isWorkspaceAdmin(workspace, userId);
}

export function canRemoveMember(
  workspace: WorkspaceWithMembers,
  actorId: string,
  targetUserId: string
): boolean {
  if (!canManageMembers(workspace, actorId)) return false;
  if (workspace.owner_id === targetUserId) return false;
  return true;
}

export function canChangeMemberRole(
  workspace: WorkspaceWithMembers,
  actorId: string,
  targetUserId: string
): boolean {
  if (!canManageMembers(workspace, actorId)) return false;
  if (workspace.owner_id === targetUserId) return false;
  return true;
}

export function canLeaveWorkspace(workspace: WorkspaceWithMembers, userId: string): boolean {
  return workspace.owner_id !== userId && workspace.members.some((m) => m.user_id === userId);
}

export function roleLabel(role: WorkspaceAccessRole | MemberRole, isOwner = false): string {
  if (isOwner) return 'Proprietario';
  const labels: Record<MemberRole, string> = {
    admin: 'Admin',
    member: 'Membro',
  };
  return labels[role as MemberRole] ?? role;
}
