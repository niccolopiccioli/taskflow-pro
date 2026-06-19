export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type PlanTier = 'free' | 'pro' | 'business';
export type MemberRole = 'admin' | 'member';
export type TaskPriority = 'low' | 'medium' | 'high';
export type NotificationType = 'assigned' | 'moved' | 'commented';

type TableDef<Row, Insert, Update> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export interface Database {
  public: {
    Tables: {
      profiles: TableDef<
        {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          plan: PlanTier;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          stripe_price_id: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          plan?: PlanTier;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          stripe_price_id?: string | null;
        },
        {
          full_name?: string | null;
          avatar_url?: string | null;
          plan?: PlanTier;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          stripe_price_id?: string | null;
          updated_at?: string;
        }
      >;
      workspaces: TableDef<
        {
          id: string;
          name: string;
          description: string;
          owner_id: string;
          created_at: string;
          updated_at: string;
        },
        { name: string; description?: string; owner_id: string },
        { name?: string; description?: string; updated_at?: string }
      >;
      workspace_members: TableDef<
        {
          id: string;
          workspace_id: string;
          user_id: string;
          role: MemberRole;
          joined_at: string;
        },
        { workspace_id: string; user_id: string; role?: MemberRole },
        { role?: MemberRole }
      >;
      boards: TableDef<
        {
          id: string;
          workspace_id: string;
          name: string;
          description: string;
          created_at: string;
          updated_at: string;
        },
        { workspace_id: string; name: string; description?: string },
        { name?: string; description?: string; updated_at?: string }
      >;
      columns: TableDef<
        {
          id: string;
          board_id: string;
          name: string;
          position: number;
          created_at: string;
        },
        { board_id: string; name: string; position?: number },
        { name?: string; position?: number }
      >;
      tasks: TableDef<
        {
          id: string;
          column_id: string;
          title: string;
          description: string;
          assignee_id: string | null;
          priority: TaskPriority;
          position: number;
          created_by_id: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          column_id: string;
          title: string;
          description?: string;
          assignee_id?: string | null;
          priority?: TaskPriority;
          position?: number;
          created_by_id?: string | null;
        },
        {
          column_id?: string;
          title?: string;
          description?: string;
          assignee_id?: string | null;
          priority?: TaskPriority;
          position?: number;
          updated_at?: string;
        }
      >;
      comments: TableDef<
        {
          id: string;
          task_id: string;
          user_id: string;
          content: string;
          created_at: string;
        },
        { task_id: string; user_id: string; content: string },
        { content?: string }
      >;
      notifications: TableDef<
        {
          id: string;
          user_id: string;
          type: NotificationType;
          task_id: string | null;
          read: boolean;
          created_at: string;
        },
        { user_id: string; type: NotificationType; task_id?: string | null; read?: boolean },
        { read?: boolean }
      >;
    };
    Views: Record<string, never>;
    Functions: {
      sync_profile_plan: {
        Args: {
          p_user_id: string;
          p_plan: PlanTier;
          p_stripe_customer_id?: string | null;
          p_stripe_subscription_id?: string | null;
          p_webhook_secret?: string | null;
        };
        Returns: undefined;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Workspace = Database['public']['Tables']['workspaces']['Row'];
export type WorkspaceMember = Database['public']['Tables']['workspace_members']['Row'];
export type Board = Database['public']['Tables']['boards']['Row'];
export type Column = Database['public']['Tables']['columns']['Row'];
export type Task = Database['public']['Tables']['tasks']['Row'];
export type Comment = Database['public']['Tables']['comments']['Row'];
export type Notification = Database['public']['Tables']['notifications']['Row'];

export interface WorkspaceWithMembers extends Workspace {
  members: Array<WorkspaceMember & { profile: Profile }>;
}

export interface BoardWithColumns extends Board {
  columns: Array<Column & { tasks: Array<Task & { assignee?: Profile | null }> }>;
}
