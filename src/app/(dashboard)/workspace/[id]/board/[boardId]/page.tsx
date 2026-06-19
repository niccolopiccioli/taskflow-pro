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
import { Plus, GripVertical, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { getBoardWithColumns, createTask, moveTask } from '@/lib/data';
import type { BoardWithColumns, TaskPriority } from '@/lib/database.types';

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

export default function KanbanBoardPage() {
  const params = useParams();
  const boardId = params.boardId as string;
  const supabase = createClient();

  const [board, setBoard] = useState<BoardWithColumns | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [draggedTask, setDraggedTask] = useState<{ taskId: string; columnId: string } | null>(null);
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [newTaskColumnId, setNewTaskColumnId] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadBoard = useCallback(async () => {
    const data = await getBoardWithColumns(supabase, boardId);
    setBoard(data);
    setIsLoading(false);
  }, [supabase, boardId]);

  useEffect(() => {
    loadBoard();
  }, [loadBoard]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
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
      <header className="border-b border-border/60 bg-background/80 backdrop-blur-xl flex-shrink-0 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-teal-400 transition-colors">
              Dashboard
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium font-display">{board.name}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-x-auto">
        <div className="h-full p-6">
          <div className="flex gap-6 h-full min-w-max">
            {board.columns.map((column) => (
              <div
                key={column.id}
                className="w-80 flex flex-col"
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(column.id)}
              >
                <div className="flex items-center justify-between mb-4 px-1 sticky top-0 bg-background/80 backdrop-blur py-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{column.name}</h3>
                    <Badge variant="secondary" className="text-xs bg-zinc-800">
                      {column.tasks.length}
                    </Badge>
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
                          className={`
                            bg-card/80 border border-border/60 rounded-xl p-4 cursor-grab active:cursor-grabbing
                            hover:border-teal-500/40 hover:shadow-lg hover:shadow-teal-500/5 transition-all
                            ${draggedTask?.taskId === task.id ? 'opacity-50' : ''}
                          `}
                        >
                          <div className="flex items-start gap-2">
                            <GripVertical className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`w-2 h-2 rounded-full ${priorityColors[task.priority]}`} />
                                <span className="text-xs text-muted-foreground">{priorityLabels[task.priority]}</span>
                              </div>
                              <p className="font-medium text-sm mb-3">{task.title}</p>
                              {task.assignee && (
                                <div className="flex items-center gap-2">
                                  <Avatar className="w-6 h-6">
                                    <AvatarFallback className="text-xs bg-teal-500/20 text-teal-400">
                                      {task.assignee.full_name?.slice(0, 2).toUpperCase() || 'U'}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs text-muted-foreground">{task.assignee.full_name}</span>
                                </div>
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
                  className="mt-3 justify-start text-muted-foreground hover:text-teal-400"
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

      <Dialog open={newTaskOpen} onOpenChange={setNewTaskOpen}>
        <DialogContent>
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
              className="bg-teal-500 hover:bg-teal-400 text-zinc-950"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Crea'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
