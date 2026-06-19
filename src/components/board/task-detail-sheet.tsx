'use client';

import { useState, useEffect } from 'react';
import {
  Calendar,
  MessageSquare,
  Paperclip,
  Loader2,
  Send,
} from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { PlanGate } from '@/components/plan/plan-gate';
import type { PlanTier, TaskPriority, Profile } from '@/lib/database.types';
import type { BoardWithColumns } from '@/lib/database.types';
import { createClient } from '@/lib/supabase/client';
import { updateTask, addComment, uploadTaskAttachment } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

type TaskWithDetails = BoardWithColumns['columns'][0]['tasks'][0];

interface TaskDetailSheetProps {
  task: TaskWithDetails | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: PlanTier;
  onUpdated: () => void;
}

const priorityLabels: Record<TaskPriority, string> = {
  low: 'Bassa',
  medium: 'Media',
  high: 'Alta',
};

export function TaskDetailSheet({
  task,
  open,
  onOpenChange,
  plan,
  onUpdated,
}: TaskDetailSheetProps) {
  const supabase = createClient();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setDueDate(task.due_date ? task.due_date.slice(0, 10) : '');
      setPriority(task.priority);
    }
  }, [task]);

  if (!task) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateTask(supabase, task.id, {
        title,
        description,
        priority,
        due_date: dueDate ? new Date(dueDate).toISOString() : null,
      });
      onUpdated();
      toast({ title: 'Task aggiornato' });
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: e instanceof Error ? e.message : 'Salvataggio fallito',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    setSaving(true);
    try {
      await addComment(supabase, task.id, comment.trim());
      setComment('');
      onUpdated();
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: e instanceof Error ? e.message : 'Commento non inviato',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await uploadTaskAttachment(task.id, file);
      onUpdated();
      toast({ title: 'Allegato caricato' });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Upload fallito',
        description: err instanceof Error ? err.message : 'Errore',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto border-border/60">
        <SheetHeader>
          <SheetTitle>Dettaglio task</SheetTitle>
        </SheetHeader>

        <div className="space-y-5 mt-6">
          <div className="space-y-2">
            <Label htmlFor="task-title-edit">Titolo</Label>
            <Input id="task-title-edit" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <PlanGate feature="taskDueDates" plan={plan}>
            <div className="space-y-2">
              <Label htmlFor="task-due" className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" /> Scadenza
              </Label>
              <Input
                id="task-due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </PlanGate>

          <div className="space-y-2">
            <Label>Priorità</Label>
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as TaskPriority[]).map((p) => (
                <Button
                  key={p}
                  type="button"
                  size="sm"
                  variant={priority === p ? 'default' : 'outline'}
                  onClick={() => setPriority(p)}
                >
                  {priorityLabels[p]}
                </Button>
              ))}
            </div>
          </div>

          <PlanGate feature="taskComments" plan={plan}>
            <div className="space-y-2">
              <Label htmlFor="task-desc">Descrizione</Label>
              <Textarea
                id="task-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Aggiungi dettagli..."
              />
            </div>
          </PlanGate>

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Salva modifiche'}
          </Button>

          <PlanGate feature="taskComments" plan={plan}>
            <div className="space-y-3 pt-2 border-t border-border/60">
              <Label className="flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5" /> Commenti
              </Label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {(task.comments || []).map((c) => (
                  <div key={c.id} className="rounded-lg bg-muted/40 p-2.5 text-sm">
                    <p className="font-medium text-xs text-muted-foreground mb-1">
                      {(c as { profile?: Profile }).profile?.full_name || 'Utente'}
                    </p>
                    <p>{c.content}</p>
                  </div>
                ))}
                {!task.comments?.length && (
                  <p className="text-xs text-muted-foreground">Nessun commento ancora.</p>
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Scrivi un commento..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleComment()}
                />
                <Button size="icon" onClick={handleComment} disabled={saving}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </PlanGate>

          <PlanGate feature="taskAttachments" plan={plan}>
            <div className="space-y-3 pt-2 border-t border-border/60">
              <Label className="flex items-center gap-1.5">
                <Paperclip className="h-3.5 w-3.5" /> Allegati
              </Label>
              {(task.attachments || []).map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2 text-sm"
                >
                  <span className="truncate">{a.file_name}</span>
                  <Badge variant="secondary" className="text-xs shrink-0 ml-2">
                    {Math.round(a.file_size / 1024)} KB
                  </Badge>
                </div>
              ))}
              <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-primary/30 bg-primary/5 py-4 text-sm text-primary hover:bg-primary/10 transition-colors">
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Paperclip className="h-4 w-4 mr-2" />
                    Carica file
                  </>
                )}
                <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
              </label>
            </div>
          </PlanGate>
        </div>
      </SheetContent>
    </Sheet>
  );
}
