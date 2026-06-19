'use client';

import { useEffect, useState } from 'react';
import { ScrollText, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlanGate } from '@/components/plan/plan-gate';
import { createClient } from '@/lib/supabase/client';
import { getAuditLog } from '@/lib/data';
import type { PlanTier, Profile } from '@/lib/database.types';

interface WorkspaceAuditPanelProps {
  workspaceId: string;
  plan: PlanTier;
}

const ACTION_LABELS: Record<string, string> = {
  'api_key.created': 'API key creata',
  'member.removed': 'Membro rimosso',
  'member.invited': 'Membro invitato',
  'board.created': 'Board creata',
  'task.moved': 'Task spostato',
};

export function WorkspaceAuditPanel({ workspaceId, plan }: WorkspaceAuditPanelProps) {
  const supabase = createClient();
  const [entries, setEntries] = useState<
    Array<{
      id: string;
      action: string;
      entity_type: string;
      created_at: string;
      actor: Profile | null;
    }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAuditLog(supabase, workspaceId)
      .then(setEntries)
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, [supabase, workspaceId]);

  return (
    <PlanGate feature="auditLog" plan={plan}>
      <Card className="border-border/60 bg-card/50 mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ScrollText className="h-4 w-4 text-primary" />
            Audit log
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          ) : entries.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nessun evento registrato ancora.
            </p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start justify-between gap-3 rounded-lg border border-border/60 px-3 py-2 text-sm"
                >
                  <div>
                    <p className="font-medium">
                      {ACTION_LABELS[entry.action] || entry.action}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {entry.actor?.full_name || entry.actor?.email || 'Sistema'} ·{' '}
                      {entry.entity_type}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {new Date(entry.created_at).toLocaleDateString('it-IT')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </PlanGate>
  );
}
