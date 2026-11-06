export type AdminActionState = {
  error?: string;
  success?: string;
  fieldErrors?: Record<string, string[]>;
};

export const initialAdminActionState: AdminActionState = {};
