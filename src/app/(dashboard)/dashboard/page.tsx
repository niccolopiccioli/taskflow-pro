'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Layout, CheckCircle, Clock, AlertCircle, LogOut, Loader2, Mail, CreditCard, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/lib/supabase/client';
import {
  getProfile,
  getWorkspaces,
  createWorkspace,
  createBoard,
  inviteMemberByEmail,
  getBoards,
  getWorkspaceStats,
} from '@/lib/data';
import type { Profile, WorkspaceWithMembers } from '@/lib/database.types';
import { canCreateWorkspace, canAddMember, planLabel } from '@/lib/plans';

interface Board {
  id: string;
  name: string;
  columns?: Array<{ id: string; name: string }>;
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [workspaces, setWorkspaces] = useState<WorkspaceWithMembers[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<WorkspaceWithMembers | null>(null);
  const [stats, setStats] = useState({ total: 0, inProgress: 0, done: 0, boardCount: 0 });

  const [createWorkspaceOpen, setCreateWorkspaceOpen] = useState(false);
  const [createBoardOpen, setCreateBoardOpen] = useState(false);
  const [inviteMemberOpen, setInviteMemberOpen] = useState(false);

  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newBoardName, setNewBoardName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    const userProfile = await getProfile(supabase);
    if (!userProfile) {
      router.push('/login');
      return;
    }

    setProfile(userProfile);
    const ws = await getWorkspaces(supabase);
    setWorkspaces(ws);

    if (ws.length > 0) {
      const current = selectedWorkspace
        ? ws.find((w) => w.id === selectedWorkspace.id) || ws[0]
        : ws[0];
      setSelectedWorkspace(current);
      const boardsData = await getBoards(supabase, current.id);
      setBoards(boardsData);
      const statsData = await getWorkspaceStats(supabase, current.id);
      setStats(statsData);
    }
  };

  useEffect(() => {
    loadData().finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (searchParams.get('checkout') === 'success') {
      toast({
        title: 'Abbonamento attivato!',
        description: 'Il tuo piano è stato aggiornato con successo.',
      });
      router.replace('/dashboard');
    }
  }, [searchParams, toast, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const handleCreateWorkspace = async () => {
    if (!newWorkspaceName.trim() || !profile) return;

    if (!canCreateWorkspace(profile.plan, workspaces.length)) {
      toast({
        variant: 'destructive',
        title: 'Limite raggiunto',
        description: 'Passa a Pro per workspace illimitati.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await createWorkspace(supabase, newWorkspaceName);
      setCreateWorkspaceOpen(false);
      setNewWorkspaceName('');
      await loadData();
      toast({ title: 'Workspace creato' });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: error instanceof Error ? error.message : 'Errore nella creazione',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateBoard = async () => {
    if (!newBoardName.trim() || !selectedWorkspace) return;

    setIsSubmitting(true);
    try {
      await createBoard(supabase, selectedWorkspace.id, newBoardName);
      setCreateBoardOpen(false);
      setNewBoardName('');
      const boardsData = await getBoards(supabase, selectedWorkspace.id);
      setBoards(boardsData);
      toast({ title: 'Board creata' });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: error instanceof Error ? error.message : 'Errore nella creazione',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInviteMember = async () => {
    if (!inviteEmail.trim() || !selectedWorkspace || !profile) return;

    if (!canAddMember(profile.plan, selectedWorkspace.members.length)) {
      toast({
        variant: 'destructive',
        title: 'Limite membri raggiunto',
        description: 'Passa a un piano superiore per più membri.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await inviteMemberByEmail(supabase, selectedWorkspace.id, inviteEmail);
      setInviteMemberOpen(false);
      setInviteEmail('');
      await loadData();
      toast({ title: 'Membro aggiunto' });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Errore invito',
        description: error instanceof Error ? error.message : 'Impossibile invitare',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWorkspaceChange = async (workspace: WorkspaceWithMembers) => {
    setSelectedWorkspace(workspace);
    const boardsData = await getBoards(supabase, workspace.id);
    setBoards(boardsData);
    const statsData = await getWorkspaceStats(supabase, workspace.id);
    setStats(statsData);
  };

  const handleManageBilling = async () => {
    try {
      const response = await fetch('/api/stripe/portal', { method: 'POST' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      window.location.href = data.url;
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: error instanceof Error ? error.message : 'Impossibile aprire il portale.',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center shadow-lg shadow-teal-500/20">
              <span className="text-zinc-950 text-sm font-bold">TF</span>
            </div>
            TaskFlow Pro
          </Link>

          <div className="flex items-center gap-3">
            {profile && (
              <Badge variant="outline" className="border-teal-500/30 text-teal-400 gap-1">
                <Sparkles className="w-3 h-3" />
                {planLabel(profile.plan)}
              </Badge>
            )}
            {profile?.stripe_customer_id && (
              <Button variant="ghost" size="sm" onClick={handleManageBilling}>
                <CreditCard className="w-4 h-4 mr-2" />
                Fatturazione
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => setInviteMemberOpen(true)}>
              <Mail className="w-4 h-4 mr-2" />
              Invita
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Esci
            </Button>
            <div className="w-8 h-8 bg-teal-500/20 rounded-full flex items-center justify-center ring-1 ring-teal-500/30">
              <span className="text-teal-400 text-sm font-medium">
                {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-display font-bold mb-2">
            Ciao, {profile?.full_name || 'Utente'}
          </h1>
          <p className="text-muted-foreground">Benvenuto nella tua dashboard.</p>
        </motion.div>

        <div className="mb-8">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-medium text-muted-foreground">Workspace:</span>
            {workspaces.map((ws) => (
              <Button
                key={ws.id}
                variant={selectedWorkspace?.id === ws.id ? 'default' : 'outline'}
                size="sm"
                className={selectedWorkspace?.id === ws.id ? 'bg-teal-500 hover:bg-teal-400 text-zinc-950' : ''}
                onClick={() => handleWorkspaceChange(ws)}
              >
                {ws.name}
              </Button>
            ))}
            <Button variant="ghost" size="sm" onClick={() => setCreateWorkspaceOpen(true)}>
              <Plus className="w-4 h-4 mr-1" />
              Nuovo
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Task totali', value: stats.total, icon: Layout, color: 'text-teal-400' },
            { label: 'In progresso', value: stats.inProgress, icon: Clock, color: 'text-amber-400' },
            { label: 'Completati', value: stats.done, icon: CheckCircle, color: 'text-emerald-400' },
            { label: 'Board', value: stats.boardCount, icon: AlertCircle, color: 'text-zinc-400' },
          ].map((stat) => (
            <Card key={stat.label} className="border-border/60 bg-card/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="text-3xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mb-8 border-border/60 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Le tue Board</CardTitle>
            <Button
              size="sm"
              className="gap-1 bg-teal-500 hover:bg-teal-400 text-zinc-950"
              onClick={() => setCreateBoardOpen(true)}
              disabled={!selectedWorkspace}
            >
              <Plus className="w-4 h-4" />
              Nuova Board
            </Button>
          </CardHeader>
          <CardContent>
            {!selectedWorkspace ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Crea prima un workspace per iniziare.</p>
                <Button variant="outline" className="mt-4" onClick={() => setCreateWorkspaceOpen(true)}>
                  Crea workspace
                </Button>
              </div>
            ) : boards.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nessuna board ancora.</p>
                <Button variant="outline" className="mt-4" onClick={() => setCreateBoardOpen(true)}>
                  Crea la tua prima board
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {boards.map((board) => (
                  <div
                    key={board.id}
                    className="p-4 rounded-xl border border-border/60 hover:border-teal-500/40 hover:bg-teal-500/5 transition-all cursor-pointer group"
                    onClick={() =>
                      router.push(`/workspace/${selectedWorkspace.id}/board/${board.id}`)
                    }
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-teal-500/10 rounded-lg flex items-center justify-center group-hover:bg-teal-500/20 transition-colors">
                        <Layout className="w-5 h-5 text-teal-400" />
                      </div>
                      <div>
                        <p className="font-medium">{board.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {board.columns?.length || 3} colonne
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {selectedWorkspace && (
          <Card className="border-border/60 bg-card/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Membri del Workspace</CardTitle>
              <Button size="sm" variant="outline" onClick={() => setInviteMemberOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Invita
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedWorkspace.members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 rounded-lg border border-border/60">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-teal-500/20 rounded-full flex items-center justify-center">
                        <span className="text-teal-400 text-sm">
                          {member.profile.full_name?.charAt(0) || member.profile.email.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{member.profile.full_name || 'Utente'}</p>
                        <p className="text-xs text-muted-foreground">{member.profile.email}</p>
                      </div>
                    </div>
                    <Badge variant="secondary">{member.role}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <Dialog open={createWorkspaceOpen} onOpenChange={setCreateWorkspaceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crea Workspace</DialogTitle>
            <DialogDescription>Un workspace ti permette di organizzare progetti e team.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="workspace-name">Nome del workspace</Label>
              <Input
                id="workspace-name"
                placeholder="es. Project Alpha"
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateWorkspaceOpen(false)}>Annulla</Button>
            <Button onClick={handleCreateWorkspace} disabled={isSubmitting || !newWorkspaceName.trim()} className="bg-teal-500 hover:bg-teal-400 text-zinc-950">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Crea'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={createBoardOpen} onOpenChange={setCreateBoardOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crea Board</DialogTitle>
            <DialogDescription>Una board Kanban per gestire i tuoi task.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="board-name">Nome della board</Label>
              <Input
                id="board-name"
                placeholder="es. Sprint 1"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateBoardOpen(false)}>Annulla</Button>
            <Button onClick={handleCreateBoard} disabled={isSubmitting || !newBoardName.trim()} className="bg-teal-500 hover:bg-teal-400 text-zinc-950">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Crea'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={inviteMemberOpen} onOpenChange={setInviteMemberOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invita Membro</DialogTitle>
            <DialogDescription>
              Invita un nuovo membro al workspace {selectedWorkspace?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="collega@azienda.it"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteMemberOpen(false)}>Annulla</Button>
            <Button onClick={handleInviteMember} disabled={isSubmitting || !inviteEmail.trim()} className="bg-teal-500 hover:bg-teal-400 text-zinc-950">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Invia invito'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
