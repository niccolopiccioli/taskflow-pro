'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Palette,
  Bell,
  Shield,
  Moon,
  Sun,
  Monitor,
  Loader2,
  Check,
  Sparkles,
  Mail,
  ListTodo,
  Users,
  Calendar,
  Minimize2,
  Zap,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { createClient } from '@/lib/supabase/client';
import { updateProfile } from '@/lib/data';
import type { Profile } from '@/lib/database.types';
import { planLabel } from '@/lib/plans';
import {
  useUIStore,
  ACCENT_OPTIONS,
  type ThemeMode,
  type AccentColor,
} from '@/lib/store/use-ui-store';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type SettingsTab = 'profile' | 'appearance' | 'notifications' | 'security';

const TABS: Array<{ id: SettingsTab; label: string; icon: typeof User }> = [
  { id: 'profile', label: 'Profilo', icon: User },
  { id: 'appearance', label: 'Aspetto', icon: Palette },
  { id: 'notifications', label: 'Notifiche', icon: Bell },
  { id: 'security', label: 'Sicurezza', icon: Shield },
];

const THEME_OPTIONS: Array<{
  id: ThemeMode;
  label: string;
  description: string;
  icon: typeof Moon;
  preview: string;
}> = [
  {
    id: 'dark',
    label: 'Midnight',
    description: 'Scuro elegante',
    icon: Moon,
    preview: 'bg-zinc-950 border-zinc-800',
  },
  {
    id: 'light',
    label: 'Chiaro',
    description: 'Luminoso e pulito',
    icon: Sun,
    preview: 'bg-zinc-100 border-zinc-200',
  },
  {
    id: 'system',
    label: 'Sistema',
    description: 'Segue il dispositivo',
    icon: Monitor,
    preview: 'bg-gradient-to-br from-zinc-100 to-zinc-900 border-zinc-500',
  },
];

interface AccountSettingsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile | null;
  onProfileUpdated?: (profile: Profile) => void;
}

function SettingRow({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof Bell;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-card/40 p-4">
      <div className="flex items-start gap-3 min-w-0">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export function AccountSettingsSheet({
  open,
  onOpenChange,
  profile,
  onProfileUpdated,
}: AccountSettingsSheetProps) {
  const { toast } = useToast();
  const supabase = createClient();
  const [tab, setTab] = useState<SettingsTab>('profile');
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const theme = useUIStore((s) => s.theme);
  const accent = useUIStore((s) => s.accent);
  const compactMode = useUIStore((s) => s.compactMode);
  const reduceMotion = useUIStore((s) => s.reduceMotion);
  const notifications = useUIStore((s) => s.notifications);
  const setTheme = useUIStore((s) => s.setTheme);
  const setAccent = useUIStore((s) => s.setAccent);
  const setCompactMode = useUIStore((s) => s.setCompactMode);
  const setReduceMotion = useUIStore((s) => s.setReduceMotion);
  const setNotification = useUIStore((s) => s.setNotification);

  useEffect(() => {
    if (open && profile) setFullName(profile.full_name || '');
  }, [open, profile]);

  const initials = profile?.full_name?.charAt(0).toUpperCase() || 'U';
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('it-IT', {
        month: 'long',
        year: 'numeric',
      })
    : null;

  const handleSaveProfile = async () => {
    if (!fullName.trim()) return;
    setSaving(true);
    try {
      const updated = await updateProfile(supabase, { full_name: fullName.trim() });
      onProfileUpdated?.(updated);
      toast({ title: 'Profilo aggiornato', description: 'Le modifiche sono state salvate.' });
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: e instanceof Error ? e.message : 'Salvataggio non riuscito',
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword.length < 8) {
      toast({
        variant: 'destructive',
        title: 'Password troppo corta',
        description: 'Usa almeno 8 caratteri.',
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Le password non coincidono',
      });
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setNewPassword('');
      setConfirmPassword('');
      toast({ title: 'Password aggiornata', description: 'La nuova password è attiva.' });
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: e instanceof Error ? e.message : 'Impossibile aggiornare la password',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[520px] p-0 border-border/60 bg-background/95 backdrop-blur-2xl overflow-hidden flex flex-col"
      >
        <div className="relative px-6 pt-6 pb-4 border-b border-border/60 shrink-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-amber-500/5 pointer-events-none" />
          <SheetHeader className="relative">
            <SheetTitle className="flex items-center gap-2 text-xl">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Sparkles className="h-4 w-4" />
              </div>
              Impostazioni
            </SheetTitle>
            <SheetDescription>Personalizza TaskFlow Pro come preferisci.</SheetDescription>
          </SheetHeader>
        </div>

        <div className="flex flex-1 min-h-0 flex-col sm:flex-row">
          <nav className="flex sm:flex-col gap-1 p-3 sm:p-4 sm:w-44 shrink-0 border-b sm:border-b-0 sm:border-r border-border/60 overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  'flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-all',
                  tab === t.id
                    ? 'bg-primary/15 text-primary shadow-sm'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                )}
              >
                <t.icon className="h-4 w-4 shrink-0" />
                {t.label}
              </button>
            ))}
          </nav>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                {tab === 'profile' && (
                  <>
                    <div className="flex items-center gap-4">
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold shadow-lg"
                        style={{
                          background: `linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.7))`,
                          color: 'hsl(var(--primary-foreground))',
                        }}
                      >
                        {initials}
                      </div>
                      <div>
                        <p className="font-semibold">{profile?.full_name || 'Utente'}</p>
                        <p className="text-sm text-muted-foreground">{profile?.email}</p>
                        {profile && (
                          <span className="inline-flex mt-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                            Piano {planLabel(profile.plan)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="settings-name">Nome completo</Label>
                        <Input
                          id="settings-name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Il tuo nome"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="settings-email">Email</Label>
                        <Input
                          id="settings-email"
                          value={profile?.email || ''}
                          disabled
                          className="opacity-60"
                        />
                        <p className="text-xs text-muted-foreground">
                          L&apos;email non può essere modificata da qui.
                        </p>
                      </div>
                      {memberSince && (
                        <p className="text-xs text-muted-foreground">
                          Membro da {memberSince}
                        </p>
                      )}
                      <Button
                        onClick={handleSaveProfile}
                        disabled={saving || !fullName.trim()}
                        className="w-full sm:w-auto"
                      >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Salva profilo'}
                      </Button>
                    </div>
                  </>
                )}

                {tab === 'appearance' && (
                  <>
                    <div>
                      <p className="text-sm font-medium mb-3">Tema</p>
                      <div className="grid grid-cols-3 gap-2">
                        {THEME_OPTIONS.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setTheme(opt.id)}
                            className={cn(
                              'relative rounded-xl border-2 p-3 text-left transition-all hover:scale-[1.02]',
                              theme === opt.id
                                ? 'border-primary bg-primary/5'
                                : 'border-border/60 hover:border-primary/30'
                            )}
                          >
                            <div
                              className={cn(
                                'h-10 rounded-lg border mb-2 flex items-end p-1.5 gap-0.5',
                                opt.preview
                              )}
                            >
                              <div className="w-2 h-2 rounded-sm bg-primary/80" />
                              <div className="w-4 h-1.5 rounded-sm bg-white/20" />
                            </div>
                            <opt.icon className="h-3.5 w-3.5 mb-1 text-muted-foreground" />
                            <p className="text-xs font-medium">{opt.label}</p>
                            <p className="text-[10px] text-muted-foreground">{opt.description}</p>
                            {theme === opt.id && (
                              <Check className="absolute top-2 right-2 h-3.5 w-3.5 text-primary" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <p className="text-sm font-medium mb-3">Colore accent</p>
                      <div className="flex gap-3">
                        {ACCENT_OPTIONS.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setAccent(opt.id as AccentColor)}
                            title={opt.label}
                            className={cn(
                              'relative w-10 h-10 rounded-full transition-transform hover:scale-110',
                              accent === opt.id && `ring-2 ring-offset-2 ring-offset-background ${opt.ring}`
                            )}
                            style={{ background: `hsl(${opt.hsl})` }}
                          >
                            {accent === opt.id && (
                              <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow" />
                            )}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Aggiorna pulsanti, link e highlight in tutta l&apos;app.
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <SettingRow
                        icon={Minimize2}
                        title="Interfaccia compatta"
                        description="Riduce padding e spaziature"
                      >
                        <Switch checked={compactMode} onCheckedChange={setCompactMode} />
                      </SettingRow>
                      <SettingRow
                        icon={Zap}
                        title="Riduci animazioni"
                        description="Movimenti più leggeri e veloci"
                      >
                        <Switch checked={reduceMotion} onCheckedChange={setReduceMotion} />
                      </SettingRow>
                    </div>
                  </>
                )}

                {tab === 'notifications' && (
                  <div className="space-y-3">
                    <SettingRow
                      icon={Mail}
                      title="Email di servizio"
                      description="Inviti, reset password e aggiornamenti account"
                    >
                      <Switch
                        checked={notifications.email}
                        onCheckedChange={(v) => setNotification('email', v)}
                      />
                    </SettingRow>
                    <SettingRow
                      icon={ListTodo}
                      title="Task assegnati"
                      description="Quando qualcuno ti assegna un task"
                    >
                      <Switch
                        checked={notifications.taskAssigned}
                        onCheckedChange={(v) => setNotification('taskAssigned', v)}
                      />
                    </SettingRow>
                    <SettingRow
                      icon={Users}
                      title="Aggiornamenti workspace"
                      description="Nuovi membri e modifiche al team"
                    >
                      <Switch
                        checked={notifications.workspaceUpdates}
                        onCheckedChange={(v) => setNotification('workspaceUpdates', v)}
                      />
                    </SettingRow>
                    <SettingRow
                      icon={Calendar}
                      title="Riepilogo settimanale"
                      description="Digest dei progressi ogni lunedì"
                    >
                      <Switch
                        checked={notifications.weeklyDigest}
                        onCheckedChange={(v) => setNotification('weeklyDigest', v)}
                      />
                    </SettingRow>
                    <p className="text-xs text-muted-foreground pt-2">
                      Le preferenze sono salvate su questo dispositivo.
                    </p>
                  </div>
                )}

                {tab === 'security' && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <p className="text-sm font-medium">Cambia password</p>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">Nuova password</Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Minimo 8 caratteri"
                          autoComplete="new-password"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Conferma password</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          autoComplete="new-password"
                        />
                      </div>
                      <Button
                        variant="outline"
                        onClick={handlePasswordChange}
                        disabled={saving || !newPassword}
                      >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Aggiorna password'}
                      </Button>
                    </div>

                    <Separator />

                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                      <p className="text-sm font-medium text-amber-400 mb-1">Suggerimento sicurezza</p>
                      <p className="text-xs text-muted-foreground">
                        Usa una password unica e attiva l&apos;autenticazione a due fattori dal pannello
                        Supabase quando sarà disponibile.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
