'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, GripVertical, Loader2, Lock, Link2, Pencil } from 'lucide-react';
import Link from 'next/link';
import { Brand } from '@/components/layout/brand';
import { TaskDetailSheet } from '@/components/board/task-detail-sheet';
import { createClient } from '@/lib/supabase/client';
import {
  getBoardWithColumns,
  createTask,
  moveTask,
  getProfile,
  createColumn,
  updateColumnName,
  createGuestLink,
} from '@/lib/data';
import type { BoardWithColumns, TaskPriority, Profile } from '@/lib/database.types';
import { canUseCustomColumns, hasFeature } from '@/lib/plans';
import { useToast } from '@/hooks/use-toast';

const priorityColors: Record<TaskPriority, string> = {
  low: 'bg-emerald-500',
  medium: 'bg-amber-500',
  high: 'bg-red-500',
};

const priorityLabels: Record<TaskPriority, string> = {
  low: 'Bassa',
  medium: 'Media',
  high: 'Alta',
};

type TaskItem = BoardWithColumns['columns'][0]['tasks'][0];

export default function KanbanBoardPage() {
  const params = useParams();
  const boardId = params.boardId as string;
  const supabase = createClient();
  const { toast } = useToast();

  const [board, setBoard] = useState<BoardWithColumns | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [draggedTask, setDraggedTask] = useState<{ taskId: string; columnId: string } | null>(null);
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [newTaskColumnId, setNewTaskColumnId] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [taskSheetOpen, setTaskSheetOpen] = useState(false);
  const [newColumnOpen, setNewColumnOpen] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');
  const [editingColumn, setEditingColumn] = useState<{ id: string; name: string } | null>(null);

  const loadBoard = useCallback(async () => {
    const [data, userProfile] = await Promise.all([
      getBoardWithColumns(supabase, boardId),
      getProfile(supabase),
    ]);
    setBoard(data);
    setProfile(userProfile);
    setIsLoading(false);
  }, [supabase, boardId]);

  useEffect(() => {
    loadBoard();
  }, [loadBoard]);

  const plan = profile?.plan || 'free';

  const handleDragStart = (taskId: string, columnId: string) => {
    setDraggedTask({ taskId, columnId });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (targetColumnId: string) => {
    if (!draggedTask || draggedTask.columnId === targetColumnId) {
      setDraggedTask(null);
      return;
    }

    await moveTask(supabase, draggedTask.taskId, targetColumnId);
    setDraggedTask(null);
    await loadBoard();
  };

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim() || !newTaskColumnId) return;
    setIsSubmitting(true);
    try {
      await createTask(supabase, newTaskColumnId, newTaskTitle);
      setNewTaskOpen(false);
      setNewTaskTitle('');
      await loadBoard();
    } finally {
      setIsSubmitting(false);
    }
  };

  const openNewTask = (columnId: string) => {
    setNewTaskColumnId(columnId);
    setNewTaskOpen(true);
  };

  const openTask = (task: TaskItem) => {
    setSelectedTask(task);
    setTaskSheetOpen(true);
  };

  const handleAddColumn = async () => {
    if (!newColumnName.trim() || !board) return;
    if (!canUseCustomColumns(plan)) {
      toast({
        variant: 'destructive',
        title: 'Funzione Pro',
        description: 'Le colonne personalizzate richiedono Pro o Business.',
      });
      return;
    }
    setIsSubmitting(true);
    try {
      await createColumn(supabase, board.id, newColumnName.trim());
      setNewColumnOpen(false);
      setNewColumnName('');
      await loadBoard();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRenameColumn = async () => {
    if (!editingColumn?.name.trim()) return;
    setIsSubmitting(true);
    try {
      await updateColumnName(supabase, editingColumn.id, editingColumn.name.trim());
      setEditingColumn(null);
      await loadBoard();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestLink = async () => {
    try {
      const { url } = await createGuestLink(boardId);
      await navigator.clipboard.writeText(url);
      toast({ title: 'Link copiato', description: 'Guest link negli appunti.' });
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: e instanceof Error ? e.message : 'Impossibile creare link',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!board) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Board non trovata.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border/60 bg-card/50 backdrop-blur-2xl flex-shrink-0 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 sm:h-16 items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <Brand href="/dashboard" size="sm" className="hidden sm:flex shrink-0" />
              <Link href="/dashboard" className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors shrink-0">
                Dashboard
              </Link>
              <span className="text-muted-foreground shrink-0">/</span>
              <span className="font-medium font-display text-sm sm:text-base truncate">{board.name}</span>
            </div>
            <div className="flex items-center gap-2">
              {hasFeature(plan, 'guestLinks') && (
                <Button size="sm" variant="outline" className="gap-1.5" onClick={handleGuestLink}>
                  <Link2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Guest link</span>
                </Button>
              )}
              {canUseCustomColumns(plan) && (
                <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setNewColumnOpen(true)}>
                  <Plus className="h-3.5 w-3.5" />
                  Colonna
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-x-auto overscroll-x-contain">
        <div className="h-full p-4 sm:p-6">
          <div className="flex gap-4 sm:gap-6 h-full min-w-max pb-4">
            {board.columns.map((column) => (
              <div
                key={column.id}
                className="w-[min(85vw,20rem)] sm:w-72 md:w-80 flex flex-col flex-shrink-0"
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(column.id)}
              >
                <div className="flex items-center justify-between mb-4 px-1 sticky top-0 bg-background/80 backdrop-blur py-2 rounded-lg">
                  <div className="flex items-center gap-2 min-w-0">
                    <h3 className="font-semibold truncate">{column.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {column.tasks.length}
                    </Badge>
                    {canUseCustomColumns(plan) && (
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-primary"
                        onClick={() => setEditingColumn({ id: column.id, name: column.name })}
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                    )}
                    {!canUseCustomColumns(plan) && (
                      <span title="Colonne fisse su piano Free">
                        <Lock className="h-3 w-3 text-muted-foreground/50" />
                      </span>
                    )}
                  </div>
                </div>

                <ScrollArea className="flex-1">
                  <div className="space-y-3 pr-2">
                    <AnimatePresence>
                      {column.tasks.map((task, index) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2, delay: index * 0.03 }}
                          draggable
                          onDragStart={() => handleDragStart(task.id, column.id)}
                          onClick={() => openTask(task)}
                          className={`
                            bg-card/80 border border-border/60 rounded-xl p-4 cursor-pointer
                            hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all
                            ${draggedTask?.taskId === task.id ? 'opacity-50' : ''}
                          `}
                        >
                          <div className="flex items-start gap-2">
                            <GripVertical
                              className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0 cursor-grab"
                              onMouseDown={(e) => e.stopPropagation()}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`w-2 h-2 rounded-full ${priorityColors[task.priority]}`} />
                                <span className="text-xs text-muted-foreground">{priorityLabels[task.priority]}</span>
                                {task.due_date && hasFeature(plan, 'taskDueDates') && (
                                  <span className="text-[10px] text-amber-400">
                                    {new Date(task.due_date).toLocaleDateString('it-IT')}
                                  </span>
                                )}
                              </div>
                              <p className="font-medium text-sm mb-3">{task.title}</p>
                              {task.assignee && (
                                <div className="flex items-center gap-2">
                                  <Avatar className="w-6 h-6">
                                    <AvatarFallback className="text-xs bg-primary/20 text-primary">
                                      {task.assignee.full_name?.slice(0, 2).toUpperCase() || 'U'}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs text-muted-foreground">{task.assignee.full_name}</span>
                                </div>
                              )}
                              {(task.comments?.length || 0) > 0 && hasFeature(plan, 'taskComments') && (
                                <Badge variant="outline" className="mt-2 text-[10px]">
                                  {task.comments!.length} commenti
                                </Badge>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </ScrollArea>

                <Button
                  variant="ghost"
                  className="mt-3 justify-start text-muted-foreground hover:text-primary"
                  onClick={() => openNewTask(column.id)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Aggiungi task
                </Button>
              </div>
            ))}
          </div>
        </div>
      </main>

      {hasFeature(plan, 'boardBranding') && (
        <footer className="border-t border-border/40 py-2 text-center text-xs text-muted-foreground">
          Powered by <Link href="/" className="text-primary hover:underline">TaskFlow Pro</Link>
        </footer>
      )}

      <TaskDetailSheet
        task={selectedTask}
        open={taskSheetOpen}
        onOpenChange={setTaskSheetOpen}
        plan={plan}
        onUpdated={loadBoard}
      />

      <Dialog open={newTaskOpen} onOpenChange={setNewTaskOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-md">
          <DialogHeader>
            <DialogTitle>Nuovo task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="task-title">Titolo</Label>
              <Input
                id="task-title"
                placeholder="Descrivi il task..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewTaskOpen(false)}>Annulla</Button>
            <Button
              onClick={handleCreateTask}
              disabled={isSubmitting || !newTaskTitle.trim()}
              className="bg-primary text-primary-foreground"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Crea'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={newColumnOpen} onOpenChange={setNewColumnOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-md">
          <DialogHeader>
            <DialogTitle>Nuova colonna</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="Nome colonna"
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewColumnOpen(false)}>Annulla</Button>
            <Button onClick={handleAddColumn} disabled={isSubmitting}>Crea</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingColumn} onOpenChange={(o) => !o && setEditingColumn(null)}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-md">
          <DialogHeader>
            <DialogTitle>Rinomina colonna</DialogTitle>
          </DialogHeader>
          <Input
            value={editingColumn?.name || ''}
            onChange={(e) =>
              setEditingColumn((c) => (c ? { ...c, name: e.target.value } : null))
            }
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingColumn(null)}>Annulla</Button>
            <Button onClick={handleRenameColumn} disabled={isSubmitting}>Salva</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
