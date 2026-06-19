import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Inserisci un indirizzo email valido'),
  password: z.string().min(6, 'La password deve essere di almeno 6 caratteri'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Il nome deve essere di almeno 2 caratteri'),
  email: z.string().email('Inserisci un indirizzo email valido'),
  password: z.string().min(6, 'La password deve essere di almeno 6 caratteri'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Le password non coincidono',
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Inserisci un indirizzo email valido'),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(6, 'La password deve essere di almeno 6 caratteri'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Le password non coincidono',
  path: ['confirmPassword'],
});

export const taskSchema = z.object({
  title: z.string().min(1, 'Il titolo è obbligatorio').max(200),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']),
  assigneeId: z.string().optional(),
});

export const columnSchema = z.object({
  name: z.string().min(1, 'Il nome è obbligatorio').max(100),
  boardId: z.string(),
});

export const boardSchema = z.object({
  name: z.string().min(1, 'Il nome è obbligatorio').max(100),
  description: z.string().optional(),
  workspaceId: z.string(),
});

export const workspaceSchema = z.object({
  name: z.string().min(1, 'Il nome è obbligatorio').max(100),
  description: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type TaskInput = z.infer<typeof taskSchema>;
export type ColumnInput = z.infer<typeof columnSchema>;
export type BoardInput = z.infer<typeof boardSchema>;
export type WorkspaceInput = z.infer<typeof workspaceSchema>;
